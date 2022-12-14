import { type NormalizedData } from "builder";
import { makeNodesAndEdges } from "./genGraphData";
import json from "./data.json";
import cytoscape from "cytoscape";
import { hideTooltipCss, showTooltipForNode, showTooltipWithDesc, styleTooltip } from "./tooltip";

const data = json as any as NormalizedData;
const [prgProjectsElements, styling] = makeNodesAndEdges(data);

var nodeWidth: number,
  nodeHeight: number,
  staffX: number,
  staffY: number,
  nodeY: number,
  dept: string,
  currentLayout = "fullLayout",
  removedNodes: { [collection: string]: cytoscape.NodeCollection } = {};

const cyContainer = document.getElementById("cy");
const displayThemesCheck = document.getElementById("displayThemes") as HTMLInputElement;
const displayProjectsCheck = document.getElementById("displayProjects") as HTMLInputElement;
const displayPeopleCheck = document.getElementById("displayPeople") as HTMLInputElement;
const selectTheme = document.getElementById("themeSelect") as HTMLSelectElement;
const selectProject = document.getElementById("projectSelect") as HTMLSelectElement;
const selectPerson = document.getElementById("personSelect") as HTMLSelectElement;
const selectThemeList = document.getElementById("themeSelectList") as HTMLSelectElement;
const selectProjectList = document.getElementById("projectSelectList") as HTMLSelectElement;
const selectPersonList = document.getElementById("personSelectList") as HTMLSelectElement;
const takeATour = document.getElementById("takeATour") as HTMLButtonElement;

async function runTour(cy: cytoscape.Core) {
  const pos = { x: 0, y: 0 };
  cy.trigger("tap");
  cy.elements().addClass("semitransp");

  // TODO: move description to data
  // start with center
  const center = cy.nodes("node[class='director']").union(cy.nodes("node[class='title']"));
  center.addClass("highlight").removeClass("semitransp");
  showTooltipWithDesc(
    "Personal Robots Group",
    "Welcome to the Personal Robots Group! The Personal Robots Group focuses on developing the principles, techniques, and technologies for personal robots.",
    pos
  );
  await new Promise(f => setTimeout(f, 5000));
  center.removeClass("highlight").addClass("semitransp");

  // go over themes
  const themes = cy.nodes("node[class='theme']");
  themes.addClass("highlight").removeClass("semitransp");
  showTooltipWithDesc(
    "Personal Robots Group: Themes",
    "All of the projects of the Personal Robots Group center around themes from AI Education to the Air Force.",
    pos
  );
  await new Promise(f => setTimeout(f, 5000));
  themes.removeClass("highlight").addClass("semitransp");

  // go over projects
  const projects = cy.nodes("node[class='project']");
  projects.addClass("highlight").removeClass("semitransp");
  showTooltipWithDesc(
    "Personal Robots Group: Projects",
    "We have a bunch of cool projects with a wide range of goals.",
    pos
  );
  await new Promise(f => setTimeout(f, 5000));
  projects.removeClass("highlight").addClass("semitransp");

  // go over people
  const people = cy.nodes("node[class='person']").union(cy.nodes("node[class='staff']"));
  people.addClass("highlight").removeClass("semitransp");
  people.parents().addClass("highlight").removeClass("semitransp");
  showTooltipWithDesc(
    "Personal Robots Group: People",
    "We also have amazing researchers and staff who make these projects possible.",
    pos
  );
  await new Promise(f => setTimeout(f, 5000));

  styleTooltip(hideTooltipCss);
  cy.elements().removeClass("semitransp").removeClass("highlight");
}

const fullLayout: cytoscape.LayoutOptions = {
  name: "concentric",
  concentric: function (node: cytoscape.NodeSingular & { degree(): number }): number {
    return node.data("level");
  },
  avoidOverlap: false,
  equidistant: true,
  animationDuration: 500,
  transform(node, position) {
    if (node.data("class") === "director") position.y += nodeHeight * 1.2;
    return position;
  },
};

