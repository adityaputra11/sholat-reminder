import { parseTime } from "../time";

describe("parseTime", () => {
  it("should parse a valid time string", () => {
    expect(parseTime("05:30")).toEqual([5, 30]);
  });

  it("should throw an error for invalid time format", () => {
    expect(() => parseTime("invalid")).toThrow();
  });
});
