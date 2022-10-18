import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Jeff Freilich",
    email: "freilich@media.mit.edu ",
    //photo: pathToFileInAssetsFolder("parker.png"),
    bio: "",
    role: "Admin & Finance",
    projects: ["Autonomous Agents","Doodle Bot","Computational Action","Day of AI"],
    skills: ["Project Management"],
    yearsActive: 2021,
});