import { CategoryDetails, Data, GroupMember, NormalizedData, NormalizedDetails, NormalizedMember, NormalizedTheme, NormalizedTimeFrame, PathToAsset, ProjectCollection, ProjectConnection, ProjectDetails, Role, RoleEntries, SkillEntries, Theme, ThemeEntries, VerboseDetails, VerboseLink, VerboseRole, YearsTimeFrame } from "./types";
import * as fs from "fs";
import * as path from "path";
import { RoleName } from "../categories/roles";
import { ProjectName } from "../categories/projectsByTheme";
import { isObject } from "../app/utils";
import { Flag, Message, sendToParent } from "../scripts/communication";

const projectRoot = path.resolve(__dirname, "..");

const assetsFolder = path.join(projectRoot, "assets");
const appFolder = path.join(projectRoot, "app");
const dataFile = path.join(appFolder, "data.json");
const encoding: BufferEncoding = "utf8";

const emptyData: NormalizedData = {
    skills: {} as NormalizedData["skills"],
    roles: {} as NormalizedData["roles"],
    themes: {} as NormalizedData["themes"],
    members: [],
}

export const clear = () => {
    fs.rmSync(dataFile, { force: true });
}

export const flush = <T extends NormalizedData>(data: T) => {
    setData(data);
}

/**
 * Determine whether a given date is in the past
 * @param date A date object (e.g. `new Date("October, 2022")` or `new Date("October 31, 2022")`)
 * @returns {boolean} Whether or not the provided date is in the past
 */
export const isInPast = (date: Date) => new Date(Date.now()) > date;

/**
 * 
 * @param type What kind of student are you?
 * @param startDate When did you start your program? Given in the format: `new Date("Month, Year");`
 * @param graduationDate When will you graduate? Given in the format: `new Date("Month, Year");`
 * @returns 
 * - If the student is determined to have graduated (based on their graduation date), returns just the student type as a string (e.g. `role: "PhD Student"`) and the years as a tuple of their start and end years (e.g. `years: [2020, 2022]`).
 * - If the student has not graduated, returns the calculated number of years the student has been in their program + 1 (i.e. if a student has been in their program for less than 12 months, they are a first year) 
 * (e.g. `role: { name: "PhD Student", year: 2 }, years: 2020`)
 */
export const student = <TStudent extends "PhD Student" | "Masters Student">(type: TStudent, startDate: Date, graduationDate: Date): { role: Role, years: YearsTimeFrame } => {
    if (isInPast(graduationDate)) return { role: type, years: [startDate.getFullYear(), graduationDate.getFullYear()] };

    const now = new Date(Date.now());
    const differenceMs = Math.max(now.valueOf() - startDate.valueOf(), 0);
    const differenceDate = new Date(differenceMs); // miliseconds from epoch
    const yearDifference = differenceDate.getUTCFullYear() - 1970;
    const year = Math.floor(yearDifference) + 1;
    return { role: { name: type, year }, years: startDate.getFullYear() };
}

export const init = (): NormalizedData => emptyData;

const ensureAppFolder = () => (!fs.existsSync(appFolder)) ? fs.mkdirSync(appFolder) : null;

const getData = (): NormalizedData => {
    ensureAppFolder();
    return fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, encoding)) : emptyData;
}

