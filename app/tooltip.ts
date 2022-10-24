import { capitalize, toAttr } from "./utils";

const tooltip = document.getElementById("tooltip") as HTMLElement;

export const styleTooltip = (css: { opacity: number, innerHTML: string, pos: { x: any; y: any; } }) => {
    const { opacity, innerHTML, pos } = css;
    const prevStyling = {
        opacity: parseInt(tooltip.style.opacity) !== NaN ? parseInt(tooltip.style.opacity) : 0,
        innerHTML: (tooltip.childNodes[3] as HTMLElement).innerHTML,
        pos: {
            x: parseInt(tooltip.style.left) !== NaN ? parseInt(tooltip.style.left) : 0,
            y: parseInt(tooltip.style.top) !== NaN ? parseInt(tooltip.style.top) : 0,
        },
    };
    tooltip.style.opacity = opacity !== undefined ? opacity.toString() : tooltip.style.opacity;
    (tooltip.childNodes[3] as HTMLElement).innerHTML = innerHTML !== undefined ? innerHTML : (tooltip.childNodes[3] as HTMLElement).innerHTML;
    // tooltip position
    tooltip.style.left = `${pos.x}px`;
    tooltip.style.top = `${pos.y}px`;
    tooltip.style.maxHeight = `${window.innerHeight - pos.y - 30}px`;
    return prevStyling;
}

export const hideTooltipCss: Parameters<typeof styleTooltip>[0] = ({
    opacity: 0,
    innerHTML: "",
    pos: { x: 0, y: 0 },
});

export const showTooltipForNode = (node: cytoscape.NodeSingular, pos: { x: any; y: any; }) => {
    tooltip.childNodes[1].textContent = node.data("id");
    (tooltip.childNodes[3] as HTMLElement).innerHTML = "";
    if (node.data("class") !== "person") {
        (tooltip.childNodes[3] as HTMLElement).innerHTML += `<i>${capitalize(
            node.data("class")
        )}</i>`;
    }
    Object.entries(node.data()).forEach((entry) => {
        if (
            entry[1] !== undefined &&
            !["id", "class", "level", "zoomedLevel", "parent"].includes(entry[0])
        ) {
            (tooltip.childNodes[3] as HTMLElement).innerHTML += `<br/><b>${capitalize(
                entry[0]
            )}:</b> ${toAttr(entry[0], entry[1])}`;
        }
    });
    // tooltip position
    tooltip.style.left = `${pos.x}px`;
    tooltip.style.top = `${pos.y}px`;
    tooltip.style.opacity = `${1}`;
    tooltip.style.maxHeight = `${window.innerHeight - pos.y - 30}px`;
};

export const showTooltipWithDesc = (title: string, desc: string, pos: { x: any; y: any; }) => {
    tooltip.childNodes[1].textContent = title;
    (tooltip.childNodes[3] as HTMLElement).innerHTML = desc;
    // tooltip position
    tooltip.style.left = `${pos.x}px`;
    tooltip.style.top = `${pos.y}px`;
    tooltip.style.opacity = `${1}`;
    tooltip.style.maxHeight = `${window.innerHeight - pos.y - 30}px`;
}