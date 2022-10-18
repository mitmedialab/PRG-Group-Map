import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Pedro Colon-Hernandez",
    email: "pe25171@media.mit.edu",
    bio: "",
    role: { role: "PhD Student", year: 5 },
    projects: [{ project: "Dynamic Procedural Interactions", main: true }, "Museum Interaction", "Robots in the Home"],
    skills: ["Dev", "General AI", "NLP"],
    yearsActive: 2018,
});