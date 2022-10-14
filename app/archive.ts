
export const  makeNodesEdgesOld = (prgProjects) => {
    const { name, ...directorAttr } = prgProjects.director;
    const allProjects = prgProjects.projects;
    const people = prgProjects.people;
    const staff = prgProjects.staff;

    const numThemes = Object.keys(allProjects).length;
    const numProjects = Object.keys(allProjects).reduce((acc, theme) => {
        return acc + Object.keys(allProjects[theme]).length;
    }, 0);
    const numPeople = Object.keys(people).length;
    makeValuesReadable(directorAttr);
    let colorIndex = 0;
    let prgProjectsElements = [
        {
        data: {
            id: "Personal Robots Group",
            level: numThemes + numProjects + numPeople,
            class: "title",
        },
        group: "nodes",
        },
        {
        data: {
            id: name,
            level: numThemes + numProjects + numPeople,
            class: "director",
            ...directorAttr,
        },
        group: "nodes",
        },
        {
        data: {
            source: name,
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

    for (const theme of Object.keys(allProjects)) {
        prgProjectsElements.push({
        data: {
            id: theme,
            level: numProjects + numPeople,
            class: "theme",
            ...Object.fromEntries(
            Object.entries(allProjects[theme]).filter(
                ([key, val]) => typeof val !== "object"
            )
            ),
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
        for (const project of Object.keys(allProjects[theme])) {
            // TODO: Fix this
            makeValuesReadable(allProjects[theme][project]);
        prgProjectsElements.push(
            {
            data: {
                id: project,
                level: numPeople,
                theme: theme,
                class: "project",
                ...allProjects[theme][project],
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
        let rgb = [
            themeColors[colorIndex].substring(0, 2),
            themeColors[colorIndex].substring(2, 4),
            themeColors[colorIndex].substring(4, 6),
        ];
        rgb = rgb.map((x) => Math.round(Math.min(parseInt(x, 16) * 1.2, 255)));
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

    for (const person of Object.keys(people)) {
        const { projects, ...personAttr } = people[person];

        makeValuesReadable(personAttr);
        prgProjectsElements.push({
        data: {
            id: person,
            level: 1,
            class: "person",
            ...personAttr,
        },
        group: "nodes",
        });

        for (const project of projects) {
        var projectList = Object.values(allProjects).reduce(
            (acc, val) => acc.concat(Object.keys(val)),
            []
        );
        if (projectList.includes(project)) {
            prgProjectsElements.push({
            data: { source: project, target: person },
            group: "edges",
            });
        }
        }
    }
    for (const department of Object.keys(staff)) {
        prgProjectsElements.push({
        data: {
            id: department,
            class: "department",
        },
        group: "nodes",
        });
        for (const staffMember of Object.keys(staff[department])) {
        const { projects, ...staffAttr } = staff[department][staffMember];

        makeValuesReadable(staffAttr);
        prgProjectsElements.push({
            data: {
            id: staffMember,
            class: "staff",
            parent: department,
            ...staffAttr,
            },
            group: "nodes",
        });

        for (const project of projects) {
            var projectList = Object.values(allProjects).reduce(
            (acc, val) => acc.concat(Object.keys(val)),
            []
            );
            if (projectList.includes(project)) {
            prgProjectsElements.push({
                data: { source: project, target: staffMember },
                group: "edges",
            });
            }
        }
        }
    }

    return [prgProjectsElements, styling];
}
