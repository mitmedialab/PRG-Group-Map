import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Xiajie (Brayden) Zhang",
    email: "",
    bio: "",
    role: { role: "PhD Student", year: 1 },
    projects: [
        "Early Literacy",
        { project: "Exploration Literacy", main: true }
    ],
    skills: ["Dev", "Jibo Skill", "Reinforcement Learning", "Robot Engineering", "Child-Robot Interaction"],
    yearsActive: 2018
});