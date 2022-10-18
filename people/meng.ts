import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Meng Xi",
    email: "",
    //photo: pathToFileInAssetsFolder("parker.png"),
    bio: "The Most Interesting Man in the World",
    role: "Lab Management",
    projects: ["Robots in the Home", "Early Literacy", "Exploration Literacy", "Wellness", "Autonomous Agents"],
    skills: ["Robot Engineering"],
    yearsActive: 2016,
});