const staffLayout: cytoscape.PresetLayoutOptions = {
  name: "preset",
  positions: (node: cytoscape.NodeSingular & any) => {
    if (node.data("parent") !== dept) {
      dept = node.data("parent");
      nodeY += nodeHeight * 2.5;
    } else {
      nodeY += nodeHeight * 1.5;
    }
    return {
      x: staffX,
      y: nodeY,
    };
  },
};
const zoomedLayout: cytoscape.ConcentricLayoutOptions = {
  name: "concentric",
  concentric: function (node: cytoscape.NodeSingular & { degree(): number; }) {
    return node.data("zoomedLevel");
  },
  animate: true,
};
const runStaffLayout = (cy: cytoscape.Core) => {
  cy.nodes("node[class='staff']").layout(staffLayout).run();
}
const updateSelections = (cy: cytoscape.Core, category: string) => {
  const nodes = cy.nodes();
  const all = category === "all";
  switch (category) {
    case "all":
    case "themes":
      console.log("adding themes");
      const themes = nodes.filter("node[class='theme']");
      selectThemeList.innerHTML = '';
      themes.forEach((node) => {
        const option = document.createElement("option");
        option.value = node.data("id");
        selectThemeList.appendChild(option);
      });
      if (!all) break;
    case "projects":
      console.log("adding projects");
      const projects = nodes.filter("node[class='project']");
      selectProjectList.innerHTML = '';
      projects.forEach((node) => {
        const option = document.createElement("option");
        option.value = node.data("id");
        selectProjectList.appendChild(option);
      });
      if (!all) break;
    case "people":
      console.log("adding people");
      const people = nodes.filter("node[class='staff']").union(nodes.filter("node[class='person']"));
      selectPersonList.innerHTML = '<option value="select">Select a Person</option>';
      people.forEach((node) => {
        const option = document.createElement("option");
        option.value = node.data("id");
        selectPersonList.appendChild(option);
      });
      if (!all) break;
  }
}
const selectItem = (cy: cytoscape.Core, id: string) => {
  const node = cy.nodes(`node[id='${id}']`);
  if (node.length === 0) return;
  node.trigger("tap");
  selectTheme.value = "";
  selectProject.value = "";
  selectPerson.value = "";
}

const removeNodes = (cy: cytoscape.Core, collection: cytoscape.NodeCollection, classes: string[]) => {
  for (const className of classes) {
    collection = collection.union(cy.nodes(`[class="${className}"]`).remove());
  }
  return collection;
}
const isNode = (node: cytoscape.NodeSingular) => {
  return ![undefined, "title"].includes(node.data("class"));
};

const handleMouseOver = (cy: cytoscape.Core, evt: cytoscape.EventObject) => {
  const node = evt.target;
  if (node.data("class") === "title") return;

  // tooltip position
  const zoom = cy.zoom();
  const cyPos = cy.pan();
  const nodePos = node.position();
  const nodeDiameter = node.width();
  const offSet = nodeDiameter * zoom * 0.4;
  const pos = {
    x: cyPos.x + nodePos.x * zoom + offSet,
    y: cyPos.y + nodePos.y * zoom - offSet,
  };
  showTooltipForNode(node, pos);

  cy.batch(function () {
    // highlight
    node.addClass("highlight");
    cy.elements()
      .difference(node.successors())
      .difference(node.predecessors())
      .difference(node)
      .difference(cy.nodes(`[id="${node.data("parent")}"]`))
      .difference(cy.nodes('[class="department"]'))
      .addClass("semitransp");
    node
      .successors()
      .difference(cy.nodes('[id="Personal Robots Group"]'))
      .difference(cy.nodes('[class="department"]'))
      .addClass("highlight");
    node
      .predecessors()
      .difference(cy.nodes('[id="Personal Robots Group"]'))
      .difference(cy.nodes('[class="department"]'))
      .addClass("highlight");
  });
};

const handleMouseOut = (cy: cytoscape.Core) => {
  styleTooltip(hideTooltipCss);
  cy.elements().removeClass("semitransp").removeClass("highlight");
};

const handlePan = () => {
  const prevStyling = styleTooltip(hideTooltipCss);
  styleTooltip(prevStyling);
};

const director = {
  name: "Cynthia Breazeal",
  vision: "TBA",
  "main website": "https://robots.media.mit.edu/",
  "past projects": "https://robots.media.mit.edu/project-portfolio/applications/",
};

