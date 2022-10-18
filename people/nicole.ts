import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Nicole Pang",
    email: "",
    bio: "",
    role: "MEng. Student",
    projects: [
        "Ethics of Deepfakes",
        "Debating technology and AI with your child",
        "AI & Data Privacy",
        "AI & Ethics in Middle School",
        { project: "Computational Action", main: true },
    ],
    skills: ["Ethics", "General AI"],
    yearsActive: [2021, 2022],
});