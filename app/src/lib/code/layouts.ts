import type { LayoutOptions, NodeSingular, PresetLayoutOptions, NodeCollection, CollectionReturnValue, Core, EventObject, ConcentricLayoutOptions } from "cytoscape";
import type cytoscape from "cytoscape";
import type { Node } from "postcss";
import { get } from "svelte/store";
import { getRootElements, structure } from "./map";
import { hideTooltip, showTooltipForNode, showTooltipWithDesc } from "./tooltip";
import { getNodesOfClass, isClass, edge, collect, getNodesWithID, type Class } from "./utils";

const title = "Personal Robots Group";

type Transform = {
  height: number,
  width: number,
  x: number,
  y: number
}

const defaultTransform = (): Transform => ({ x: 0, y: 0, height: 0, width: 0 });
const setTransform = (transform: Transform, updates: Partial<Transform>) => {
  for (const key in updates) {
    const value = updates[key as keyof Partial<Transform>] as number;
    transform[key as keyof Transform] = value;
  }
}

const nodeTransform = defaultTransform();
const staffTransform = defaultTransform();

const isDataNode = (node: cytoscape.NodeSingular) => ![undefined, "title"].includes(node.data("class"));

let dept: string;
let currentLayout = "fullLayout";
const removedNodes: { [collection in Class]?: NodeCollection } = {};

const raiseDirectorNode: cytoscape.ConcentricLayoutOptions["transform"] = (node, { x, y }) =>
  ({ x, y: y + (!isClass(node, "director") ? 0 : nodeTransform.height * 1.2) });

export const fullLayout: LayoutOptions = {
  name: "concentric",
  concentric: (node: NodeSingular & { degree(): number }): number => node.data("level"),
  avoidOverlap: false,
  equidistant: true,
  animationDuration: 500,
  transform: raiseDirectorNode
};

const staffLayout: PresetLayoutOptions = {
  name: "preset",
  positions: (node: NodeSingular & any) => {
    const { height } = nodeTransform;
    if (node.data("parent") !== dept) { // what is dept doing here?
      dept = node.data("parent");
      nodeTransform.y += height * 2.5;
    } else {
      nodeTransform.y += height * 1.5;
    }
    const { x } = staffTransform;
    const { y } = nodeTransform;
    return { x, y };
  },
};

const zoomedLayout: ConcentricLayoutOptions = {
  name: "concentric",
  concentric: function (node: NodeSingular & { degree(): number; }) {
    return node.data("zoomedLevel");
  },
  animate: true,
};

const layoutStaff = (cy: Core) => getNodesOfClass(cy, "staff").layout(staffLayout).run();

const getNodePosition = (cy: Core, node: cytoscape.NodeSingular) => {
  const zoom = cy.zoom();
  const cyPos = cy.pan();
  const nodePos = node.position();
  const nodeDiameter = node.width();
  const offSet = nodeDiameter * zoom * 0.4;
  return {
    x: cyPos.x + nodePos.x * zoom + offSet,
    y: cyPos.y + nodePos.y * zoom - offSet,
  };
}

const handlePan = () => hideTooltip();

const handleMouseOut = (cy: Core) => {
  hideTooltip();
  cy.elements().removeClass("semitransp").removeClass("highlight");
};

const handleMouseOver = (cy: Core, node: NodeSingular) => {
  if (isClass(node, "title")) return;

  const position = getNodePosition(cy, node);
  showTooltipForNode(node, position);

  cy.batch(function () {

    const departmentNodes = getNodesOfClass(cy, "department");
    const titleNode = getNodesWithID(cy, title);
    const parent = getNodesWithID(cy, node.data("parent"));

    const successors = node.successors();
    const predecessors = node.predecessors();

    node.addClass("highlight");

    collect({ include: successors, exclude: [departmentNodes, titleNode] }).addClass("highlight");
    collect({ include: predecessors, exclude: [departmentNodes, titleNode] }).addClass("highlight");

    collect({ include: cy.elements(), exclude: [node, successors, predecessors, parent, departmentNodes] })
      .addClass("semitransp");
  });
};