const handleTap = (cy: cytoscape.Core, evt: cytoscape.EventObject) => {
  const node = evt.target;
  if (!isNode(node)) styleTooltip(hideTooltipCss);;
  if (node.data("class") === "director") {
    // clicked director node
    handleMouseOut(cy);
    handleMouseOver(cy, evt);
    cy.animation({
      zoom: {
        level: 1,
        position: node.position(),
      },
    })
      .play()
      .promise()
      .then(() => {
        showTooltipForNode(node, { x: 0, y: 0 });
      });
    cy.unbind("mouseover").unbind("mouseout");
    currentLayout = "zoomedLayout";
  } else if (currentLayout === "zoomedLayout" && !isNode(node)) {
    // graph is zoomed in and user clicked on outside to zoom out
    const { name, ...directorAttr } = director;
    nodeWidth = cy.nodes()[0].width();
    nodeHeight = cy.nodes()[0].height();

    const addNodes: cytoscape.ElementDefinition[] = [
      {
        data: {
          id: "Personal Robots Group",
          level: cy.elements().length,
          class: "title",
        },
        group: "nodes",
      },
      {
        data: {
          id: director.name,
          level: cy.elements().length,
          class: "director",
          ...directorAttr,
        },
        group: "nodes",
      },
      {
        data: {
          source: "Cynthia Breazeal",
          target: "Personal Robots Group",
        },
        group: "edges",
      },
    ];

    cy.nodes("node[class='theme']")
      .forEach((node: cytoscape.NodeSingular) => {
        addNodes.push({
          data: {
            source: "Personal Robots Group",
            target: node.data("id"),
          },
          group: "edges",
        });
      });

    handleMouseOut(cy);

    cy.batch(function () {
      removedNodes["coreNodes"].restore();
      cy.bind("mouseover", "node", (evt) => handleMouseOver(cy, evt));
      cy.bind("mouseout", "node", () => handleMouseOut(cy));
      fullLayout.animate = true;
      cy.zoomingEnabled(false);
      nodeY = staffY;
      runStaffLayout(cy);
      cy.zoomingEnabled(true);
    });

    cy.nodes()
      .difference(cy.nodes("node[class='staff']"))
      .difference(cy.nodes("node[class='department']"))
      .layout(fullLayout)
      .run();

    currentLayout = "fullLayout";
  } else if (
    isNode(node) &&
    node.data("zoomedLevel") !== cy.elements().length
  ) {
    // clicked node and it is not zoomed in
    handleMouseOut(cy);
    handleMouseOver(cy, evt);
    removedNodes["coreNodes"] = removedNodes["coreNodes"]
      .union(cy.nodes('[id="Personal Robots Group"]').remove())
      .union(cy.nodes('[class="director"]').remove());
    cy.zoomingEnabled(false);
    cy.batch(function () {
      // highlight
      node.addClass("highlight").data("zoomedLevel", cy.elements().length);
      cy.nodes('[id="Personal Robots Group"]').data(
        "zoomedLevel",
        cy.elements().length
      );

      cy.elements()
        .difference(node.successors())
        .difference(node.predecessors())
        .difference(node)
        .difference(cy.nodes('[class="department"]'))
        .addClass("semitransp")
        .data("zoomedLevel", 1);
      node
        .successors()
        .difference(cy.nodes('[id="Personal Robots Group"]'))
        .addClass("highlight")
        .data(
          "zoomedLevel",
          cy
            .elements()
            .difference(node.successors())
            .difference(node.predecessors()).length
        );
    });
    if (node.data("class") === "person") {
      cy.batch(function () {
        node
          .predecessors()
          .not(cy.nodes('[id="Personal Robots Group"]'))
          .addClass("highlight");
        node
          .incomers()
          .data(
            "zoomedLevel",
            cy.elements().difference(node.incomers()).length
          );
        node
          .incomers()
          .incomers()
          .data(
            "zoomedLevel",
            cy.elements().difference(node.predecessors()).length
          );
      });
    } else {
      cy.batch(function () {
        node
          .predecessors()
          .not(cy.nodes('[id="Personal Robots Group"]'))
          .addClass("highlight")
          .data(
            "zoomedLevel",
            cy
              .elements()
              .difference(node.successors())
              .difference(node.predecessors()).length
          );
      });
    }

    cy.unbind("mouseover").unbind("mouseout");
    currentLayout = "zoomedLayout";

    cy.elements()
      .layout(zoomedLayout)
      .run()
      .on("layoutstop", () => {
        cy.zoomingEnabled(true);
        const connectedElements =
          cy.elements().length -
          cy
            .elements()
            .difference(node.successors())
            .difference(node.predecessors()).length;
        cy.animation({
          zoom: {
            level: connectedElements > 0 ? connectedElements ** 0.001 : 2,
            position: node.position(),
          },
        })
          .play()
          .promise()
          .then(() => {
            showTooltipForNode(node, { x: 0, y: 0 });
          });
      });
  }
};

const formatCy = (cy: cytoscape.Core) => {
  removedNodes["coreNodes"] = cy.collection();
  removedNodes["themeNodes"] = cy.collection();
  removedNodes["projectNodes"] = cy.collection();
  removedNodes["peopleNodes"] = cy.collection();
  nodeWidth = cy.nodes()[0].width();
  nodeHeight = cy.nodes()[0].height();
  staffX = cy.nodes().boundingBox().x2 + nodeWidth * 3;
  staffY = cy.nodes().boundingBox().y1;
  nodeY = staffY;
  runStaffLayout(cy);
  cy.nodes()
    .difference(cy.nodes("node[class='staff']"))
    .difference(cy.nodes("node[class='department']"))
    .layout(fullLayout)
    .run();

  // @ts-ignore
  cy.nodes().panify().ungrabify(); // hm?
  updateSelections(cy, "all");
  console.log("updated")

  cy.bind("tap", (evt) => handleTap(cy, evt));
  cy.bind("mouseover", "node", (evt) => handleMouseOver(cy, evt));
  cy.bind("mouseout", "node", () => handleMouseOut(cy));
  cy.bind("pan", () => handlePan());

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
  });
};

const cy = cytoscape({
  container: cyContainer, // container to render in,
  layout: fullLayout,
  elements: prgProjectsElements,
  style: styling,
});

formatCy(cy);