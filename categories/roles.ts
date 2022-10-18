import { category, set } from "../builder";

const roles = category({
    "Director": "",
    "Admin & Finance": "",
    "Lab Management": "Whatever it takes to keep the lab running smoothly",
    "Tech Developer": "",
    "Research Scientist": "",
    "Masters Student": "",
    "MEng. Student": "Masters of Engineering Student",
    "PhD Student": "",
    "Postdoctoral Associate": "",
    "Research Support Associate": "",
    "Visiting Student": "",
});

set("roles", roles);

export type RoleName = keyof typeof roles;