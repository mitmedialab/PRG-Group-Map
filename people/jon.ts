import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Jon Ferguson",
    email: "jon@media.mit.edu", 
    //photo: pathToFileInAssetsFolder("parker.png"),
    bio: "Jibo's God.",
    role: "Tech Developer",
    projects: ["Jibo","Robots in the Home","Early Literacy","Wellness"],
    skills: ["Dev","Jibo Skill"],
});