import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Parker Malachowsky",
    email: "pmalacho@media.mit.edu",
    //photo: pathToFileInAssetsFolder("parker.png"),
    bio: "just a kid",
    role: "Tech Developer",
    projects: ["Sound of AI"],
    skills: ["General AI"],
    yearsActive: 2020
});