import path from 'path';
import fs from "fs";
import { Data, dirnameFromImportURL, NormalizedData, UnionToTuple } from 'builder';

type FileDetails = {
    name: string,
    path: string,
}

const __dirname = dirnameFromImportURL(import.meta.url);
export const projectRoot = path.resolve(__dirname, "..");

export const getFileFromRoot = (...fromRoot: string[]): FileDetails => {
    const p = path.join(projectRoot, ...fromRoot);
    return { path: p, name: path.basename(p) };
}

export const dataFile: FileDetails = getFileFromRoot('app', 'src', 'lib', 'data', 'graph.json');

export const getDirectory = (name: string) => path.join(projectRoot, name);
export const getScript = (name: string) => path.join(projectRoot, "scripts", name);

export const enum Category {
    Projects = "projects",
    People = "people",
    Roles = "roles",
    Skills = "skills",
    Themes = "themes"
};

export const categories: UnionToTuple<Category> & (keyof Data & keyof NormalizedData)[] = [Category.Projects, Category.People, Category.Roles, Category.Skills, Category.Themes];

export const directories = categories.reduce((acc, name) => {
    const dir = getDirectory(name);
    if (!fs.existsSync(dir)) throw new Error(`Directory does not exist for category: ${name}`);
    acc[name] = dir;
    return acc;
}, {} as Record<Category, string>);

export const getDataForDir = async <T extends keyof NormalizedData = any>(path: string) => (await import(path)).default as NormalizedData[T];