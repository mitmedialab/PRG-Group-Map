import { describeYourself, pathToFileInAssetsFolder } from "../src/builder";

describeYourself({
    name: "Parker Malachowsky",
    email: "pmalacho@media.mit.edu",
    pathToPhoto: pathToFileInAssetsFolder("parker.png"),
    bio: "just a kid",
    role: "Tech Developer",
    projects: ["Sound of AI"],
    skills: ["General AI"],
    yearsActive: 2020
});