import { person } from "../builder";

export default person({
    name: "Xiajie (Brayden) Zhang",
    email: "",
    bio: "",
    role: { name: "PhD Student", year: 1 },
    projects: [
        "Early Literacy",
        { name: "Exploration Literacy", main: true }
    ],
    skills: ["Dev", "Jibo Skill", "Reinforcement Learning", "Robot Engineering", "Child-Robot Interaction"],
    years: 2018
});