import { person } from "../builder";

export default person({
    name: "Pedro Colon-Hernandez",
    email: "pe25171@media.mit.edu",
    bio: "",
    role: { name: "PhD Student", year: 5 },
    projects: [{ name: "Dynamic Procedural Interactions", main: true }, "Museum Interaction", "Robots in the Home"],
    skills: ["Dev", "General AI", "NLP"],
    years: 2018,
});