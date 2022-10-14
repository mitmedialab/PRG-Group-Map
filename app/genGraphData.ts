import type { GroupMember, Link } from "../builder/types";

// const themeColors = [
//     "D55069",
//     "D95030",
//     "E55137",
//     "EFA94A",
//     "7BDCB5",
//     "6DABAB",
//     "52A1E3",
//     "3B83BD",
//     "D28EBD",
//   ];
  
const themeColors = [
    "003f5c",
    "2f4b7c",
    "665191",
    "a05195",
    "d45087",
    "f95d6a",
    "ff7c43",
    "ffa600",
    "00876c",
    "3d9b70",
    "63ae74",
    "89c079",
    "afd27f",
    "d6e487",
    "fff492",
    "fed777",
    "fbba63",
    "f69c56",
    "ee7e50",
    "e35e4e",
    "d43d51"
].reverse();
  
  function makeValuesReadable(obj: { [x: string]: any; }): void {
    if (obj.links !== undefined && obj.links.length > 0) {
        obj.links = obj.links.reduce((acc: any, link: Link) => {
            return acc + `<a href="${link.url}">${link.text}</a>, `;
        }, "");
        // obj = {links, ...obj};
    };
    Object.keys(obj).forEach((key) => {
      obj[key] = Array.isArray(obj[key]) ? obj[key].join(", ") : obj[key];
    });
  }

