import { formatForDate, LegacyFormat } from "./index";
import { expect } from "chai";
import "mocha";

describe("formatForDate", () => {
    it("should return an instance of the legacy format, as the selected date is before all other specifications were published", () => {
        const format = formatForDate(new Date("February 14, 2020"));

        expect(format).to.equal(LegacyFormat);
    });
});
