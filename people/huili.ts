import { person } from "builder";

export default person({
  name: "Huili Chen",
  email: "",
  bio: "Huili Chen is a Ph.D student in the Personal Robots Group at the MIT Media Lab. She received a Bachelor’s Degree in Computer Science and Psychology with a minor in Peace Studies from University of Notre Dame in 2016. Her current research at MIT focuses on emotion-based interactions between humans and robots. In the past, she worked in Dr. Milenkovic’s Complex Network Lab and Dr. D’Mello’s Affective Computing Lab at the University of Notre Dame.",
  role: { name: "PhD Student", year: 5 },
  projects: [{ name: "Robots in the Home", main: true }, "Early Literacy"],
  skills: [
    "Human Study Design",
    "Mixed Method",
    "Qualitative Analysis",
    "Reinforcement Learning",
    "Statistical Analysis",
    "Verbal & Nonverbal Behavior",
    "Child Study",
  ],
  years: 2016,
});