const handleZoomInOnNode = (cy: Core, node: NodeSingular,) => {
  if (node.data("zoomedLevel") === cy.elements().length) return false;

  handleMouseOut(cy);
  handleMouseOver(cy, node);

  remove(cy, ["title", "director"]);

  cy.zoomingEnabled(false);

  const titleNode = getNodesWithID(cy, title);
  const allElements = cy.elements();
  const { length } = allElements;
  const predecessors = node.predecessors();
  const successors = node.successors();
  const connectedElementsCount = length - successors.length - predecessors.length;

  const highlightAndArrangeConnectedNodes = () => {
    node.addClass("highlight").data("zoomedLevel", length);
    titleNode.data("zoomedLevel", length);

    const departmentNodes = getNodesOfClass(cy, "department");

    collect({ include: allElements, exclude: [node, predecessors, successors, departmentNodes] })
      .addClass("semitransp")
      .data("zoomedLevel", 1);

    const successorZoom = collect({ include: allElements, exclude: [successors, predecessors] }).length;

    collect({ include: successors, exclude: [titleNode] })
      .addClass("highlight")
      .data("zoomedLevel", successorZoom);

    const predecessorCollection = collect({ include: predecessors, exclude: [titleNode] }).addClass("highlight");

    if (!isClass(node, "person")) return predecessorCollection.data("zoomedLevel", connectedElementsCount);

    const projects = node.incomers();
    const themes = projects.incomers();

    projects.data("zoomedLevel", length - projects.length);
    themes.data("zoomedLevel", length - predecessors.length);
  }

  cy.batch(highlightAndArrangeConnectedNodes);

  cy.unbind("mouseover").unbind("mouseout");
  currentLayout = "zoomedLayout";

  allElements.layout(zoomedLayout).run().on("layoutstop", () => {
    cy.zoomingEnabled(true);
    cy.animation({
      zoom: {
        level: connectedElementsCount > 0 ? connectedElementsCount ** 0.001 : 2,
        position: node.position(),
      },
    })
      .play()
      .promise()
      .then(() => showTooltipForNode(node, { x: 0, y: 0 }));
  });

  return true;
}

const handleDirectorClicked = (cy: Core, node: NodeSingular) => {
  if (!isClass(node, "director")) return false;

  handleMouseOut(cy);
  handleMouseOver(cy, node);

  cy.animation({
    zoom: {
      level: 1,
      position: node.position(),
    },
  })
    .play()
    .promise()
    .then(() => showTooltipForNode(node, { x: 0, y: 0 }));

  cy.unbind("mouseover").unbind("mouseout");
  currentLayout = "zoomedLayout";

  return true;
}

const handleUserClickedToZoomOut = (cy: Core, node: NodeSingular) => {
  if (currentLayout !== "zoomedLayout") return false;

  setTransform(nodeTransform, { width: cy.nodes()[0].width(), height: cy.nodes()[0].height() });

  const addNodes: cytoscape.ElementDefinition[] = [...getRootElements()];
  const themeNodes = getNodesOfClass(cy, "theme");
  const edgesFromTitleToThemes = themeNodes.map(n => edge({ source: title, target: n.data("id") }));

  addNodes.push(...edgesFromTitleToThemes);

  handleMouseOut(cy);

  cy.batch(function () {
    restoreCoreNodes();
    cy.bind("mouseover", "node", (evt) => handleMouseOver(cy, evt.target as NodeSingular));
    cy.bind("mouseout", "node", () => handleMouseOut(cy));
    fullLayout.animate = true;
    cy.zoomingEnabled(false);
    nodeTransform.y = staffTransform.y; // why
    layoutStaff(cy);
    cy.zoomingEnabled(true);
  });

  collect({ include: cy.nodes(), exclude: [getNodesOfClass(cy, "staff"), getNodesOfClass(cy, "department")] })
    .layout(fullLayout)
    .run();

  currentLayout = "fullLayout";

  return true;
}

const handleTap = (cy: Core, evt: EventObject) => {
  const node: NodeSingular = evt.target;

  const dataNodeClicked = isDataNode(node);

  if (!dataNodeClicked) {
    hideTooltip();
    handleUserClickedToZoomOut(cy, node);
    return;
  }

  if (handleDirectorClicked(cy, node)) return;
  handleZoomInOnNode(cy, node);
};

