import { category, set } from "../builder";

const roles = category({
    "Admin & Finance": "",
    "Lab Management": "Whatever it takes to keep the lab running smoothly",
    "Tech Developer": "",
    "Research Scientist": "",
    "Masters Student": "",
    "PhD Student": "",
});

set("roles", roles);

export type RoleName = keyof typeof roles;