import { project } from "builder";

const summary = `This project seeks to develop an open source curriculum for middle school students on the topic of artificial intelligence. 
Through a series of lessons and activities, students learn technical concepts—such as how to train a simple classifier—and the ethical implications those technical concepts entail, such as algorithmic bias.`

export default project({
  name: "AI & Ethics in Middle School",
  details: {
    summary,
    links: [{ text: "materials", url: "https://docs.google.com/document/d/1e9wx9oBg7CR0s5O7YnYHVmX7H7pnITfoDxNdrSGkp60/edit#heading=h.ictx1ljsx0z4" }],
  },
  themes: "Ethics & Policy"
});