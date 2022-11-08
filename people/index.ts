import { category, dirnameFromImportURL, Person, importDefaultsFromChildFiles } from "../builder";

const __dirname = dirnameFromImportURL(import.meta.url);
const imports = importDefaultsFromChildFiles<Person>(__dirname);
const members = await Promise.all(imports);
export default category("people", members);