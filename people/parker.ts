import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Parker Malachowsky",
    email: "pmalacho@media.mit.edu",
    //photo: pathToFileInAssetsFolder("parker.png"),
    bio: "Howdy!",
    role: "Tech Developer",
    projects: ["Sound of AI", "Interactive Stories for Learning AI", "Contours 2 Classification", "Feature Detection"],
    skills: ["General AI"],
    main: "Sound of AI",
    yearsActive: 2020
});