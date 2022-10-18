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
        "DAILy": "",
        "AI Storybook":"",
        "Day of AI":"",
    }
});