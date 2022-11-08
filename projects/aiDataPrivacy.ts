import { project } from "../builder";

const summary = `Policymakers, practitioners, and researchers are grappling with some herculean questions regarding kids' safety online. 
This project seeks to inform youth about data and privacy topics through a series of hands-on activities. 
The goal is to encourage students to form their own opinions and think more critically about the platforms they use every day, instead of solely listing the dangers and the "what not to do's."`

export default project({
  name: "AI & Data Privacy",
  details: {
    summary,
    links: [{ text: "materials", url: "https://docs.google.com/document/d/17x1vwEAS-NT5OoFjaxwPliUrmhrt2LChN0xtWntRr68/edit" }],
  },
  themes: "Ethics & Policy"
});