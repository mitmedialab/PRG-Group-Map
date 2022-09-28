import { set, ValueOf } from "../builder";
import { description as soundOfAIDescription } from "./projectDescriptions/soundOfAI";

/**
 * NOTE: Do not add any type info to this object.
 * Instead we'll have typesafety enforced by the function call at the bottom of this file.
 * This allows us to properly extract theme and project names.
 */
const projectsByTheme = {
    "AI Ed": {
        description: "",
        "Sound of AI": soundOfAIDescription,
        "Computational Action": "",
        "Data Activism": "",
        "PrimaryAI": "",
        "DAILy": "",
    },

    "Ethics & Policy": {
        description: "",
        "Ethics of Deep Fakes": "",
        "Debating technology and AI with your child": "",
        "AI & Data Privcacy": "",
        "AI & Ethics in Middle School": ""
    },

    "Social Robots & Literacy": {
        description: "",
    },

    "Multi-person Interaction": {
        description: "",
    },

    "Health & Wellness": {
        description: "",
    },

    "Social Robot Ed": {
        description: "",
    },

    "Air-Force AI Journey": {
        description: "",
    },

    "Creativity": {
        description: "",
    },

    "Project STEM": {
        description: "",
    }
}

set("themes", projectsByTheme);

type ProjectsAndDescription = ValueOf<{ [k in keyof typeof projectsByTheme]: keyof typeof projectsByTheme[k] }>;
type RemoveDescription<T> = T extends "description" ? never : T;

export type ThemeName = keyof typeof projectsByTheme;
export type ProjectName = RemoveDescription<ProjectsAndDescription>