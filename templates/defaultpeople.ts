import { describeYourself, pathToFileInAssetsFolder } from "../builder";

/** 
 * @description
 * This is a template for a person's profile. It contains documentation for getting started.
 * 
 * The following parameters are required:
 * @param {string} name - Name of person
 * @param {string} email - Email of person
 * @param {string} bio - Short bio of person
 * @param {string} role - Role of person
 * @param {string[]} projects - Projects person is involved in
 * @param {string[]} skills - Skills person has
 * 
 * The following parameters are optional:
 * @param {object[]} links - Links to display (optional)
 * * @param {string} links[].text - Text to display
 * * @param {string} links[].url - URL to link to
 * @param {string[]} main - Main project person is involved in (optional)
 */

describeYourself({
    // Required fields (don't leave these blank)
    name: "",
    email: "",
    bio: "",
    role: { role: "PhD Student", year: 1 },
    projects: [],
    skills: [],

    // Optional fields (remove if not needed)
    links: [
        {
            text: "",
            url: ""
        },
    ],
});