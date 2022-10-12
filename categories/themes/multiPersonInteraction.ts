import { theme } from "../../builder";
import museumInteraction from "./projects/museumInteraction";

export default theme({
    name: "Multi-person Interaction",
    details: "",
    projects: {
        ...museumInteraction,
        "Robots in the Home": "",
    }
});