import { person } from "../builder";

export default person({
    name: "Safinah Arshad Ali",
    email: "",
    bio: "Safinah is a PhD student in the Personal Robots group. Her research focuses on making AI accessible to diverse communities and using Social Robots to foster positive learning behaviors in children. She studies the role of child-robot interaction in simulating curiosity, creativity and growth mindset in young children. She has developed Creative AI learning tools. She has also worked on robots for accessibility, particularly to assist children with Autism Spectrum Disorder. She likes to explore creative computational techniques and how they can be applied to social problems, especially in the developing world. She did her Bachelors in Design from IIT Guwahati and her Masters in HCI from Carnegie Mellon University.",
    role: { name: "PhD Student", year: 3 },
    projects: [
        "Doodle Bot",
        "DAILy",
        "Dancing with AI",
        "RAICA",
        "GANPaint for Kids",
        "AI & Growth Mindset",
        { name: "Social Emotional Learning", main: true },
        "Contours 2 Classification"
    ],
    skills: ["General AI", "Dev", "Art", "Inclusive Education"],
    years: 2017,
});