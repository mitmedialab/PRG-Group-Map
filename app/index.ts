import { Data } from "../builder";
import json from "./data.json";
import Sigma from "sigma";
import Graph from "graphology";
import ForceSupervisor from "graphology-layout-force/worker";
import { Coordinates } from "sigma/types";

const data: Data = json as Data;

type NodeAttributes = {
    label: string;
    color: string;
    size: number,
    theme?: string,
    x: number,
    y: number
}

type EdgeAttributes = {
    weight: number;
}

type GraphAttributes = {
    name?: string;
}

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

const circlePositionGenerator = (length: number) => {
    const factor = (2 * Math.PI) / length;
    return {
        at(i: number) {
            const angle = i * factor;

            type Returned = ReturnType<ReturnType<typeof circlePositionGenerator>["at"]>;
            return {
                x: Math.cos(angle),
                y: Math.sin(angle),
                scale(factor: number) {
                    this.x *= factor;
                    this.y *= factor;
                    return this as Returned;
                },
                translate(vector: { x: number, y: number }) {
                    this.x += vector.x;
                    this.y += vector.y;
                    return this as Returned;
                }
            }
        }
    }
}

const graph = new Graph<NodeAttributes, EdgeAttributes, GraphAttributes>();

const themes = Object.entries(data.themes);

const startingThemePositions = circlePositionGenerator(themes.length);
const nodeByPositionsByTheme: Record<string, Array<{ x: number, y: number }>> = {};
const divIDByTheme: Record<string, string> = {};
const divTitleByTheme: Record<string, string> = {};

themes.forEach(([themeName, theme], i) => {
    const color = colors.pop();

    nodeByPositionsByTheme[themeName] = undefined as any;
    divIDByTheme[themeName] = themeName.replace(/\s+/g, '');
    divTitleByTheme[themeName] = `<div id='${divIDByTheme[themeName]}' style="color:${color};" class='clusterLabel'">${themeName}</div>`;

    const position = startingThemePositions.at(i);

    if (!color) throw new Error("Ran out of colors!!");

    const projects = Object.keys(theme).filter(name => name !== "summary");
    const { length } = projects;
    const projectPositions = circlePositionGenerator(length);

    projects.forEach((projectName, index) => {
        if (projectName === "description") return;
        const pos = projectPositions.at(index).scale(0.1).translate(position);
        graph.addNode(projectName, {
            size: 10,
            label: projectName,
            color,
            theme: themeName,
            ...pos
        });
    });

    if (length === 0) return;

    projects.forEach((projectName, index) => {
        const nextIndex = index === length - 1 ? 0 : index + 1;
        graph.addEdge(projectName, projects[nextIndex]);
    });
});


data.members.forEach(({ name, projects }, i) => {
    graph.addNode(name, {
        size: 20,
        label: name,
        color: "#32a852",
        x: Math.random(),
        y: Math.random(),
    })

    projects.forEach((project) => {
        graph.addEdge(name, project, { weight: 100 });
    });
});

const layout = new ForceSupervisor(graph);
layout.start();

const container = document.getElementById("sigma-container") as HTMLElement;

const renderer = new Sigma(graph, container);

const stopLayoutTimeout = setTimeout(() => {
    layout.stop();
    clearTimeout(stopLayoutTimeout);
}, 1000);

const clustersLayer = document.createElement("div");
clustersLayer.innerHTML = Object.values(divTitleByTheme).join("");
// insert the layer underneath the hovers layer
container.insertBefore(clustersLayer, document.getElementsByClassName("sigma-hovers")[0]);

renderer.on("afterRender", () => {
    for (const theme in nodeByPositionsByTheme) {
        nodeByPositionsByTheme[theme] = [];
    }

    graph.forEachNode((node, { theme, x, y }) => {
        if (!theme) return;
        nodeByPositionsByTheme[theme].push({ x, y });
    });

    for (const theme in nodeByPositionsByTheme) {
        const { length } = nodeByPositionsByTheme[theme];
        const { x, y }: Coordinates = nodeByPositionsByTheme[theme].reduce((acc, { x, y }) => {
            x += acc.x;
            y += acc.y;
            return { x, y };
        }, { x: 0, y: 20 });
        // 20 is shift factor to try to clear any overlapping nodes, probably better to identify clear intervals and place in largest one
        // (or if none is avilable, i.e. 1 or 2 nodes cluster, then just place above)


        const viewportPos = renderer.graphToViewport({ x: x / length, y: y / length });
        const element = document.getElementById(divIDByTheme[theme]) as HTMLElement;
        element.style.top = `${viewportPos.y}px`;
        element.style.left = `${viewportPos.x}px`;
    }
});