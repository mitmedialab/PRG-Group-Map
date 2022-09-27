import { EmptyDescription } from "./types";

type Roles = {
    "Admin & Finance": EmptyDescription,
    "Lab Management": "Whatever it takes to keep the lab running smoothly",
    "Tech Developer": EmptyDescription,
    "Research Scientist": EmptyDescription,
    "Masters Student": EmptyDescription,
    "PhD Student": EmptyDescription,
}

export type Role = keyof Roles;