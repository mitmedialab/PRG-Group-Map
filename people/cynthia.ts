import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Cynthia Breazeal",
    //photo: pathToFileInAssetsFolder("parker.png"),
    role: "Director",
    bio: "Vision for PRG",
    email: "",
    projects: [],
    skills: [],
    links: [
        { 
            text: "Main Website", 
            url: "https://robots.media.mit.edu/" 
        },
        { 
            text: "Past Projects", 
            url: "https://robots.media.mit.edu/project-portfolio/applications/"
        },
    ],
});