import { category, dirnameFromImportURL, GroupMember, importDefaultsFromChildFiles } from "../builder";

const __dirname = dirnameFromImportURL(import.meta.url);
const imports = importDefaultsFromChildFiles<GroupMember>(__dirname);
const members = await Promise.all(imports);
export default category("people", members);