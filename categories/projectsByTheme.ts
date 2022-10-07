import { themes, set, ValueOf, VerboseDetails } from "../builder";
import aiEd from "./themes/aiEd";
import airforce from "./themes/airforce";
import creativity from "./themes/creativity";
import ethicsPolicy from "./themes/ethicsPolicy";
import healthWellness from "./themes/healthWellness";
import robotsLiteracy from "./themes/literacy";
import multiPersonInteraction from "./themes/multiPersonInteraction";
import projectSTEM from "./themes/projectSTEM";
import socialRobotEd from "./themes/socialRobotEd";

const allThemes = themes({
    ...aiEd,
    ...ethicsPolicy,
    ...robotsLiteracy,
    ...multiPersonInteraction,
    ...healthWellness,
    ...socialRobotEd,
    ...airforce,
    ...creativity,
    ...projectSTEM
});

set("themes", allThemes);

type ProjectsAndDescription = ValueOf<{ [k in keyof typeof allThemes]: keyof typeof allThemes[k] }>;
type Remove<T, Element> = T extends Element ? never : T;

export type ThemeName = keyof typeof allThemes;
export type ProjectName = Remove<ProjectsAndDescription, "details">;