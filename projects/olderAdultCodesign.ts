import { project } from "builder";

const summary = `Over a year-long co-design project, we partnered with 28 older adults to understand how social robots should be designed, specifically exploring the areas of medical adherence, emotional wellness, social connection, financial management, memory, body signal monitoring, and exercise.`;

const description = `Social robots equipped with AI and designed with users' social, emotional, and relational 
interactions in mind are increasingly being highlighted as a way to enable older adults to age in their homes. 
However, older adults are often excluded in technology development and, in general, in their discussions of needs and desires. 
To ensure successful and sustained adoption of technology, participatory and co-design processes are essential in social robot development  to make sure older adults feel competent and empowered.

This research process focuses on empowering older adults as partners in co-design research processes designing social robots. Over a year-long co-design project, we partnered with 28 older adults to understand how social robots should be designed, specifically exploring the areas of medical adherence, emotional wellness, social connection, financial management, memory, body signal monitoring, and exercise.

The study was divided in 7 parts: initial interviews, art-based design sessions, robot hosting, debrief of robot hosting experience, rapid robot prototyping, design guideline sessions, & reflection interview with card-sorting.

Initial results reveal how older adults want social robots to be design and illuminate older adults' concerns for having AI systems in their homes. This methodology applied to social robot design demonstrates how users can and should be involved in designing AI that will socially impact the world. The methodology can be expanded and applied to other demographics affected by AI and focus areas of AI, such as public health and education.`;

export default project({
  name: "Older Adult Co-Design",
  details: {
    summary, description,
    links: [{ text: "homepage", url: "https://www.media.mit.edu/projects/co-design-of-social-robots-with-older-adults/overview/" }],
  },
  themes: "Health & Wellness"
});