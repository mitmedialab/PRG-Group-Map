import { capitalize, toAttr } from "./utils";

const tooltip = document.getElementById("tooltip") as HTMLElement;

export const styleTooltip = (css: { opacity: number, innerHTML: string }) => {
    const { opacity, innerHTML } = css;
    opacity !== undefined ? tooltip.style.opacity = `${opacity}` : undefined;
    innerHTML !== undefined ? (tooltip.childNodes[3] as HTMLElement).innerHTML = innerHTML : undefined;
}

export const hideTooltipCss: Parameters<typeof styleTooltip>[0] = ({
    opacity: 0,
    innerHTML: "",
});

export const showTooltipForNode = (node: cytoscape.NodeSingular, pos: { x: any; y: any; }) => {
    tooltip.childNodes[1].textContent = node.data("id");
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