const restore = (classes: Class | Class[]) => (Array.isArray(classes) ? classes : [classes]).
  forEach(_class => {
    removedNodes[_class]?.restore();
    removedNodes[_class] = undefined;
  });

const restoreCoreNodes = () => restore(["director", "title"]); // order matters here!!

const remove = (cy: Core, classes: Class[] | Class) => (Array.isArray(classes) ? classes : [classes]).
  forEach(_class => {
    const removed = getNodesOfClass(cy, _class).remove();
    removedNodes[_class] = removedNodes[_class]?.union(removed) ?? removed;
  });

export const selectItem = (id: string) => {
  const cy = get(structure);
  const node = getNodesWithID(cy, id);
  if (node.length === 0) return;
  node.trigger("tap");
}

export const displayThemes = (doDisplay: boolean) => {
  const cy = get(structure);
  doDisplay ? restore("theme") : remove(cy, "theme");
  cy.trigger("tap");
  handleMouseOut(cy);
}

export const displayProjects = (doDisplay: boolean) => {
  const cy = get(structure);
  doDisplay ? restore("project") : remove(cy, "project");
  cy.trigger("tap");
  handleMouseOut(cy);
};

export const displayPeople = (doDisplay: boolean) => {
  const cy = get(structure);
  const allPeople: Class[] = ["person", "staff", "department"];
  doDisplay ? restore(allPeople) : remove(cy, allPeople);
  cy.trigger("tap");
  handleMouseOut(cy);
};

export const formatGraph = (cy: cytoscape.Core) => {
  const nodes = cy.nodes();

  const width = nodes[0].width();
  const y = nodes.boundingBox().y1;

  setTransform(nodeTransform, { width, y, height: cy.nodes()[0].height() });
  setTransform(staffTransform, { x: cy.nodes().boundingBox().x2 + width * 3, y });

  layoutStaff(cy);

  const auxiliaryNodes = [getNodesOfClass(cy, "staff"), getNodesOfClass(cy, "department")];

  collect({ include: nodes, exclude: auxiliaryNodes }).layout(fullLayout).run();

  // @ts-ignore
  nodes.panify().ungrabify(); // hm?

  cy.bind("tap", (evt) => handleTap(cy, evt));
  cy.bind("mouseover", "node", (evt) => handleMouseOver(cy, evt.target as NodeSingular));
  cy.bind("mouseout", "node", () => handleMouseOut(cy));
  cy.bind("pan", () => handlePan());
}

const highlight = (collection: NodeCollection) => collection.addClass("highlight").removeClass("semitransp");
const hide = (collection: NodeCollection) => collection.removeClass("highlight").addClass("semitransp");

const highlightDescrbeThenHide = async (cy: Core, collection: NodeCollection, title: string, description: string) => {
  highlight(collection);

  showTooltipWithDesc(title, description, { x: 0, y: 0 });

  await new Promise(f => setTimeout(f, 5000));
  hide(collection);
}

export async function runTour() {
  const cy = get(structure);
  cy.trigger("tap");
  const allElements = cy.elements();
  hide(allElements);

  // TODO: move description to data

  // start with center
  await highlightDescrbeThenHide(
    cy,
    getNodesOfClass(cy, "director").union(getNodesOfClass(cy, "title")),
    "Personal Robots Group",
    "Welcome to the Personal Robots Group! The Personal Robots Group focuses on developing the principles, techniques, and technologies for personal robots."
  );

  // go over themes
  await highlightDescrbeThenHide(
    cy,
    getNodesOfClass(cy, "theme"),
    "Personal Robots Group: Themes",
    "All of the projects of the Personal Robots Group center around themes from AI Education to the Air Force."
  );

  // go over projects
  await highlightDescrbeThenHide(
    cy,
    getNodesOfClass(cy, "project"),
    "Personal Robots Group: Projects",
    "We have a bunch of cool projects with a wide range of goals."
  );

  // go over people
  await highlightDescrbeThenHide(
    cy,
    getNodesOfClass(cy, "person").union(getNodesOfClass(cy, "staff")),
    "Personal Robots Group: People",
    "We also have amazing researchers and staff who make these projects possible.",
  );

  allElements.removeClass("semitransp").removeClass("highlight");
}