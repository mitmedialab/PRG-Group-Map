import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Sooyeon Jeong",
    email: "",
    bio: "Sooyeon Jeong is a graduate student in Personal Robots Group. She received her B.S. and M.Eng in Electrical Engineering and Computer Science and M.S. in Media Arts and Science at MIT. She joined Personal Robots Group as an undergraduate student in 2011 and since then have worked on multiple projects, such as Le FonduePhone, DragonBot, Huggable,  Pediatric Companion and Interactive Journaling projects. She is interested in how robots and technologies can mediate and facilitate human-human communications and interactions, and provide social and emotional support people with emotional and mental needs.",
    role: "",
    //photo: pathToFileInAssetsFolder("parker.png"),
    projects: ["Wellness", "Medications Adherence"],
    skills: ["Statistical Analysis", "Jibo Skill", "Human Study Design"],
    main: ["Wellness"],
    links: [
        {
            text: "Personal Website",
            url: "http://sooyeonjeong.com/"
        }
    ]
});