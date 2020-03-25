import axios from "axios";
import { Result, Ok, Err } from "@usefultools/monads";

/**
 * Represents a CSV schema, where a "format" is defined by the date when the format was established, along with the indexes of each field contained in the CSV file.
 */
export interface Format {
    dateEffective: Date;
    fields: { [key: string]: number };
}

/**
 * The original JHU data format.
 */
export const LegacyFormat: Format = {
    dateEffective: new Date("February 14, 2020"),
    fields: { province: 0, country: 1, lastUpdated: 2, confirmed: 3, deaths: 4, recovered: 5 },
};

/**
 * The original JHU data format, but with latitude and longitude data.
 */
export const GeographicallyAwareFormat: Format = {
    dateEffective: new Date("March 1, 2020"),
    fields: {
        province: 0,
        country: 1,
        lastUpdated: 2,
        confirmed: 3,
        deaths: 4,
        recovered: 5,
        latitude: 6,
        longitude: 7,
    },
};

/**
 * The original JHU data format, but with a unique identifier attached to each location (also, optionally, county names).
 */
export const CountyAwareFormat: Format = {
    dateEffective: new Date("March 23, 2020"),
    fields: {
        id: 0,
        county: 1,
        province: 2,
        country: 3,
        lastUpdated: 4,
        latitude: 5,
        longitude: 6,
        confirmed: 7,
        deaths: 8,
        recovered: 9,
        active: 10,
        fullName: 11,
    },
};

const formats: Format[] = [LegacyFormat, GeographicallyAwareFormat, CountyAwareFormat];

/**
 * A type representing the inability
 */
export interface NoApplicableTypeError {
    uncoveredDate: Date;
}

/**
 * Gets the format associated with a particular timestamp.
 *
 * @param d {Date} the date for which data should be fetched from the JHU repo
 */
export const formatForDate = (d: Date): Result<Format, NoApplicableTypeError> => {
    for (const format of Array.from(formats).reverse()) {
        if (format.dateEffective <= d) {
            return Ok(format);
        }
    }

    return Err({ uncoveredDate: d });
};

/**
 * Constructs a URL representing a potentially valid CSV file corresponding to such a date.
 *
 * @param d {Date} the date for which a URL pointing to the corresponding JHU CSV file should be constructed
 */
export const dumpURLForDate = (d: Date): string => {
    const dateFormats = [{ month: "2-digit" }, { day: "2-digit" }, { year: "numeric" }];

    const stringDate: string = dateFormats
        .map((dateFormat) => new Intl.DateTimeFormat("en", dateFormat).format(d))
        .join("-");

    return `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${stringDate}.csv`;
};

/**
 * Metadata associated with a JHU data dump. This includes the last timestamp associated with an update action targeting this dump, the dump's latitude and longitude, the country and--optionally--the county and province.
 */
export interface DumpMetadata {
    lastUpdated: Date;

    longitude?;
    latitude?: number;

    county?;
    province?: string;
    country: string;
}

/**
 * An individual entry in the JHU data dump repo.
 */
export interface Dump {
    metadata: DumpMetadata;

    confirmed: number;
    deaths: number;
    recovered: number;
}

export class DumpRetrievalConfig {
    format?: Format;

    constructor(format?: Format) {
        if (format) {
            this.format = format;
        }
    }
}

/*
export const retrieveDump = async (d: Date, config?: DumpRetrievalConfig): Dump => {
    const rawDump = await axios.get(dumpURLForDate(d));


};
*/
