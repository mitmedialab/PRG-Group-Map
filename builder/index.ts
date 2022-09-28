import { Data, GroupMember, PathToAsset, RoleEntries, SkillEntries, Theme, ThemeEntries } from "./types";
import * as fs from "fs";
import * as path from "path";

const projectRoot = path.resolve(__dirname, "..");

const assetsFolder = path.join(projectRoot, "assets");
const appFolder = path.join(projectRoot, "app");
const dataFile = path.join(appFolder, "data.json");

const encoding: BufferEncoding = "utf8";

const emptyData: Data = {
    skills: {},
    roles: {},
    themes: {},
    members: []
}

const ensureAppFolder = () => (!fs.existsSync(appFolder)) ? fs.mkdirSync(appFolder) : null;

const getData = (): Data => {
    ensureAppFolder();
    return fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, encoding)) : emptyData;
}

const setData = (data: Data) => {
    ensureAppFolder();
    fs.writeFileSync(dataFile, JSON.stringify(data));
}

export const pathToFileInAssetsFolder = (filename: string): PathToAsset => {
    const pathToFile = path.join(assetsFolder, filename);
    if (!fs.existsSync(pathToFile)) throw new Error(`Uh oh! The path to the desired asset doesn't exist: ${filename}`);
    return { path: pathToFile };
};

export const set = <TDataKey extends keyof Data>(field: TDataKey, value: Data[TDataKey]) => {
    const data = getData();
    data[field] = value;
    setData(data);
}

export const describeYourself = (member: GroupMember) => {
    const data = getData();
    data.members.push(member);
    setData(data);
}

export * from "./types";