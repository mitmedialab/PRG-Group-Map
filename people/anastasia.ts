import { person } from "builder";

export default person({
    name: "Anastasia Ostrowski",
    email: "",
    bio: "Anastasia Ostrowski is a research assistant and design researcher in the Personal Robots Group. Anastasia received Master's and Bachelor degrees in 2017 and 2016 respectively from the University of Michigan in biomedical engineering. Her master's research focused on Design Heuristics in biomedical engineering education and how engineering students engage in idea generation and the design space. In the Personal Robots group, she contributes to exploring voice agents and their use within contexts such as home and co-designs social robots with older adults.  Other research interests include design education, front-end design tools, and human-centered design.",
    role: { name: "PhD Student", year: 4 },
    projects: [
        "Robots in the Home",
        "Wellness",
        "Medications Adherence",
        "Older Adult Co-Design",
        { name: "Robot Policy Design Toolkit", main: true },
        { name: "Design Justice", main: true }
    ],
    skills: [
        "Co-Design",
        "Human Study Design",
        "Methodology Design",
        "Qualitative Analysis",
        "Statistical Analysis",
        "Human-Computer Interaction",
        "Mixed Method",
        "Policy",
        "Project Management",
        "Design Education",
        "Human-Centered Design"
    ],
    years: 2018,
    links: [{ text: "Anastasia Ostrowski", url: "https://www.media.mit.edu/people/akostrow/overview/" }]
});