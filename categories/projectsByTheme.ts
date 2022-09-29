import { set, ValueOf } from "../builder";
import aiEd from "./themes/aiEd";
import airforce from "./themes/airforce";
import creativity from "./themes/creativity";
import ethicsPolicy from "./themes/ethicsPolicy";
import healthWellness from "./themes/healthWellness";
import robotsLiteracy from "./themes/literacy";
import multiPersonInteraction from "./themes/multiPersonInteraction";
import projectSTEM from "./themes/projectSTEM";
import socialRobotEd from "./themes/socialRobotEd";

/**
 * NOTE: Do not add any type info to this object.
 * Instead we'll have typesafety enforced by the function call at the bottom of this file.
 * This allows us to properly extract theme and project names.
 */
const projectsByTheme = {
    "AI Ed": {
        summary: "",
        ...aiEd
    },

    "Ethics & Policy": {
        summary: "",
        ...ethicsPolicy
    },

    "Social Robots & Literacy": {
        summary: "",
        ...robotsLiteracy
    },

    "Multi-person Interaction": {
        summary: "",
        ...multiPersonInteraction
    },

    "Health & Wellness": {
        summary: "",
        ...healthWellness
    },

    "Social Robot Ed": {
        summary: "",
        ...socialRobotEd
    },

    "Air-Force AI Journey": {
        summary: "",
        ...airforce
    },

    "Creativity": {
        summary: "",
        ...creativity
    },

    "Project STEM": {
        summary: "",
        ...projectSTEM
    }
}

set("themes", projectsByTheme);

type ProjectsAndDescription = ValueOf<{ [k in keyof typeof projectsByTheme]: keyof typeof projectsByTheme[k] }>;
type RemoveDescription<T> = T extends "description" ? never : T;

export type ThemeName = keyof typeof projectsByTheme;
export type ProjectName = RemoveDescription<ProjectsAndDescription>