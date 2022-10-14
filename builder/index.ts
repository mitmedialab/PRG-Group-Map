import { CategoryDetails, Data, GroupMember, NormalizedData, NormalizedDetails, NormalizedMember, NormalizedTheme, NormalizedTimeFrame, PathToAsset, ProjectCollection, ProjectDetails, RoleEntries, SkillEntries, Theme, ThemeEntries, VerboseDetails, VerboseLink, VerboseRole } from "./types";
import * as fs from "fs";
import * as path from "path";
import { RoleName } from "../categories/roles";
import { ProjectName } from "../categories/projectsByTheme";

const projectRoot = path.resolve(__dirname, "..");

const assetsFolder = path.join(projectRoot, "assets");
const appFolder = path.join(projectRoot, "app");
const dataFile = path.join(appFolder, "data.json");
const graphFile = path.join(assetsFolder, "graph.json");

const encoding: BufferEncoding = "utf8";

const emptyData: NormalizedData = {
    skills: {} as NormalizedData["skills"],
    roles: {} as NormalizedData["roles"],
    themes: {} as NormalizedData["themes"],
    members: []
}

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

const normalizeTimeFrame = (timeFrame: VerboseDetails["timeFrame"]): NormalizedTimeFrame | undefined => {
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
        timeFrame: normalizeTimeFrame(verbose.timeFrame)
    } as NormalizedDetails;
    return normalized;
};

const normalizeRole = (role: GroupMember["role"]): NormalizedMember["role"] => {
    if (isString(role)) return { role: role as RoleName };
    return role as VerboseRole;
};

const normalizeMain = (projects: GroupMember["main"]): NormalizedMember["main"] => {
    if (isString(projects)) return [projects] as [ProjectName];
    return projects as ProjectCollection;
};

const normalizeMember = (member: GroupMember): NormalizedMember => {
    const { yearsActive, role, main, links } = member;
    return {
        ...member,
        yearsActive: normalizeTimeFrame(yearsActive) as NormalizedTimeFrame,
        role: normalizeRole(role),
        main: normalizeMain(main),
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

export const set = <TDataKey extends keyof Data>(field: TDataKey, value: Data[TDataKey]) => {
    const data = getData();
    const cleaned = normalize(value, field);
    if (!cleaned) throw new Error(`Data could not be cleaned for field ${field}`);
    data[field] = cleaned as NormalizedData[TDataKey];
    setData(data);
}

export const describeYourself = (member: GroupMember) => {
    const data = getData();
    data.members.push(normalizeMember(member));
    setData(data);
}

export const pathToFileInAssetsFolder = (filename: string): PathToAsset => {
    const pathToFile = path.join(assetsFolder, filename);
    if (!fs.existsSync(pathToFile)) throw new Error(`Uh oh! The path to the desired asset doesn't exist: ${filename}`);
    return { path: pathToFile };
};

export const createGraph = (): void => {
    const data = getData();
    const { skills, roles, themes, members } = data as any as NormalizedData;

    console.log(skills);
    console.log(roles);
    console.log(themes);
    console.log(members);
    // ensureAppFolder();
    // fs.writeFileSync(graphFile, JSON.stringify(data, null, 2));
}

export * from "./types";