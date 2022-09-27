import { GroupMember, PathToAsset } from "./types";
import * as fs from "fs";

import * as path from "path";

const assetsFolder = path.resolve(__dirname, "..", "assets");

export const pathToFileInAssetsFolder = (filename: string): PathToAsset => {
    const pathToFile = path.join(assetsFolder, filename);
    if (!fs.existsSync(pathToFile)) throw new Error(`Uh oh! The path to the desired asset doesn't exist: ${filename}`);
    return { path: pathToFile };
};

export const describeYourself = (member: GroupMember) => {

}