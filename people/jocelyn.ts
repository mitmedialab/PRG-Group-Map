import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Jocelyn Shen",
    email: "",
    //photo: pathToFileInAssetsFolder("parker.png"),
    bio: "",
    role: { role: "Masters Student", year: 2},
    projects: ["Personal storytelling"],
    skills: ["Dev","NLP","Human-Computer Interaction"],
    main: "Personal storytelling",
    yearsActive: 2021,
    links: [{ text: "Jocelyn Shen", url: "https://jocelynshen.com/" }]
});