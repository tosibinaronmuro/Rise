import { describe, it } from "mocha"; // Use correct import for describe and it
import { expect } from "chai"; // Import the expect assertion library
import { sum } from "../testing"; // Assuming this is the correct path to your testing file

const successCases = [
  {
    id: 0,
    input: { a: 1, b: 1 },
    output: 2,
  },
  {
    id: 1,
    input: { a: 2, b: 1 },
    output: 3,
  },
  {
    id: 2,
    input: { a: 4, b: 6 },
    output: 10,
  },
  {
    id: 3,
    input: { a: 10, b: 1 },
    output: 11,
  },
];

describe("test function", () => {
  successCases.forEach(({ id, input, output }) => {
    it(`success case ${id}`, () => {
      const { a, b } = input;
      expect(sum(a, b)).to.equal(output);
    });
  });
});
