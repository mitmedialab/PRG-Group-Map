import { NormalizedData, NormalizedDetails, NormalizedMember, Theme } from "../builder";
import { ProjectName } from "../categories/projectsByTheme";
import json from "./data.json";
import cy from "cytoscape";

const cytoscape = cy({
    container: document.getElementById("cy"),
});

const { skills, roles, themes, members } = json as any as NormalizedData;
const skillNames = Object.keys(skills);
const roleNames = Object.keys(roles);
const memberNames = members.map(m => m.name);

// Each person's name (key) and their member details (value)
const memberDetailsByName = memberNames.reduce((acc, name, index) => {
    acc[name] = members[index];
    return acc;
}, {} as Record<string, NormalizedMember>);

// Each project (key) and that has a designated "main" person(s) (value -- array of names)
const mainPeoplePerProject = members.reduce((acc, member) => {
    const { name, main } = member;
    if (!main) return acc;
    main.forEach((mainProjectName) => {
        (mainProjectName in acc) ? acc[mainProjectName].push(name) : acc[mainProjectName] = [name];
    });
    return acc;
}, {} as { [k in ProjectName]: string[] });

type Themes = keyof typeof themes;

// Eache theme (key) and the projects tied to it (value -- project names are placed in an array)
type ProjectsByTheme = { [k in Themes]: ProjectName[] };

// Each theme (key) and it's corresponding details/description  (value)
type ThemeDescriptions = { [k in Themes]: NormalizedDetails };

// Each project (key) and it's corresponding details/description (value)
type ProjectDescriptions = { [k in keyof ProjectName]: NormalizedDetails & { theme: Themes } };

const [projectNamesByTheme, themeDescriptions, projectDescriptions] = Object.entries(themes).reduce((acc, [theme, content]) => {
    const projects = { ...content };
    const { details } = projects;
    // @ts-ignore
    delete projects["details"];

    acc[0][theme] = Object.keys(projects);
    acc[1][theme] = details;
    for (const project in projects) {
        acc[2][project] = { ...projects[project], theme };
    }
    return acc;
}, [{}, {}, {}] as [ProjectsByTheme, ThemeDescriptions, ProjectDescriptions]);


/** Testing (Begin) */

console.log("All skills: ", skillNames)
console.log("All roles: ", roleNames)
console.log("All members: ", memberNames);

console.log("Details by member:");
console.dir(memberDetailsByName);

console.log("Main people by project:");
console.dir(mainPeoplePerProject);

console.log("Projects By theme:");
console.dir(projectNamesByTheme);

console.log("Description By theme:");
console.dir(themeDescriptions);

console.log("Description By project:");
console.dir(projectDescriptions);

/** Testing (End) */

const colors = [
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "#ffa600",
    "#00876c",
    "#3d9b70",
    "#63ae74",
    "#89c079",
    "#afd27f",
    "#d6e487",
    "#fff492",
    "#fed777",
    "#fbba63",
    "#f69c56",
    "#ee7e50",
    "#e35e4e",
    "#d43d51"
].reverse();