import type { LayoutOptions, NodeSingular, PresetLayoutOptions, NodeCollection, CollectionReturnValue, Core, EventObject, ConcentricLayoutOptions } from "cytoscape";
import type cytoscape from "cytoscape";
import type { Node } from "postcss";
import { getRootElements } from "./map";
import { hideTooltip, showTooltipForNode } from "./tooltip";
import { getNodesOfClass, isClass, edge, collect } from "./utils";

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
const removedNodes: { [collection: string]: NodeCollection } = {};

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
    const titleNode = cy.nodes('[id="Personal Robots Group"]');
    const parent = cy.nodes(`[id="${node.data("parent")}"]`);

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

  removedNodes["coreNodes"] = removedNodes["coreNodes"]
    .union(cy.nodes('[id="Personal Robots Group"]').remove())
    .union(cy.nodes('[class="director"]').remove());

  cy.zoomingEnabled(false);

  const titleNode = cy.nodes('[id="Personal Robots Group"]');
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

  addNodes.push(...getNodesOfClass(cy, "theme").map(n => edge({
    source: "Personal Robots Group",
    target: n.data("id")
  })));


  handleMouseOut(cy);

  cy.batch(function () {
    removedNodes["coreNodes"].restore();
    // comment out below as I didn't think evt was a node? 
    cy.bind("mouseover", "node", (evt) => handleMouseOver(cy, evt.target as NodeSingular));
    cy.bind("mouseout", "node", () => handleMouseOut(cy));
    fullLayout.animate = true;
    cy.zoomingEnabled(false);
    nodeTransform.y = staffTransform.y; // why
    layoutStaff(cy);
    cy.zoomingEnabled(true);
  });

  cy.nodes()
    .difference(cy.nodes("node[class='staff']"))
    .difference(cy.nodes("node[class='department']"))
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

export const formatGraph = (cy: cytoscape.Core) => {
  removedNodes["coreNodes"] = cy.collection();
  removedNodes["themeNodes"] = cy.collection();
  removedNodes["projectNodes"] = cy.collection();
  removedNodes["peopleNodes"] = cy.collection();

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
  updateSelections(cy, "all");

  cy.bind("tap", (evt) => handleTap(cy, evt));
  cy.bind("mouseover", "node", (evt) => handleMouseOver(cy, evt.target as NodeSingular));
  cy.bind("mouseout", "node", () => handleMouseOut(cy));
  cy.bind("pan", () => handlePan());

  /*

  displayThemesCheck?.addEventListener("change", () => {
    if (displayThemesCheck.checked) {
      console.log(removedNodes["themeNodes"])
      removedNodes["themeNodes"].restore();
      updateSelections(cy, "themes");
      cy.trigger("tap");
      handleMouseOut(cy);
    } else {
      removedNodes["themeNodes"] = removeNodes(cy, removedNodes["themeNodes"], ["theme"]);
      updateSelections(cy, "themes");
      cy.trigger("tap");
      handleMouseOut(cy);
    }
  });
  displayProjectsCheck?.addEventListener("change", () => {
    if (displayProjectsCheck.checked) {
      removedNodes["projectNodes"].restore();
      updateSelections(cy, "projects");
      cy.trigger("tap");
      handleMouseOut(cy);
    } else {
      removedNodes["projectNodes"] = removeNodes(cy, removedNodes["projectNodes"], ["project"]);
      updateSelections(cy, "projects");
      cy.trigger("tap");
      handleMouseOut(cy);
    }
  });
  displayPeopleCheck?.addEventListener("change", () => {
    if (displayPeopleCheck.checked) {
      removedNodes["peopleNodes"].restore();
      updateSelections(cy, "people");
      cy.trigger("tap");
      handleMouseOut(cy);
    } else {
      removedNodes["peopleNodes"] = removeNodes(cy, removedNodes["peopleNodes"], ["person", "staff", "department"]);
      updateSelections(cy, "people");
      cy.trigger("tap");
      handleMouseOut(cy);
    }
  });

  selectTheme?.addEventListener("change", () => {
    const selectedTheme = selectTheme.value;
    selectItem(cy, selectedTheme);
  });
  selectProject?.addEventListener("change", () => {
    const selectedProject = selectProject.value;
    selectItem(cy, selectedProject);
  });
  selectPerson?.addEventListener("change", () => {
    const selectedPerson = selectPerson.value;
    selectItem(cy, selectedPerson);
  });

  takeATour?.addEventListener("click", () => {
    runTour(cy);
  });*/
}

const updateSelections = (cy: cytoscape.Core, category: "all" | "themes" | "projects" | "people") => {
  const nodes = cy.nodes();
  const all = category === "all";
  switch (category) {
    case "all":
    case "themes":
      const themes = nodes.filter("node[class='theme']");
      /*
      selectThemeList.innerHTML = '';
      themes.forEach((node) => {
        const option = document.createElement("option");
        option.value = node.data("id");
        selectThemeList.appendChild(option);
      });*/
      if (!all) break;
    case "projects":
      const projects = nodes.filter("node[class='project']");
      /*
      selectProjectList.innerHTML = '';
      projects.forEach((node) => {
        const option = document.createElement("option");
        option.value = node.data("id");
        selectProjectList.appendChild(option);
      });*/
      if (!all) break;
    case "people":
      const people = nodes.filter("node[class='staff']").union(nodes.filter("node[class='person']"));
      /*
      selectPersonList.innerHTML = '<option value="select">Select a Person</option>';
      people.forEach((node) => {
        const option = document.createElement("option");
        option.value = node.data("id");
        selectPersonList.appendChild(option);
      });*/
      if (!all) break;
  }
}