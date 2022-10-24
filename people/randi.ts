import { describeYourself } from "../builder";

describeYourself({
  name: "Randi Williams",
  email: "randiw12@mit.edu",
  bio: `Randi Williams is a PhD student in the group who works at the intersection
  of human-robot interaction and preK-12 education, with a particular focus on engaging
  students from diverse backgrounds. She has developed a number of AI education curricula,
  platforms, and robots.`,
  role: { name: "PhD Student", year: 5 },
  projects: [
    "Dancing with AI",
    { name: "RAICA", main: true },
    "Autonomous Car Curriculum",
    { name: "LevelUp", main: true },
    { name: "AI Playground", main: true },
    { name: "AI + Ethics Education", main: true },
    { name: "Doodle Bot", main: true },
    "PopBots",
    "Arduino and Micro:bit Robots",
    "How to Train Your Robot",
    "Primary AI",
    "Feature Detection",
  ],
  skills: [
    "Child-Robot Interaction",
    "General AI",
    "Dev",
    "Ethics",
    "Teacher Training",
    "Assessment",
    "Human Study Design",
    "Human-Computer Interaction",
    "STEM Education",
    "Curriculum Design",
    "Inclusive Education",
    "Robot Engineering",
    "Scratch Master",
  ],
});
