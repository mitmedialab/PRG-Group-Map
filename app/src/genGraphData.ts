import cytoscape from "cytoscape";
import type { NormalizedData } from "builder/types";
import { type RoleName } from "roles";
import { getColorCss, getNextColorIndex } from "./color";
import { Class, css, edge, edgeStyle, node, nodeStyle, readableEntries, readableObject, style } from "./utils";

export const makeNodesAndEdges = (data: NormalizedData): [cytoscape.ElementDefinition[], cytoscape.Stylesheet[]] => {
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

    const graphElements: cytoscape.ElementDefinition[] = [
        node({
            id: graphName,
            level: numThemes + numProjects + numResearchers,
            class: Class.Title,
        }),
        node({
            id: director.name,
            level: numThemes + numProjects + numResearchers,
            class: Class.Director,
            ...readableObject(director),
        }),
        edge({
            source: director.name,
            target: graphName,
        }),
    ];

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
        nodeStyle({ class: Class.Title }, css({
            "background-color": "#FFFFFF",
            "font-size": "48px",
        })),
        nodeStyle({ class: Class.Theme }, css({ shape: "roundrectangle" })),
        nodeStyle({ class: Class.Project }, css({ shape: "hexagon", })),
        nodeStyle({ class: Class.Staff }, css({
            "background-color": "#ffffff",
            "border-width": "2px",
        })),
        nodeStyle({ class: Class.Department }, css({
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
            class: Class.Theme,
            ...theme,
        }));

        graphStyles.push(nodeStyle(
            { id: themeName },
            css({
                "background-color": themeColor.hex,
            })
        ));

        graphElements.push(edge({ source: graphName, target: themeName }));

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
                class: Class.Project,
                ...readableObject(project),
            })
        );

        const target = projectName;
        project.themes.forEach(({ name: source }) => graphElements.push(edge({ source, target })));
    }

    for (const researcher of researchers) {

        const { name: personName, projects, ...details } = researcher;

        graphElements.push(node({
            id: personName,
            level: 1,
            class: Class.Person,
            ...readableObject(details),
        }));

        graphElements.push(
            ...projects.map(({ name, main, weight }) => edge({ source: name, target: personName, main: main, weight: weight }))
        );
    }

    for (const department of staffRoles) {
        graphElements.push(node({
            id: department,
            class: Class.Department,
            ...roles[department]
        }));
    }

    for (const staffMember of staff) {
        const { name: staffMemberName, projects, ...staffAttr } = staffMember;

        graphElements.push(node({
            id: staffMemberName,
            class: Class.Staff,
            parent: staffMember.role.name,
            ...readableObject(staffAttr),
        }));

        graphElements.push(
            ...projects.map(({ name }) => edge({ source: name, target: staffMemberName }))
        );
    }

    return [graphElements, graphStyles];
}