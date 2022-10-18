import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Sam Spaulding",
    email: "samuelsp@media.mit.edu",
    bio: "",
    role: "PhD Student",
    projects: [{ project: "Adult Language Teaching", main: true }, "Early Literacy"],
    skills: ["Human Study Design", "Jibo Skill", "Reinforcement Learning", "Statistical Analysis"],
    yearsActive: [2018, 2022],
});