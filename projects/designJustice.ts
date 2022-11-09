import { project } from "builder";

const summary = `The project aims to develop methods for design justice audits in classrooms, in academia broadly, and in the design process in educational institutions and corporations. 
Our work also extends to creating guidelines to inform how design justice can be leveraged in technology design processes and policy development. 
Overall, this project audits institutions to understand how they engage in design justice (critique) and suggests ways to achieve design justice in a variety of spaces (solutions). 
This combines for a focus on both critique and design solutions.`;

const description = `We take as a starting point for our work the recent scholarship by Sasha Costanza-Chock, Design Justice, in which she described design justice as a framework for analysis of how design distributes benefits and burdens between various groups of people. 
In addition, design justice calls for attention to how “design reproduces and/or challenges the matrix of domination.” 
The project aims to develop methods for design justice audits in classrooms, in academia broadly, and in the design process in educational institutions and corporations. 
Our work also extends to creating guidelines to inform how design justice can be leveraged in technology design processes and policy development. 
Overall, this project audits institutions to understand how they engage in design justice (critique) and suggests ways to achieve design justice in a variety of spaces (solutions). 
This combines for a focus on both critique and design solutions.

Our overarching theme is to understand how design and justice are taught, intertwined, and embodied and what techniques are successful and what aren’t for engaging with design justice in varying settings. 
We use MIT as an exemplar for extracting design pedagogy and justice best practices. We are specifically mindful of and intrigued by design pedagogy paradigms, encoded values, and student, instructor, and community partner experiences. 
This often includes identifying exemplars of how MIT currently incorporates design justice into design pedagogy, suggesting future techniques to increase design justice’s presence in the classroom, and designing new methods to support design justice in design pedagogy. 
Our approach can be expanded to other educational institutions and corporate settings.`;

export default project({
  name: "Design Justice",
  details: {
    summary, description,
    links: [{ text: "homepage", url: "https://www.media.mit.edu/projects/design-justice-auditing/overview/" }],
  },
  themes: "Ethics & Policy"
})