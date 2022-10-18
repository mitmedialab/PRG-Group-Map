import c2c from "./projects/c2c";
import featurePerception from "./projects/featurePerception";
import { theme } from "../../builder";

export default theme({
    name: "Project STEM",
    details: "",
    projects: {
        ...featurePerception,
        ...c2c
    }
});