import * as fs from "fs";
import * as path from "path";
import glob from "glob";
import { RoleName } from "roles";
import { ProjectName } from "projects";
import { fileURLToPath } from "url";
import { ThemeName } from "themes";
import { CategoryDetails, Data, Person, NormalizedData, NormalizedDetails, NormalizedPerson, NormalizedTimeFrame, PathToAsset, Collection, Connection, ProjectDetails, VerboseDetails, VerboseLink, VerboseRole, NormalizedCollection } from "builder/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

export const dirnameFromImportURL = (importMetaUrl: string) => path.dirname(fileURLToPath(importMetaUrl));

const assetsFolder = path.join(projectRoot, "assets");
const appFolder = path.join(projectRoot, "app");
const dataFile = path.join(appFolder, "src", "data.json");
const encoding: BufferEncoding = "utf8";

export const read = (): NormalizedData => JSON.parse(fs.readFileSync(dataFile, 'utf8'));
export const flush = <T extends NormalizedData>(data: T) => setData(data);

const ensureAppFolder = () => (!fs.existsSync(appFolder)) ? fs.mkdirSync(appFolder) : null;

const setData = (data: NormalizedData) => {
    ensureAppFolder();
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), encoding);
}

const isString = (query: any) => typeof query === 'string' || query instanceof String;
const isObject = <T>(x: T) => !Array.isArray(x) && typeof x === 'object' && x !== null;

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

const normalizeRole = (role: Person["role"]): NormalizedPerson["role"] => {
    if (isString(role)) return { name: role as RoleName };
    return role as VerboseRole;
};

const defaultMainProjectWeight = 6;
const defaultProjectWeight = 2;

const normalizeConnection = <T extends ProjectName | ThemeName>(connection: Connection<T>): Required<Connection<T>> => {
    const { name, main: potentialMain, weight: potentialWeight } = connection;
    const main = potentialMain === undefined ? false : potentialMain
    const weight = potentialWeight === undefined
        ? main ? defaultMainProjectWeight : defaultProjectWeight
        : (potentialWeight/10>>0);
    return { name, main, weight }
}

const normalizeCollection = <T extends ProjectName | ThemeName>(projects: Collection<T>, main: boolean = true): NormalizedCollection<T> => {
    if (isString(projects)) return [{ name: projects as T, main, weight: main ? defaultMainProjectWeight : defaultProjectWeight }];
    if (isObject(projects)) return [normalizeConnection(projects as Connection<T>)];

    const projArray = projects as readonly (T | Connection<T>)[];
    return projArray.map(proj => normalizeCollection(proj as Connection<T>, false)[0]);
};

const normalizePerson = (member: Person): NormalizedPerson => {
    const { years, role, projects, links } = member;
    return {
        ...member,
        years: normalizeTimeFrame(years) as NormalizedTimeFrame,
        role: normalizeRole(role),
        projects: normalizeCollection(projects),
        links: normalizeLinks(links)
    };
}

const normalizeObject = <T>(obj: any) => Object.entries(obj).reduce((acc, [key, value]) => {
    // @ts-ignore
    acc[key] = normalizeDetails(value);
    return acc;
}, {} as T);

const normalize = <T extends Data[TKey], TKey extends keyof NormalizedData & keyof Data>(data: T, type: TKey): NormalizedData[TKey] | undefined => {
    let normalized: any = undefined;
    switch (type) {
        case "people":
            const people = data as Data["people"];
            normalized = people.map(person => normalizePerson(person));
            break;
        case "roles":
        case "skills":
        case "themes":
            normalized = normalizeObject(data);;
            break;
        case "projects":
            const projects = data as Data["projects"];
            normalized = {};
            for (const projectName in projects) {
                const project = projects[projectName] as ProjectDetails;
                const details = normalizeDetails(project);
                const themes = normalizeCollection(project.themes);
                normalized[projectName] = { ...details, themes };
            }
            break;
    }
    return normalized;
};

export const category = <TDataKey extends keyof Data & keyof NormalizedData>(field: TDataKey, value: Data[TDataKey]): NormalizedData[TDataKey] => {
    const normalized = normalize(value, field);
    if (!normalized) throw new Error(`Data could not be cleaned for field ${field}`);
    return normalized;
}

export const person = (member: Person) => member;

export const pathToFileInAssetsFolder = (filename: string): PathToAsset => {
    const pathToFile = path.join(assetsFolder, filename);
    if (!fs.existsSync(pathToFile)) throw new Error(`Uh oh! The path to the desired asset doesn't exist: ${filename}`);
    return { path: pathToFile };
};

export const getChildFiles = (directory: string) => {
    const query = path.join(directory, "*.ts");
    const result = glob.sync(query);
    return result.filter(file => path.basename(file) !== "index.ts");
};

export const getChildFileNames = (directory: string) => getChildFiles(directory).map(file => path.basename(file).replace(path.extname(file), ""));
export const importDefault = async <T>(directory: string, filename: string) => (await import(path.join(directory, filename))).default as T;
export const importDefaultsFromChildFiles = <T>(directory: string) => getChildFileNames(directory).map(filename => importDefault<T>(directory, filename));

export * from "./types";
export * from "./helpers";