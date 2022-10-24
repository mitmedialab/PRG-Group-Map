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
            name: "Dancing with AI",
            details: {
                "summary": "",
                "links": [{ url: "https://dancingwithai.media.mit.edu/", text: "Project Site" }],
                years: [[2010, 2012], 2020],
            }
        } as const),
        "GANPaint for Kids": "",
        "AI & Growth Mindset": "",
    }
});