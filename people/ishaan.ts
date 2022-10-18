import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
  name: "Ishaan Grover",
  email: "",
  //photo: pathToFileInAssetsFolder("parker.png"),
  bio: "I am a master's student at the MIT Media Lab in the Personal Robots group. I graduated from Georgia Tech with a bachelor's degree in computer science, specializing in artificial intelligence and networking. I enjoy playing with data and developing technologies that leverage data. My current research at MIT focuses on building a cognitive architecture for tobots like Tega, incorporating inputs from speech and vision. Prior to this, I worked on wearable computing and algorithms to help artificially intelligent agents learn from human feedback. Last summer, I interned on the philanthropy team at Palantir, developing technologies to help farmers in the Philippines and Colombia. Before that, I interned at Microsoft on the Identity Driven Machine Learning team, building models to detect suspicious login activities.\n\nOutside of research, I like to explore new places, food, and adventure sports.",
  role: {role: "PhD Student", year: 4},
  projects: ["Museum Interaction", "Early Literacy"],
  skills: ["General AI", "Reinforcement Learning","Verbal & Nonverbal Behavior"],
  yearsActive: 2017,
});
