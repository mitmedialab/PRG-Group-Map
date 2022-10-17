import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
  name: "Ivan Sysoev",
  email: "isysoev@mit.edu",
  //photo: pathToFileInAssetsFolder("parker.png"),
  bio: "",
  role: "Postdoctoral Associate",
  projects: ["Speech Blocks", "AI & Growth Mindset","Interactive Stories for Learning AI"],
  skills: ["Human Study Design", "Statistical Analysis", "Child Study", "Art"],
  main: ["Speech Blocks"],
  yearsActive: [2018,2022],
});
