import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    name: "Daniella DiPaola",
    email: "",
    //photo: pathToFileInAssetsFolder("parker.png"),
    bio: "Daniella DiPaola is a Ph.D. student in the Personal Robots Group at the MIT Media Lab. Her research interests include understanding the ethical, social, and emotional implications of AI and robots, particularly in the lives of children.  She has developed various curricula to inspire middle school students to think about the societal implications of artificial intelligence. Her current work explores the relationship between AI literacy and child-robot interaction.\n\nDaniella received her B.S. in Engineering Psychology from Tufts University in 2016. Before beginning graduate school, she worked as a researcher in the consumer robotics industry.",
    role: "PhD Student",
    projects: [
        "Ethics of Deepfakes",
        "Debating technology and AI with your child",
        "AI & Data Privacy",
        "AI & Ethics in Middle School",
        "Data, Representation, & AI",
        "General AI",
        "DAILy",
        "Jibo",
    ],
    skills: [
        "Co-Design", 
        "Ethics", 
        "Methodology Design", 
        "Policy", 
        "Statistical Analysis", 
        "Child Study"
    ],
});