import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Eden Adler",
    email: "eadler@mit.edu",
    //photo: pathToFileInAssetsFolder("parker.png"),
    bio: " passionate about using human-centered design to tackle systemic inequities. I want to make our systems more inclusive, accessible, and equitable to everyone - not just the mainstream.",
    role: { role: "Masters Student", year: 2},
    projects: ["Interactive Stories for Learning AI"],
    skills: ["General AI"],
    main: "Interactive Stories for Learning AI",
    yearsActive: 2021,
    links: [{ text: "Eden Adler", url: "https://edenadler.com/" }]
});