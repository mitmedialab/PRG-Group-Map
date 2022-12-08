import { readable, writable, type Writable } from "svelte/store";

import type cytoscape from "cytoscape";

import type { NormalizedData } from "$builder/types";
import type { RoleName } from "$roles";
import { getColorCss, getNextColorIndex } from "$lib/code/color";
import { css, edge, edgeStyle, node, nodeStyle, readableEntries, readableObject, style } from "$lib/code/utils";
import json from "$lib/data/graph.json";

export const structure: Writable<cytoscape.Core> = writable();

export const data = readable(json as any as NormalizedData);

const rootElements: cytoscape.ElementDefinition[] = [];

export const getRootElements = () => rootElements;

const adjustWeight = (weight: number) => weight / 5;

const makeNodesAndEdges = (data: NormalizedData): { elements: cytoscape.ElementDefinition[], style: cytoscape.Stylesheet[] } => {
  const { skills, roles, themes, people, projects } = data;

  const director = people.find((m) => m.role.name === "Director");
  if (director === undefined) throw new Error("Could not find the director!");

  const staffRoles: RoleName[] = ["Lab Management", "Tech Developer", "Admin & Finance"];
  const researchers = people.filter((m) => !staffRoles.includes(m.role.name));
  const staff = people.filter((m) => staffRoles.includes(m.role.name)).sort((a, b) => {
    if (a.role.name < b.role.name) return -1;
    if (a.role.name > b.role.name) return 1;
    return 0;
  });

  const projectNames = Object.keys(projects);

  const numProjects = projectNames.length;
  const numThemes = Object.keys(themes).length;
  const numResearchers = Object.keys(researchers).length;

  const graphName = "Personal Robots Group";

  rootElements.push(
    node({
      id: graphName,
      level: numThemes + numProjects + numResearchers,
      class: "title",
    }),
    node({
      id: director.name,
      level: numThemes + numProjects + numResearchers,
      class: "director",
      ...readableObject(director),
    }),
    edge({
      source: director.name,
      target: graphName,
    })
  )

  const graphElements: cytoscape.ElementDefinition[] = [...rootElements];

  const graphStyles: cytoscape.Stylesheet[] = [
    nodeStyle("all", style({
      label: "data(id)",
      "background-color": "#27ccc0",
      width: "120px",
      height: "120px",
      "text-wrap": "wrap",
      "text-halign": "center",
      "text-valign": "center",
      "text-max-width": "80px",
    })),
    nodeStyle({ class: "title" }, css({
      "background-color": "#FFFFFF",
      "font-size": "48px",
    })),
    nodeStyle({ class: "theme" }, css({ shape: "roundrectangle" })),
    nodeStyle({ class: "project" }, css({ shape: "hexagon", })),
    nodeStyle({ class: "staff" }, css({
      "background-color": "#ffffff",
      "border-width": "2px",
    })),
    nodeStyle({ class: "department" }, css({
      "background-color": "#ffffff",
      "border-width": "2px",
      shape: "roundrectangle",
      "text-valign": "top",
    })),
    edgeStyle("all", css({
      opacity: 0.3,
      width: "data(weight)"
    })),
    edgeStyle({ source: graphName }, css({
      "line-fill": "linear-gradient",
      "line-gradient-stop-colors": ["black", "white"],
      "line-gradient-stop-positions": [100, 10],
    })),
    nodeStyle(
      "all",
      style({
        "border-color": "#000",
        "border-width": "2px",
      }),
      "highlight"),
    nodeStyle("all", style({ opacity: 0.3 }), "semitransp"),
    edgeStyle("all", style({ opacity: 1 }), "highlight"),
  ];

  let colorIndex = 0;
  for (const [themeName, theme] of readableEntries(themes)) {
    if (!theme) continue;

    const themeColor = getColorCss(colorIndex);
    colorIndex = getNextColorIndex(colorIndex);

    graphElements.push(node({
      id: themeName,
      level: numProjects + numResearchers,
      class: "theme",
      ...theme,
    }));

    graphStyles.push(nodeStyle(
      { id: themeName },
      css({
        "background-color": themeColor.hex,
      })
    ));

    graphElements.push(edge({ source: graphName, target: themeName, weight: 1 }));

    graphStyles.push(
      nodeStyle({ theme: themeName }, css({ "background-color": themeColor.rgb })),
      edgeStyle({ source: themeName }, css({ "line-color": themeColor.hex, }))
    );

  }

  for (const [projectName, project] of Object.entries(projects)) {
    const mainTheme = project.themes.find(theme => theme.main) ?? project.themes[0];

    graphElements.push(
      node({
        id: projectName,
        level: numResearchers,
        theme: mainTheme.name, // Can we support more than one main theme?
        class: "project",
        ...readableObject(project),
      })
    );

    const target = projectName;
    project.themes.forEach(({ name: source, weight }) =>
      graphElements.push(edge({ source, target, weight: adjustWeight(weight) })));
  }

  for (const researcher of researchers) {

    const { name: personName, projects, ...details } = researcher;

    graphElements.push(node({
      id: personName,
      level: 1,
      class: "person",
      ...readableObject(details),
    }));

    graphElements.push(
      ...projects.map(({ name, main, weight }) =>
        edge({ source: name, target: personName, main, weight: adjustWeight(weight) }))
    );
  }

  for (const department of staffRoles) {
    graphElements.push(node({
      id: department,
      class: "department",
      ...roles[department]
    }));
  }

  for (const staffMember of staff) {
    const { name: staffMemberName, projects, ...staffAttr } = staffMember;

    graphElements.push(node({
      id: staffMemberName,
      class: "staff",
      parent: staffMember.role.name,
      ...readableObject(staffAttr),
    }));

    graphElements.push(
      ...projects.map(({ name: source, main, weight }) =>
        edge({ source, target: staffMemberName, main, weight: adjustWeight(weight) }))
    );
  }

  return { elements: graphElements, style: graphStyles };
}

export const graph = readable(makeNodesAndEdges(json as any as NormalizedData));