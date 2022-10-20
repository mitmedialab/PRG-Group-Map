import { describeYourself, student } from "../builder";

const startDate = new Date("September, 2018");
const graduationDate = new Date("September, 2022");

const { role, years } = student("PhD Student", startDate, graduationDate);

describeYourself({
    name: "Sam Spaulding",
    email: "samuelsp@media.mit.edu",
    bio: "",
    role,
    projects: [{ name: "Adult Language Teaching", main: true }, "Early Literacy"],
    skills: ["Human Study Design", "Jibo Skill", "Reinforcement Learning", "Statistical Analysis"],
    years,
});