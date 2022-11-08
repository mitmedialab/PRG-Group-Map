import { project } from "../builder";

const summary = `The Robot Policy Design Toolkit is designed to allow any generation to design and consider how we can develop policy for social robot technologies around nine ethic topics. 
The toolkit is situated around the context of you in your home considering how policy around robots may affect your environment and interactions with technology and other people. 
In the toolkit, people select and \"pass\" laws for social robots and structure various policies with these laws around topics such as autonomy, data bias, data privacy, and social persuasion.`;

const description = `Increasingly, devices designed with artificial intelligence (AI), such as robots or smart speakers, are entering people's homes, workspaces, and environments. 
Many home robots are made to interact with users in an interpersonal way and can be designed to be socially persuasive. 
This translates to an increased need for policy around these devices surrounding dimensions including autonomy, bias, social persuasion, privacy, emotional deception, and transparency. 
Previous works have revealed, when people explore designing these devices, they express concerns around privacy, autonomy and transparency and design to adjust for these concerns. 
Other work has shown that with the proper scaffolding, students are able to identify the socio-political aspects of technology. 
Our project builds upon these works to extend beyond participatory design of these devices and learn more about how people would design policy around these technology dimensions. 
Ultimately, through expanding the research to policy design, we can engage in participatory democracy in policy around these devices.

The Robot Policy Design Toolkit is designed to allow any generation to design and consider how we can develop policy for social robot technologies around nine ethic topics. 
The toolkit is situated around the context of you in your home considering how policy around robots may affect your environment and interactions with technology and other people. 
In the toolkit, people select and "pass" laws for social robots and structure various policies with these laws around topics such as autonomy, data bias, data privacy, and social persuasion.

As agents are beginning to enter people's homes, smart speakers and robots are generating legal and policy issues that require developers to reconsider the design of these technologies and how we should design future policies around these devices. 
Social robots are a much more powerful piece of technology than we've seen before because of their ability to engage people in a natural way of interaction. 
We need to investigate what this means and need to be proactive when we design policies around these technologies. 
It is important to incorporate the voices of those who will be impacted. The investigations surrounding these topics and design of these devices must include people of all ages, allowing researchers to compare between generations. 
An intergenerational approach also includes children and older adults who are typically left out of the design conversation of these devices.`;

export default project({
  name: "Robot Policy Design Toolkit",
  details: {
    summary, description,
    links: [{ text: "homepage", url: "https://www.media.mit.edu/projects/robot-policy-design/overview/" }],
  },
  themes: "Ethics & Policy"
})
