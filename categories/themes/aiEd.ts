import { theme, project } from "../../builder";
import soundOfAI from "./projects/soundOfAI";

export default theme({
    name: "AI Education",
    details: {
        summary: "",
        links: [{ text: "RAISE", url: "https://raise.mit.edu/" }]
    },
    projects: {
        ...soundOfAI,
        ...project({
            name: "Computational Action",
            details: {
                "summary": "La la la"
            }
        } as const),
        "Data Activism": "",
        "Primary AI": "",
        "DAILy": {
            summary: "The Daily-AI workshop, designed by MIT educators and experienced facilitators, features hands-on and computer-based activities on AI concepts, ethical issues in AI, creative expression using AI, and how AI relates to your future. You will experience training and using machine learning to make predictions, investigate bias in machine learning applications, use generative adversarial networks to create novel works of art, and learn to recognize the AI you interact with daily and in the world around you.",
            links: [{ text: "homepage", url: "https://raise.mit.edu/daily/" }],
        },
        "AI Storybook": "",
        "Day of AI": "",
        RAICA: { // Randi, Xiaoxue, Sharifa, Daniella, Safinah; also fits under social robot ed
            summary: "The Responsible AI for Computational Action (RAICA) curriculum supports hands-on learning projects, tools, technologies, and teacher professional development for middle school AI education. ",
        },
        "Autonomous Car Curriculum": "", // Raul, Sharifa, Randi
        LevelUp: {
            summary: "LevelUp is an automatic code analysis tool built directly into a block-based programming language to give learners continuous feedback on their text classification projects. It supports educators and learners without prior experience in AI by encouraging best practices in text classifier development. ",
            links: [{ text: "Project Page", url: "https://www.media.mit.edu/projects/ai-progress-tab/overview/" }],
            years: [2021]
        }, // Tejal, Randi
        "AI Playground": { // Randi, Parker, Matt, Sharifa, Xiaoxue; also fits under creativity
            summary: "Our AI Playground is a suite of drag-and-drop coding blocks that allow students to integrate machine learning models, robotics, and other AI engines into their projects.",
            links: [{ text: "Live PAge", url: "playground.raise.mit.edu/raica" }],
            years: [2019]
        },
    }
});