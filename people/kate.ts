import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Kate Darling",
    email: "",
    //photo: pathToFileInAssetsFolder("parker.png"),
    bio: "Dr. Kate Darling is a leading expert in technology ethics and policy. Her passion is investigating social robotics, exploring the emotional connection between people and lifelike machines, and seeking to influence technology design and policy direction. Her writing and research anticipate difficult questions that lawmakers, engineers, and the wider public will need to address as human-robot relationships evolve in the coming decades.",
    role: "Research Scientist",
    projects: [
        "Ethics of Deepfakes",
        "Debating technology and AI with your child",
        "AI & Data Privacy",
        "AI & Ethics in Middle School",
        "Autonomous Agents",
        "Human-AI Collaboration: Human Behavior",
    ],
    skills: ["Ethics", "Policy"],
    yearsActive: 2018,
    links: [{ text: "Kate Darling", url: "http://www.katedarling.org/" }]
});