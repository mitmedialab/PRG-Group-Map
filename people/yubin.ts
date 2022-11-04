import { person } from "../builder";

export default person({
    name: "Yubin Kim",
    email: "ybkim95@media.mit.edu",
    bio: "",
    role: "Visiting Student",
    projects: [{ name: "Robots in the Home", main: true }, "Autonomous Agents"],
    skills: ["Dev", "General AI", "Verbal & Nonverbal Behavior", "Vision & Sensors"],
    years: 2022
});