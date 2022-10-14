import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
  name: "Ivan Sysoev",
  email: "isysoev@mit.edu",
  //photo: pathToFileInAssetsFolder("parker.png"),
  bio: "",
  role: "Research Scientist",
  projects: ["Speech Blocks", "AI & Growth Mindset"],
  skills: ["Human Study Design", "Statistical Analysis", "Child Study", "Art"],
  main: ["Speech Blocks"],
});
