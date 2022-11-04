import path from 'path';
import { dirnameFromImportURL } from '../builder';

type FileDetails = {
    name: string,
    path: string,
}

const __dirname = dirnameFromImportURL(import.meta.url);
export const projectRoot = path.resolve(__dirname, "..");

const getFile = (...fromRoot: string[]): FileDetails => {
    const p = path.join(projectRoot, ...fromRoot);
    return { path: p, name: path.basename(p) };
}

export const dataFile: FileDetails = getFile('app', 'data.json');