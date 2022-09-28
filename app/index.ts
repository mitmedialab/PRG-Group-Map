import { Data } from "../builder";
import json from "./data.json";
import Sigma from "sigma";
import Graph from "graphology";
import ForceSupervisor from "graphology-layout-force/worker";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import forceAtlas2 from "graphology-layout-forceatlas2";

const data: Data = json as Data;

type NodeAttributes = {
    label: string;
    color: string;
    size: number,
    x?: number,
    y?: number
}

type EdgeAttributes = {
    weight: number;
}

type GraphAttributes = {
    name?: string;
}

const graph = new Graph<NodeAttributes, EdgeAttributes, GraphAttributes>();

const themes = Object.entries(data.themes);

themes.forEach(([themeName, theme], i) => {
    const angle = (i * 2 * Math.PI) / themes.length;

    const position = { x: Math.cos(angle), y: Math.sin(angle) };

    graph.addNode(themeName, {
        size: 20,
        label: themeName,
        color: "#32a852",
        ...position
    });

    const projects = Object.entries(theme);
    projects.forEach(([projectName, project], index) => {
        if (projectName === "description") return;
        const angle = (index * 2 * Math.PI) / projects.length;
        graph.addNode(projectName, {
            size: 10,
            label: projectName,
            color: "#32a852",
            x: position.x + Math.cos(angle) * 0.1,
            y: position.y + Math.sin(angle) * 0.1
        });

        graph.addEdge(themeName, projectName);
    });

});

/*
data.members.forEach((member, i) => {
    graph.addNode(member.name, {
        size: 20,
        label: member.name,
        color: "#32a852",
        x: Math.random(),
        y: Math.random(),
    })
});*/
const layout = new ForceSupervisor(graph);
layout.start();

const container = document.getElementById("sigma-container") as HTMLElement;

const renderer = new Sigma(graph, container);
