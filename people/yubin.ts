import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Yubin Kim",
    email: "ybkim95@media.mit.edu",
    //photo: pathToFileInAssetsFolder("parker.png"),
    bio: "",
    role: "Visiting Student",
    projects: ["Robots in the Home","Autonomous Agents"],
    skills: ["Dev","General AI","Verbal & Nonverbal Behavior","Vision & Sensors"],
    main: "Robots in the Home",
    yearsActive: 2022
});