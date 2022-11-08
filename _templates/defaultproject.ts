import { project } from "builder";

const projectStart = 2019;

/** 
 * @description
 * This is a template for a project's declaration. It contains documentation for getting started.
 * 
 * The following parameters are required:
 * @param {string} name - Name of person
 * @param {string | object} details - Details about this project. 
 * This can either be specified as a string (assumed to be a summary), 
 * or as an object with specific key-value pairs (hover over the label to see all options)
 * @param {string[]} themes - What theme(s) does this project fit under? 
 * You can specify only one (written as a string, e.g. "Some theme"), 
 * or more than one (written as an array, e.g. ["Somet theme", "Some other theme"]).
 * Hover over label for more advanced usages
 */
export default project({
  name: "Sample Project",
  details: {
    summary: "This is a sample summary",
    description: "This is a longer description",
    links: [
      { text: "Home Page", url: "" }
    ],
    years: [projectStart]
  },
  themes: ["AI Education", "Air-Force AI Journey"]
});