import { NormalizedData } from "../builder";
import json from "./data.json";
import Sigma from "sigma";
import Graph from "graphology";
import ForceSupervisor from "graphology-layout-force/worker";
import { Coordinates } from "sigma/types";

const data: NormalizedData = json as NormalizedData;

const colors = [
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "#ffa600",
    "#00876c",
    "#3d9b70",
    "#63ae74",
    "#89c079",
    "#afd27f",
    "#d6e487",
    "#fff492",
    "#fed777",
    "#fbba63",
    "#f69c56",
    "#ee7e50",
    "#e35e4e",
    "#d43d51"
].reverse();