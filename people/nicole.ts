import { person } from "builder";

export default person({
    name: "Nicole Pang",
    email: "",
    bio: "",
    role: "MEng. Student",
    projects: [
        "Ethics of Deepfakes",
        "Debating technology and AI with your child",
        "AI & Data Privacy",
        "AI & Ethics in Middle School",
        { name: "Computational Action", main: true },
    ],
    skills: ["Ethics", "General AI"],
    years: [2021, 2022],
});