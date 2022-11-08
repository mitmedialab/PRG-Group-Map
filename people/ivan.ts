import { person } from "builder";

export default person({
  name: "Ivan Sysoev",
  email: "isysoev@mit.edu",
  bio: "",
  role: "Postdoctoral Associate",
  projects: [{ name: "Speech Blocks", main: true }, "AI & Growth Mindset", "AI Storybook"],
  skills: ["Human Study Design", "Statistical Analysis", "Child Study", "Art"],
  years: [2018, 2022],
});