export const  makeNodesEdges = (skills, roles, themes, members): object[] => {
    const allProjects = Object.entries(themes).reduce((acc, [theme, content]) => {
        const projects = { ...content };
        return { ...acc, ...projects };
    }, {});
    members = members.map((m: GroupMember) => {
        m.email = `<a href="mailto:${m.email}">${m.email}</a>`;
        var links = "";
        if (m.links !== undefined) {
            links = m.links.reduce((acc: string, link: Link) => {
                return `${acc}<a href="${link.url}">${link.text}</a>, `;
            }, "");
        };
        return {links, ...m}
    });
    const { name: directorName, role, links, projects: directorProjects, skills: directorSkills, ...directorAttr } = members
        .find((m: GroupMember) => m.role.role === "Director" );
    const researchers = members
        .filter((m: GroupMember) => 
        !["Director", "Lab Management", "Tech Developer", "Admin & Finance"].includes(m.role.role));
    const staff = members
        .filter((m: GroupMember) =>
        ["Lab Management", "Tech Developer", "Admin & Finance"].includes(m.role.role))

    const numThemes = Object.keys(themes).length;
    const numProjects = Object.keys(allProjects).length;
    const numResearchers = Object.keys(researchers).length;
    let colorIndex = 0;
    let prgProjectsElements = [
        {
        data: {
            id: "Personal Robots Group",
            level: numThemes + numProjects + numResearchers,
            class: "title",
        },
        group: "nodes",
        },
        {
        data: {
            id: directorName,
            level: numThemes + numProjects + numResearchers,
            class: "director",
            ...directorAttr,
        },
        group: "nodes",
        },
        {
        data: {
            source: directorName,
            target: "Personal Robots Group",
        },
        group: "edges",
        },
    ];
    let styling = [
        {
        selector: "node",
        style: {
            label: "data(id)",
            "background-color": "#27ccc0",
            width: "120px",
            height: "120px",
            "text-wrap": "wrap",
            "text-halign": "center",
            "text-valign": "center",
            "text-max-width": "80px",
        },
        },
        {
        selector: 'node[class="title"]',
        css: {
            "background-color": "#FFFFFF",
            "font-size": "48px",
        },
        },
        {
        selector: 'node[class="theme"]',
        css: {
            shape: "roundrectangle",
        },
        },
        {
        selector: 'node[class="project"]',
        css: {
            shape: "hexagon",
        },
        },
        {
        selector: 'node[class="staff"]',
        css: {
            "background-color": "#ffffff",
            "border-width": "2px",
        },
        },
        {
        selector: 'node[class="department"]',
        css: {
            "background-color": "#ffffff",
            "border-width": "2px",
            shape: "roundrectangle",
            "text-valign": "top",
        },
        },
        {
        selector: "edge",
        css: {
            opacity: 0.3,
        },
        },
        {
        selector: "edge[source='Personal Robots Group']",
        css: {
            "line-fill": "linear-gradient",
            "line-gradient-stop-colors": "black white",
            "line-gradient-stop-positions": "100 10",
        },
        },
        {
        selector: "node.highlight",
        style: {
            "border-color": "#000",
            "border-width": "2px",
        },
        },
        {
        selector: "node.semitransp",
        style: { opacity: 0.3 },
        },
        {
        selector: "edge.highlight",
        style: { opacity: 1 },
        },
    ];

    for (const theme of Object.keys(themes)) {
        makeValuesReadable(themes[theme].details);
        prgProjectsElements.push({
            data: {
                id: theme,
                level: numProjects + numResearchers,
                class: "theme",
                ...themes[theme].details,
            },
            group: "nodes",
        });
        styling.push({
        selector: `node[id="${theme}"]`,
        css: {
            "background-color": `#${themeColors[colorIndex]}`,
        },
        });
        prgProjectsElements.push({
        data: {
            source: "Personal Robots Group",
            target: theme,
        },
        group: "edges",
        });
        for (const project of Object.keys(themes[theme])) {
            if (project === "details") continue;
            makeValuesReadable(themes[theme][project]);
            prgProjectsElements.push(
                {
                data: {
                    id: project,
                    level: numResearchers,
                    theme: theme,
                    class: "project",
                    ...themes[theme][project],
                },
                group: "nodes",
                },
                {
                data: {
                    source: theme,
                    target: project,
                },
                group: "edges",
                }
            );
            var rgbArr = [
                themeColors[colorIndex].substring(0, 2),
                themeColors[colorIndex].substring(2, 4),
                themeColors[colorIndex].substring(4, 6),
            ];
            var rgb = rgbArr.map((x) => Math.round(Math.min(parseInt(x, 16) * 1.2, 255)));
            styling.push(
                {
                selector: `node[theme="${theme}"]`,
                css: {
                    "background-color": `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
                },
                },
                {
                selector: `edge[source="${theme}"]`,
                css: {
                    "line-color": `#${themeColors[colorIndex]}`,
                },
                }
            );
        }
        colorIndex = (colorIndex + 1) % themeColors.length;
    }

    for (const person of Object.keys(researchers)) {
        const { name: personName, projects, role, ...personAttr } = researchers[person];

        makeValuesReadable(personAttr);
        prgProjectsElements.push({
        data: {
            id: personName,
            level: 1,
            class: "person",
            ...personAttr,
        },
        group: "nodes",
        });

        for (const project of projects) {
            var projectList = Object.values(themes).reduce(
                (acc: string[], val) => acc.concat(Object.keys(val)),
                []
            );
            if (projectList.includes(project)) {
                prgProjectsElements.push({
                data: { source: project, target: personName },
                group: "edges",
                });
            }
        }
    }
    for (const department of ["Admin & Finance", "Tech Developer", "Lab Management"]) {
        prgProjectsElements.push({
        data: {
            id: department,
            class: "department",
            ...roles[department]
        },
        group: "nodes",
        });
    }
    for (const staffMember of staff) {
        const { name: staffMemberName, projects, ...staffAttr } = staffMember;

        makeValuesReadable(staffAttr);
        prgProjectsElements.push({
            data: {
            id: staffMemberName,
            class: "staff",
            parent: staffMember.role.role,
            ...staffAttr,
            },
            group: "nodes",
        });

        // for (const project of projects) {
        //     var projectList = Object.values(themes).reduce(
        //         (acc: string[], val) => acc.concat(Object.keys(val)),
        //         []
        //     );
        //     if (projectList.includes(project)) {
        //         prgProjectsElements.push({
        //             data: { source: project, target: staffMemberName },
        //             group: "edges",
        //         });
        //     }
        // }
    }

    return [prgProjectsElements, styling];

}