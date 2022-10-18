import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Raul Alcantara",
    email: "ralcanta@mit.edu",
    //photo: pathToFileInAssetsFolder("parker.png"),
    bio: "",
    role: "MEng. Student",
    projects: ["Doodle Bot"],
    skills: ["Dev"],
    main: "Doodle Bot",
    yearsActive: 2022
});