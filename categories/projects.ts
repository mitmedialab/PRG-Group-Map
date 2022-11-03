import { category } from "../builder";

const projects = category({
    ...(await import("./projects/c2c")).default,
    ...(await import("./projects/featurePerception")).default,
});

type ProjectName = keyof typeof projects;