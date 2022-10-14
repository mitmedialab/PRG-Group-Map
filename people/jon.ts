import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Jon Ferguson",
    email: "jon@media.mit.edu",
    //photo: pathToFileInAssetsFolder("parker.png"),
    bio: "",
    role: "Tech Developer",
    projects: ["Jibo"],
    skills: [],
});