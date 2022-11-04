import { category } from "../builder";

const roles = {
    "Director": {
        summary: "Summary",
        "description": "Longer description",
    },
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
};

export type RoleName = keyof typeof roles;

export default category("roles", roles);