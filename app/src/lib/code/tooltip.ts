import { writable, type Writable } from "svelte/store";
import { capitalize, toAttr } from "./utils";

export type Tooltip = {
  visible: true;
  title: string,
  type?: string,
  position: { x: number, y: number }
  items: ([string, string] | string)[];
};

export const tooltip: Writable<TooltipState> = writable({ visible: false });

type HiddenTooltip = { visible: false };

export type TooltipState = Tooltip | HiddenTooltip;

const isAuxiliaryNodeInfo = (item: any) =>
  item[1] !== undefined &&
  !["id", "class", "level", "zoomedLevel", "parent"].includes(item[0]);

const extractInfoFromNode = (item: any): Tooltip["items"][0] => [capitalize(item[0]), `${toAttr(item[0], item[1])}`];

export const showTooltipForNode = (node: cytoscape.NodeSingular, pos: { x: number; y: number; }) => tooltip.set({
  visible: true,
  title: node.data("id"),
  type: node.data("class"),
  position: pos,
  items: Object.entries(node.data()).filter(isAuxiliaryNodeInfo).map(extractInfoFromNode)
});


export const showTooltipWithDesc = (title: string, desc: string, pos: { x: any; y: any; }) => tooltip.set({
  visible: true,
  title,
  position: pos,
  items: [desc]
});

export const hideTooltip = () => tooltip.set({ visible: false });