import c2c from "./projects/c2c";
import featurePerception from "./projects/featurePerception";
import { theme } from "../../builder";

export default theme({
    name: "Project STEM",
    details: "",
    projects: {
        "Data, Representation, & AI": "",
        "General AI": "",
        ...featurePerception,
        ...c2c
    }
});