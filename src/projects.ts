import { EmptyDescription, ValueOf } from "./types"

type ProjectsByTheme = {
    "AI Ed": {
        description: EmptyDescription,
        "Sound of AI": EmptyDescription,
        "Computational Action": EmptyDescription,
        "Data Activism": EmptyDescription,
        "PrimaryAI": EmptyDescription,
        "DAILy": EmptyDescription,
    },
    
    "Ethics & Policy":  {
        description: EmptyDescription,
        "Ethics of Deep Fakes": EmptyDescription,
        "Debating technology and AI with your child": EmptyDescription,
        "AI & Data Privcacy": EmptyDescription,
        "AI & Ethics in Middle School": EmptyDescription
    },

    "Social Robots & Literacy": {
        description: EmptyDescription,
    },

    "Multi-person Interaction": {
        description: EmptyDescription,
    },

    "Health & Wellness": {
        description: EmptyDescription,
    },

    "Social Robot Ed": {
        description: EmptyDescription,
    },

    "Air-Force AI Journey": {
        description: EmptyDescription,
    },

    "Creativity": {
        description: EmptyDescription,
    },

    "Project STEM": {
        description: EmptyDescription,
    }
}

type ProjectsAndDescription = ValueOf< {[k in keyof ProjectsByTheme]: keyof ProjectsByTheme[k]} >;
type RemoveDescription<T> = T extends "description" ? never : T;
export type Project = RemoveDescription<ProjectsAndDescription>