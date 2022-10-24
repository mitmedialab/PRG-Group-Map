import { theme } from "../../builder";

export default theme({
    name: "Social Robot Education",
    details: "",
    projects: {
        Jibo: {
            summary: "This project introduces two curricula that take different approaches to educate youth (grades 4 and 5) about social robots. The Knowledge and Societal Impact curriculum teaches students about the technical and ethical topics surrounding social robots. The Programming curriculum allows students to program their own conversational skills on Jibo. These curricula represent two pedagogical approaches in the field of AI education, one focused on embedding ethics, and the other focused on students as self-driven makers.",
            links: [{ text: "homepage", url: "https://www.media.mit.edu/projects/education-and-robot-relationships/overview/" }],
        },
        "Doodle Bot": { // Randi, Safinah, Raul, Sharifa; maybe rename DoodleBot 2.0; also fits under creativity
            summary: "Doodle Bot is a robot-based Creative AI learning platform for K-12 students.",
            years: [2019],
        },
        PopBots: { // Randi, Hae Won; also fits under creativity
            summary: "The Preschool-Oriented Programming (POP) Platform introduces young children to programming, robotics, and AI by allowing them to build and program their own robots. ",
            links: [{ text: "Project Page", url: "https://www.media.mit.edu/projects/pop-kit/overview/" }],
            years: [[2016, 2019]],
        },
        "Primary AI": { // Randi, Safinah; also fits under creativity
            summary: "The PrimaryAI curriculum teaches elementary school children about robotics and AI through hands-on projects.",
            links: [{ text: "Project Page", url: "https://www.media.mit.edu/projects/primary-ai-ed/overview/" }],
            years: [[2019, 2020]],
        },
        "Arduino and Micro:bit Robots": {
            summary: "Gizmo, Cutebot, and Tinybit are low-cost, microcontroller-based robots used in AI curricula. With these tools we are creating accessible, tangible AI education that scales.",
            years: [2019]
        },
        "How to Train Your Robot": { // also fits under AI ed
            summary: "How to Train Your Robot is a 30-hour curriculum where middle school students can explore machine learning and ethics through hands-on activities.",
            links: [{ text: "Project Page", url: "https://httyr.media.mit.edu/" }],
            years: [[2019, 2022]],
        },
    }
});