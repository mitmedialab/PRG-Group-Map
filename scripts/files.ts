import path from 'path';

type FileDetails = {
    name: string,
    path: string,
}

export const projectRoot = path.resolve(__dirname, "..");

const getFile = (...fromRoot: string[]): FileDetails => {
    const p = path.join(projectRoot, ...fromRoot);
    return { path: p, name: path.basename(p) };
}

export const theme: FileDetails = getFile('categories', 'projectsByTheme.ts');