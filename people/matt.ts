import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Matt Taylor",
    email: "MEWTaylor@gmail.com",
    //photo: pathToFileInAssetsFolder("parker.png"),
    bio: "",
    role: "Research Scientist",
    projects: [
        "Doodle Bot",
        "Feature Detection",
        "Contours 2 Classification",
        "Autonomous Agents",
        "Sound of AI",
        "Computational Action",
        "Data Activism",
        "Primary AI",
    ],
    skills: ["General AI"],
    yearsActive: 2020
});
