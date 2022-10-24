import { project, theme } from "../../builder";

export default theme({
    name: "Creativity",
    details: {
        summary: "short description",
        description: "longer description",
    },
    projects: {
        "Creativity and GANs for Middle School": "",
        ...project({
            name: "Dancing with AI", // also fits under AI ed
            details: {
                "summary": "",
                "links": [{ url: "https://dancingwithai.media.mit.edu/", text: "Project Site" }],
                years: [[2020, 2022]],
            }
        } as const),
        "GANPaint for Kids": "",
        "AI & Growth Mindset": "",
    }
});