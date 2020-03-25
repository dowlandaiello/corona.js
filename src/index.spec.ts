import {
    formatForDate,
    LegacyFormat,
    Format,
    NoApplicableTypeError,
    GeographicallyAwareFormat,
    CountyAwareFormat,
    dumpURLForDate,
    retrieveDump,
} from "./index";
import { Result } from "@usefultools/monads";
import { expect } from "chai";
import "mocha";

describe("formatForDate", () => {
    const test = (res: Result<Format, NoApplicableTypeError>, desiredFormat: Format): void => {
        res.match({
            ok: (val: Format): void => {
                expect(val).to.equal(desiredFormat);
            },
            err: (val: NoApplicableTypeError): void => {
                throw new Error(JSON.stringify(val));
            },
        });
    };

    it("should return an instance of the legacy format, as the selected date is before all other specifications were published", () => {
        let format: Result<Format, NoApplicableTypeError> = formatForDate(new Date("February 14, 2020"));
        test(format, LegacyFormat);

        format = formatForDate(new Date("February 29, 2020"));
        test(format, LegacyFormat);
    });

    it("should return an instance of the geographically aware format, as the selected date is between the two valid specifications", () => {
        let format: Result<Format, NoApplicableTypeError> = formatForDate(new Date("March 1, 2020"));
        test(format, GeographicallyAwareFormat);

        format = formatForDate(new Date("March 22, 2020"));
        test(format, GeographicallyAwareFormat);
    });

    it("should return an instance of the county aware format, as the selected date is after all of the specification release dates", () => {
        let format: Result<Format, NoApplicableTypeError> = formatForDate(new Date("March 23, 2020"));
        test(format, CountyAwareFormat);

        format = formatForDate(new Date());
        test(format, CountyAwareFormat);
    });
});

describe("dumpURLForDate", () => {
    it("should return a string containing a properly formatted date, matchable via a guarding regular expression (MM-DD-YYYY)", () => {
        const dumpURL = dumpURLForDate(new Date());

        const matchPattern = /\d{2}-\d{2}-\d{4}/;
        expect(dumpURL.match(matchPattern).length).to.be.greaterThan(0);
    });
});

describe("retrieveDump", () => {
    retrieveDump(new Date());
});
