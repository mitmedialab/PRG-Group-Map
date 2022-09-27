import { EmptyDescription } from "./types"

type Skills = {
    "Dev": EmptyDescription,
    "General AI": EmptyDescription,
    "Jibo Skill": EmptyDescription,
    "Verbal & Nonverbal Behavior": EmptyDescription,
    "Vision & Sensors": EmptyDescription,
    "Ethics": EmptyDescription,
    "Policy": EmptyDescription,
    "Teacher Training": EmptyDescription,
    "Assessment": EmptyDescription,
    "Human Study Design": EmptyDescription,
    "Inclusive Education": EmptyDescription,
    "Mixed Method": EmptyDescription,
    "Statistical Analysis": EmptyDescription,
    "Child Study": EmptyDescription
}

export type Skill = keyof Skills;