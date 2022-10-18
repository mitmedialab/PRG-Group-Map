import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
  name: "Ivan Sysoev",
  email: "isysoev@mit.edu",
  bio: "",
  role: "Postdoctoral Associate",
  projects: [{ project: "Speech Blocks", main: true }, "AI & Growth Mindset", "Interactive Stories for Learning AI"],
  skills: ["Human Study Design", "Statistical Analysis", "Child Study", "Art"],
  yearsActive: [2018, 2022],
});
