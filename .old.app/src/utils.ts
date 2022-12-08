import cytoscape from "cytoscape";
//import { VerboseLink, VerboseRole } from "builder";

type VerboseLink = any;
type VerboseRole = any;

function getNumberWithOrdinal(n: number) {
    var s = ["th", "st", "nd", "rd"],
        v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export const toAttr = <T>(key: string, text: T) => {
    if (key === "role") {
        const { name: role, year } = text as VerboseRole;
        return year !== undefined ? `${getNumberWithOrdinal(year)} Year ${role}` : role;
    };

    if (key === "years") {
        // TODO this should be handle elsewhere
        return (text as string).replace(",", "-");
    }
    return text
};

export const capitalize = (s: string) => {
    return (s.charAt(0).toUpperCase() + s.slice(1)).replace(/([A-Z])/g, ' $1').trim();
};

export const isString = <T>(x: T) => typeof x === 'string' || x instanceof String;

export const isObject = <T>(x: T) => !Array.isArray(x) && typeof x === 'object' && x !== null;

export const enum GraphEntity {
    Node = "node",
    Edge = "edge"
}

export const enum Class {
    Title = "title",
    Director = "director",
    Project = "project",
    Theme = "theme",
    Staff = "staff",
    Department = "department",
    Person = "person"
}

export type StyleWithoutSelector = Omit<cytoscape.StylesheetStyle, "selector"> | Omit<cytoscape.StylesheetCSS, "selector">;

const getSelector = (entity: GraphEntity, specifier: string, modifier?: string) => {
    return `${entity}${modifier !== undefined ? `.${modifier}` : ""}${specifier}`
};

const getStyle = <T extends (Record<keyof NodeSpecifier | keyof EdgeSpecifier, string> | "all")>(entity: GraphEntity, specifier: T, details: StyleWithoutSelector, modifier?: string): cytoscape.Stylesheet => ({
    selector: getSelector(entity, isString(specifier) ? "" : `[${Object.keys(specifier)[0]}='${Object.values(specifier)[0]}']`, modifier),
    ...details
});

type Element = cytoscape.ElementDefinition;
export const node = (data: Element['data']): Element => ({ data, group: "nodes" });
export const edge = (data: Element['data']): Element => ({ data, group: "edges" });

type NodeSpecifier = { class: Class } | { theme: string } | { id: string } | "all";
export const nodeStyle = (specifier: NodeSpecifier, details: StyleWithoutSelector, modifier?: string) => getStyle(GraphEntity.Node, specifier, details, modifier);

type EdgeSpecifier = { source: string } | { target: string } | "all";
export const edgeStyle = (specifier: EdgeSpecifier, details: StyleWithoutSelector, modifier?: string) => getStyle(GraphEntity.Edge, specifier, details, modifier);

export const css = (details: cytoscape.StylesheetCSS["css"]): StyleWithoutSelector => ({ css: details });
export const style = (details: cytoscape.StylesheetStyle["style"]): StyleWithoutSelector => ({ style: details });

const makeReadble = <T>(key: string, value: T) => {
    if (key === "email") {
        return `<a href="mailto:${value}">${value}</a>`;
    }
    else if (key === "links" && Array.isArray(value)) {
        return value?.reduce((acc: string, link: VerboseLink) => {
            return `${acc}<a href="${link.url}">${link.text}</a><br>`;
        }, "<br>") ?? "";
    }
    else if (Array.isArray(value)) {
        if (value.length === 0) return "[]";
        return isObject(value[0])
            ? value.map(item => ("name" in item) ? item.name : readableObject(item)).join(", ")
            : value.join(", ");
    }
    else if (isObject(value)) {
        return readableObject(value as object);
    }
    else {
        return value;
    }
}

type Readable<T> = ArrayLike<T[keyof T]>
    & { [k in keyof T]:
        T[k] extends object
        ? Readable<T[k]>
        : T[k] extends Array<any>
        ? string
        : k extends "email"
        ? string
        : k extends "links"
        ? string
        : T[k]
    };

export const readableObject = <T extends object>(obj: T) =>
    Object.entries(obj).reduce((acc, [key, value]) => {
        acc[key as keyof T] = makeReadble(key, value) as Readable<T>[keyof T];
        return acc;
    }, {} as Readable<T>);

export const readableEntries = <T extends object>(obj: T) =>
    Object.entries<T[keyof T]>(readableObject(obj));