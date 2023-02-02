type PathObject<Text extends string> =
	Text extends `${infer Name}.${infer Rest}`
		? { [K in Name]: PathObject<Rest> }
		: { [K in Text]: string | number | boolean | bigint };

type Variables<Text extends string> =
	Text extends `${string}{${infer Path}}${infer Rest}`
		? PathObject<Path> & Variables<Rest>
		: {};

type TextNode = { type: "text"; text: string };
type VariableNode = { type: "variable"; path: string };
type StringNode = TextNode | VariableNode;

export const nabo = <T extends string>(template: T, input: Variables<T>) => {
	return toTextNodes(getStringNodes(template), input)
		.map(({ text }) => text)
		.join("");
};

const getStringNodes = (text: string) => {
	const nodes: StringNode[] = [];

	let curText = "";

	for (const char of text) {
		if (char === "{") {
			nodes.push({ type: "text", text: curText });
			curText = "";
			continue;
		}

		if (char === "}") {
			nodes.push({ type: "variable", path: curText });
			curText = "";
			continue;
		}

		curText += char;
	}

	nodes.push({ type: "text", text: curText });

	return nodes;
};

const toTextNodes = <T extends string>(
	stringNodes: StringNode[],
	input: Variables<T>
) => {
	const textNodes: TextNode[] = [];

	for (const stringNode of stringNodes) {
		if (stringNode.type === "text") {
			textNodes.push(stringNode);
			continue;
		}

		textNodes.push(toTextNode(stringNode, input));
	}

	return textNodes;
};

const toTextNode = <T extends string>(
	variableNode: VariableNode,
	input: Variables<T>
) => {
	return {
		type: "text",
		text: (
			getPathValue(input, variableNode.path) ?? "undefined"
		).toString(),
	} satisfies TextNode;
};

const getPathValue = <T = unknown>(data: Record<string, any>, path: string) => {
	const pathSegments = path.split(".");

	let result = data;

	for (let i = 0; i < pathSegments.length; i++) {
		const segment = pathSegments[i];

		if (segment === undefined) {
			return undefined;
		}

		result = result[segment];

		if (!result) {
			return undefined;
		}
	}

	return result as T;
};
