import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Sam Spaulding",
    email: "samuelsp@media.mit.edu",
    //photo: pathToFileInAssetsFolder("parker.png"),
    bio: "",
    role: "PhD Student",
    projects: ["Adult Language Teaching", "Early Literacy"],
    skills: ["Human Study Design", "Jibo Skill", "Reinforcement Learning", "Statistical Analysis"],
    main: ["Adult Language Teaching"],
    yearsActive: [2018,2022],
});