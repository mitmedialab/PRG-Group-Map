import { category, namesAndDetails } from "../builder";

const themes = {
  "Project STEM": "",
  "AI Education": {
    summary: "",
    links: [{ text: "RAISE", url: "https://raise.mit.edu/" }]
  },
  "Air-Force AI Journey": "",
  "Creativity": "",
  "Ethics & Policy": "",
  "Health & Wellness": "",
  "Social Robots & Literacy": "",
  "Multi-person Robot Interaction": "",
  "Social Robot Education": "",
};

export type ThemeName = keyof typeof themes;

export default category("themes", themes);