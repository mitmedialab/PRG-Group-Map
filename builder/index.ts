import { CategoryDetails, Data, GroupMember, NormalizedData, NormalizedDetails, NormalizedMember, NormalizedTheme, NormalizedTimeFrame, PathToAsset, ProjectCollection, ProjectConnection, ProjectDetails, RoleEntries, SkillEntries, Theme, ThemeEntries, VerboseDetails, VerboseLink, VerboseRole } from "./types";
import * as fs from "fs";
import * as path from "path";
import { RoleName } from "../categories/roles";
import { ProjectName } from "../categories/projectsByTheme";
import { isObject } from "../app/utils";
import { v4 as uuidv4 } from 'uuid';
import { Flag, sendToParent } from "../scripts/communication";

const projectRoot = path.resolve(__dirname, "..");

const builderFolder = path.resolve(projectRoot, 'builder');
const fragmentsFolder = path.join(builderFolder, 'fragments');

const assetsFolder = path.join(projectRoot, "assets");
const appFolder = path.join(projectRoot, "app");
const dataFile = path.join(appFolder, "data.json");
const graphFile = path.join(assetsFolder, "graph.json");

const encoding: BufferEncoding = "utf8";

const emptyData: NormalizedData = {
    skills: {} as NormalizedData["skills"],
    roles: {} as NormalizedData["roles"],
    themes: {} as NormalizedData["themes"],
    members: [],
    memberLookup: {}
}

export const clear = () => {
    fs.rmSync(fragmentsFolder, { force: true, recursive: true });
    fs.rmSync(dataFile, { force: true });
}

const ensureAppFolder = () => (!fs.existsSync(appFolder)) ? fs.mkdirSync(appFolder) : null;

const getData = (file?: string): NormalizedData => {
    ensureAppFolder();
    return fs.existsSync(file ?? dataFile) ? JSON.parse(fs.readFileSync(file ?? dataFile, encoding)) : emptyData;
}

const setData = (data: NormalizedData, file?: string) => {
    ensureAppFolder();
    fs.writeFileSync(file ?? dataFile, JSON.stringify(data, null, 2));
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

const getNewFragmentFile = () => {
    if (!fs.existsSync(fragmentsFolder)) fs.mkdirSync(fragmentsFolder);
    return path.join(fragmentsFolder, uuidv4())
};

export const set = <TDataKey extends keyof Data>(field: TDataKey, value: Data[TDataKey], x = __filename) => {
    const data = getData();
    const fragment = getNewFragmentFile();

    const cleaned = normalize(value, field);
    if (!cleaned) throw new Error(`Data could not be cleaned for field ${field}`);
    data[field] = cleaned as NormalizedData[TDataKey];
    setData(data, fragment);
    sendToParent(process, { flag: Flag.WroteFragment, payload: fragment });
}

export const describeYourself = (member: GroupMember) => {
    const data = getData();
    const fragment = getNewFragmentFile();

    data.members.push(normalizeMember(member));

    setData(data, fragment);
    sendToParent(process, { flag: Flag.WroteFragment, payload: fragment });
}

export const joinFragments = (fragment1: string, fragment2: string) => {
    const a = getData(fragment1);
    const b = getData(fragment2);

    fs.rmSync(fragment1);
    fs.rmSync(fragment2);

    const fragment = getNewFragmentFile();

    setData({
        roles: { ...a.roles, ...b.roles },
        skills: { ...a.skills, ...b.skills },
        themes: { ...a.themes, ...b.themes },
        members: [...a.members, ...b.members],
        memberLookup: {}
    }, fragment);

    sendToParent(process, { flag: Flag.WroteFragment, payload: fragment });
};

export const saveOffData = (fragment: string) => {
    // TODO
}

export const pathToFileInAssetsFolder = (filename: string): PathToAsset => {
    const pathToFile = path.join(assetsFolder, filename);
    if (!fs.existsSync(pathToFile)) throw new Error(`Uh oh! The path to the desired asset doesn't exist: ${filename}`);
    return { path: pathToFile };
};

export * from "./types";