const setData = (data: NormalizedData) => {
    ensureAppFolder();
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

const isString = (query: any) => typeof query === 'string' || query instanceof String;

const normalizeLinks = (links: VerboseDetails["links"]): NormalizedDetails["links"] => {
    if (!links) return undefined;

    return links.map((link) => {
        if (isString(link)) return { text: link as string, url: link as string };
        return link as VerboseLink;
    });
}

const normalizeTimeFrame = (timeFrame: VerboseDetails["years"]): NormalizedTimeFrame | undefined => {
    if (!timeFrame) return undefined;

    // ex: timeFrame = 2022
    if (!Array.isArray(timeFrame)) return [[timeFrame as number, "present"]];

    // ex: timeFrame = [2020, 2022]
    if (!Array.isArray(timeFrame[0]) && timeFrame.length == 2) return [[timeFrame[0] as number, timeFrame[1] as number]];

    const length = timeFrame.length
    const lastValue = timeFrame[length - 1];

    // ex: timeFrame = [[2010, 2020], 2022]
    if (!Array.isArray(lastValue)) {
        const x = [...timeFrame];
        x[length - 1] = [lastValue, "present"];
        return x as [...[number, number][], [number, "present"]];
    }

    // ex: timeFrame = [[2010, 2019], [2020, 2021]]
    if (lastValue.length == 2) {
        return timeFrame as [number, number][] as any;
    }

    throw new Error(`Unhandled time frame layout: ${timeFrame}`);
}

const normalizeDetails = (details: CategoryDetails) => {
    if (isString(details)) return { summary: details as string };
    const verbose = details as VerboseDetails;
    const normalized = {
        ...verbose,
        links: normalizeLinks(verbose.links),
        timeFrame: normalizeTimeFrame(verbose.years)
    } as NormalizedDetails;
    return normalized;
};

const normalizeRole = (role: GroupMember["role"]): NormalizedMember["role"] => {
    if (isString(role)) return { name: role as RoleName };
    return role as VerboseRole;
};

const defaultMainProjectWeight = 50;
const defaultProjectWeight = 20;

const normalizeProjectConnection = (connection: ProjectConnection): Required<ProjectConnection> => {
    const { name, main: potentialMain, weight: potentialWeight } = connection;
    const main = potentialMain === undefined ? false : potentialMain
    const weight = potentialWeight === undefined
        ? main ? defaultMainProjectWeight : defaultProjectWeight
        : potentialWeight;
    return { name, main, weight }
}

const normalizeProjects = (projects: GroupMember["projects"], main: boolean = true): NormalizedMember["projects"] => {
    if (isString(projects)) return [{ name: projects as ProjectName, main, weight: main ? defaultMainProjectWeight : defaultProjectWeight }];
    if (isObject(projects)) return [normalizeProjectConnection(projects as ProjectConnection)];

    const projArray = projects as readonly (ProjectName | ProjectConnection)[];
    return projArray.map(proj => normalizeProjects(proj as GroupMember["projects"], false)[0]);
};

const normalizeMember = (member: GroupMember): NormalizedMember => {
    const { years, role, projects, links } = member;
    return {
        ...member,
        years: normalizeTimeFrame(years) as NormalizedTimeFrame,
        role: normalizeRole(role),
        projects: normalizeProjects(projects),
        links: normalizeLinks(links)
    };
}

const normalize = <T extends Data[TKey], TKey extends keyof NormalizedData & keyof Data>(data: T, type: TKey): NormalizedData[TKey] | undefined => {
    let normalized: any = undefined;
    switch (type) {
        case "roles":
            const roles = data as Data["roles"];
            normalized = Object.entries(roles).reduce((acc, [key, value]) => {
                // @ts-ignore
                acc[key] = normalizeDetails(value);
                return acc;
            }, {} as NormalizedData["roles"]);
            break;
        case "skills":
            const skills = data as Data["skills"];
            normalized = Object.entries(skills).reduce((acc, [key, value]) => {
                // @ts-ignore
                acc[key] = normalizeDetails(value);
                return acc;
            }, {} as NormalizedData["skills"]);
            break;
        case "themes":
            const themes = data as Data["themes"];
            normalized = {};
            for (const theme in themes) {
                const detailsAndProjects = themes[theme as keyof Data["themes"]] as Theme;
                const normal = Object.entries(detailsAndProjects).reduce((acc, [key, value]) => {
                    // @ts-ignore
                    acc[key] = normalizeDetails(value);
                    return acc;
                }, {} as NormalizedTheme);
                normalized[theme] = normal;
            }
            break;
    }
    return normalized;
};

const send = <TKey extends keyof NormalizedData>(update: { [k in TKey]: NormalizedData[TKey] }) => {
    sendToParent(process, { flag: Flag.Add, payload: update });
};

type DataKeyAndValue<T extends keyof NormalizedData> = [T, NormalizedData[T]];

export const decodeMessage = (msg: Message) => {
    const { flag, payload } = msg;
    if (flag !== Flag.Add) return undefined;
    const addition = payload as { [k in keyof NormalizedData]: NormalizedData[k] };
    const key = Object.keys(addition)[0] as keyof NormalizedData;
    const value = Object.values(addition)[0];
    return [key, value] as DataKeyAndValue<typeof key>;
}

export const set = <TDataKey extends keyof Data & keyof NormalizedData>(field: TDataKey, value: Data[TDataKey]) => {
    const normalized = normalize(value, field);

    if (!normalized) throw new Error(`Data could not be cleaned for field ${field}`);

    const update = { [field]: normalized } as { [k in TDataKey]: NormalizedData[TDataKey] };
    send(update);
}

export const describeYourself = (member: GroupMember) => {
    const normalized = normalizeMember(member);
    send({ ["members"]: [normalized] });
}

export const pathToFileInAssetsFolder = (filename: string): PathToAsset => {
    const pathToFile = path.join(assetsFolder, filename);
    if (!fs.existsSync(pathToFile)) throw new Error(`Uh oh! The path to the desired asset doesn't exist: ${filename}`);
    return { path: pathToFile };
};

export * from "./types";