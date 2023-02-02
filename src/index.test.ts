import { nabo } from "./index";
import { expect, test } from "vitest";

test("interpolate word with a single variable", () => {
	const data = {
		name: "Emilio Barradas",
	};

	const template = "{name}";
	const expected = "Emilio Barradas";

	expect(nabo(template, data)).toBe(expected);
});

test("interpolate text with a single variable", () => {
	const data = {
		name: "Emilio Barradas",
	};

	const template = "Hello my name is {name}.";
	const expected = "Hello my name is Emilio Barradas.";

	expect(nabo(template, data)).toBe(expected);
});

test("interpolate text with multiple variables", () => {
	const data = {
		name: "Emilio Barradas",
		age: 22,
		major: "Computer Science",
		school: "Purdue University",
	};

	const template =
		"Hello my name is {name}. I am {age} years old. I study {major} at {school}.";
	const expected =
		"Hello my name is Emilio Barradas. I am 22 years old. I study Computer Science at Purdue University.";

	expect(nabo(template, data)).toBe(expected);
});

test("interpolate text with a nested structure", () => {
	const data = {
		user: {
			name: "Emilio Barradas",
			age: 22,
			major: "Computer Science",
			school: {
				name: "Purdue University",
				city: "West Lafayette",
				state: "Indiana",
			},
		},
	};

	const template =
		"Hello my name is {user.name}. I am {user.age} years old. I study {user.major} at {user.school.name} in {user.school.city}, {user.school.state}.";
	const expected =
		"Hello my name is Emilio Barradas. I am 22 years old. I study Computer Science at Purdue University in West Lafayette, Indiana.";

	expect(nabo(template, data)).toBe(expected);
});

test("interpolate text with mixed structure", () => {
	const data = {
		personCount: "two",
		firstPerson: {
			name: "John Doe",
		},
		secondPerson: {
			name: "Jane Doe",
		},
	};

	const template =
		"There are {personCount} people. The first person is called {firstPerson.name}. The second person is called {secondPerson.name}.";
	const expected =
		"There are two people. The first person is called John Doe. The second person is called Jane Doe.";

	expect(nabo(template, data)).toBe(expected);
});
