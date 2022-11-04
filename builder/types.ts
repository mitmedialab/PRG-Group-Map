import { ProjectName } from "../projects";
import { RoleName } from "../roles";
import { SkillName } from "../skills";
import { ThemeName } from "../themes";

export const isString = <T>(x: T) => typeof x === 'string' || x instanceof String;

// Common

export type ValueOf<T> = T[keyof T];

export type PathToAsset = { path: string };

export type VerboseLink = {
    /**
     * @summary Display text of link
     */
    text: string,
    /**
     * @summary Endpoint / URL of link
     */
    url: string
};

export type Link = string | VerboseLink;

type BeginningEnd = readonly [number, number];

/**
 * @summary Type designation a range of years
 * @example
 * 2020 // represents 2020-present
 * @example
 * [2018, 2020] // represents 2018-2020
 * @example
 * [ [2000, 2005], [2010, 2020] ] // represents 2000-2005, 2010-2020
 * @example
 * [ [2000, 2005], [2010, 2020], 2022 ] // represents 2000-2005, 2010-2020, 2022-present
 */
export type YearsTimeFrame = number
    | readonly [number, number]
    | readonly [
        ... readonly BeginningEnd[], number | BeginningEnd
    ];

/**
 * @example 
 * [[2018, 2020]]
 * @example
 * [[2018, 2020], [2022, "present"]]
 * @example
 * [[2018, 2020], [2021, 2022]]
 */
export type NormalizedTimeFrame = readonly [...BeginningEnd[], readonly [number, number | "present"]];

export type VerboseDetails = {
    /**
     * @summary Short (one sentence or less) description of what this thing is
     */
    summary: string,
    /**
     * @summary Lengthier explanation of what this thing is
     */
    description?: string,
    /**
     * @summary How long this thing has been relevant for (i.e. how long it's been actively worked on)
     * @example
     * timeFrame: 2020 // represents 2020-present
     * @example
     * timeFrame: [2018, 2020] // represents 2018-2020
     * @example
     * timeFrame: [ [2000, 2005], [2010, 2020] ] // represents 2000-2005, 2010-2020
     * @example
     * timeFrame: [ [2000, 2005], [2010, 2020], 2022 ] // represents 2000-2005, 2010-2020, 2022-present
     */
    years?: YearsTimeFrame,
    /**
     * @summary Any relevant links associated with this thing
     * @example 
     * // single link that will display the link with it's full URL
     * links: ["https://www.google.com/"] 
     * @example
     * // single link that will display the link with some special text
     * links: [ { text: "Click me!", url: "https://www.google.com/"} ]
     * @example
     * // multiple links
     * links: [ "https://www.mit.edu/", { text: "Click me!", url: "https://www.google.com/"}]
     */
    links?: readonly Link[]
};

export type NormalizedDetails = Replace<Replace<VerboseDetails, "links", VerboseLink[], true>, "years", NormalizedTimeFrame, true>;

export type CategoryDetails = string | VerboseDetails;

type Themes = { themes: Collection<ThemeName> };

export type ProjectDetails = CategoryDetails & Themes;

type projects<T> = { [K in keyof T]: ProjectDetails };

export const project = <T extends string>(obj: Name<T> & Details & Themes): { [key in T]: ProjectDetails } => {
    return {
        [obj.name]: isString(obj.details)
            ? { summary: obj.details, themes: obj.themes }
            : { ...(obj.details as object), themes: obj.themes }
    } as { [key in T]: ProjectDetails }
};

type Name<T> = { readonly name: T };
type Details = { readonly details: CategoryDetails };
type Projects<T> = { readonly projects: { [K in keyof T]: CategoryDetails } };

/**
 * 
 * @param themeName Display name of theme
 * @param details Display details of theme
 * @param projects Projects included under theme
 * @returns An object with only a single key value pair. The key will be the name of the theme, and the value will be an object with the following key value pairs: 
 * - `details` key with a value that describes the details of the theme 
 * -  The remainder of key value pairs describe the projects tied to this theme, where the key is the name of the project and the value is the details that describe it.
 * NOTE: This funny structure ensures we can (somewhat) easily extract project names directly from the theme objects later on.
 */
export const theme = <T extends string, P extends projects<P>>(obj: Name<T> & Details & Projects<P>): { [key in T]: P & Details } => {
    return {
        [obj.name]: {
            details: obj.details,
            ...obj.projects
        }
    } as { [key in T]: P & Details };
};

export const namesAndDetails = <T>(namesAndDetails: { [K in keyof T]: CategoryDetails }) => namesAndDetails;

type ThemeDescription<T> = { [K in keyof T]: K extends "details" ? CategoryDetails : ProjectDetails };
export const themes = <T>(x: { [K in keyof T]: ThemeDescription<T[K]> }) => x;

type Entries<TKey extends string, TValue = CategoryDetails> = { [projectName in TKey]?: TValue }

// Projects

export type ProjectEntries = Entries<ProjectName, ProjectDetails>;

// Themes

export type Theme = { details: CategoryDetails } & ProjectEntries;

export type ThemeEntries = Entries<ThemeName>;

// Skills

export type SkillEntries = Entries<SkillName>;

// Roles

export type VerboseRole = {
    /**
     * @summary Role name
     */
    name: RoleName,
    /**
     * @summary The year tied to your role, especially for students
     * @example
     * year: 2 // represents you're a 2nd year (maybe master's or PhD student.?)
     */
    year?: number
};
export type Role = RoleName | VerboseRole;
export type RoleEntries = Entries<RoleName>;

// People

export type Connection<TName> = {
    /**
     * @summary Project name
     */
    name: TName,
    /**
     * @summary Is this your main project? 
     * @description NOTE: You CAN specify more than one project as a 'main' project
     */
    main?: boolean,
    /**
     * @summary How strong is your association to this project?
     * @description Measured on a scale of 1-100, this will control how your connection this project is displayed.
     */
    weight?: number
}

export type Collection<TName> = TName | Connection<TName> | readonly (TName | Connection<TName>)[];

export type GroupMember = {
    /**
     * @summary Your full (preferred) name
     */
    name: string,

    /**
     * @summary The best email to reach you at
     * @example
     * email: "cool.dude123@gmail.com"
     */
    email: string,

    /**
     * @summary A short description about you and your work
     */
    bio: string,

    /**
     * @summary Your role in the lab
     * @example
     * // Specifying role and year (likely best option for students)
     * role: { name: "PhD Student", year: 2 } // represents 2nd Year PhD Student
     * @example
     * // Specifying only role name
     * role: "Director"
     */
    role: Role,

    /**
     * @summary What projects you work on
     * @example
     * // Single project that will be assumed to be your "main" project
     * projects: "Jibo"
     * @example
     * // Single project specified to not your be your "main" project
     * projects: { project: "Jibo", main: false }
     * @example 
     * // Multiple projects, with one specified as main
     * projects: [ "Day of AI", { project: "Jibo", main: true }, "DAILy" ]
     * @example
     * // Making use of the optional 'weight' parameter to control how your connection to a project is visualized.
     * // (use a value between 0 - 100)
     * projects: [ { "Day of AI", weight: 20 }, { project: "Jibo", main: true, weight: 90 }]
     */
    projects: Collection<ProjectName>,

    /**
     * @summary What are you good at?
     * @example
     * // specifying a collection of skills
     * skills: ["Dev", "Jibo Skill" ]
     */
    skills: readonly SkillName[],

    /**
     * @summary Relevant links about you and your work
     * @example
     * // single link that will display the link with it's full URL
     * links: ["https://www.google.com/"] 
     * @example
     * // single link that will display the link with some special text
     * links: [ { text: "Click me!", url: "https://www.google.com/"} ]
     * @example
     * // multiple links
     * links: [ "https://www.mit.edu/", { text: "Click me!", url: "https://www.google.com/"}]
     */
    links?: readonly Link[],

    /**
     * @summary Not yet supported.
     * Should allow for both a path to a file inside of 'assets/' as well as maybe a URL 
     */
    photo?: PathToAsset,

    /**
     * @summary How long you have been a member of the lab
     * @example
     * years: 2020 // represents 2020-present
     * @example
     * years: [2018, 2020] // represents 2018-2020
     * @example
     * years: [ [2000, 2005], [2010, 2020] ] // represents 2000-2005, 2010-2020
     * @example
     * years: [ [2000, 2005], [2010, 2020], 2022 ] // represents 2000-2005, 2010-2020, 2022-present
     */
    years?: YearsTimeFrame,
}

export type NormalizedCollection<TName> = readonly Required<Connection<TName>>[];

export type NormalizedMember =
    Replace<
        Replace<
            Replace<
                Replace<GroupMember,
                    "role", VerboseRole>,
                "years", NormalizedTimeFrame>,
            "projects", NormalizedCollection<ProjectName>>,
        "links", readonly VerboseLink[], true>;

type Identity<T> = { [P in keyof T]: T[P] }

type Replace<T, K extends keyof T, TReplace, optional extends boolean = false> = Identity<
    Pick<T, Exclude<keyof T, K>>
    & (optional extends false ? { [P in K]: TReplace } : { [P in K]?: TReplace })
>;

type ReplaceAll<T, TReplace> = {
    [P in keyof T]: TReplace
}

export type Data = {
    skills: SkillEntries,
    roles: RoleEntries,
    themes: ThemeEntries,
    people: GroupMember[],
    projects: ProjectEntries,
}

export type NormalizedData = {
    skills: Record<SkillName, NormalizedDetails>,
    roles: Record<RoleName, NormalizedDetails>,
    themes: Record<ThemeName, NormalizedDetails>,
    people: NormalizedMember[],
    projects: Record<ProjectName, NormalizedDetails & { themes: NormalizedCollection<ThemeName> }>,
}

type UnionToIntersection<U> = (
    U extends never ? never : (arg: U) => never
) extends (arg: infer I) => void
    ? I
    : never;

export type UnionToTuple<T> = UnionToIntersection<
    T extends never ? never : (t: T) => T
> extends (_: never) => infer W
    ? [...UnionToTuple<Exclude<T, W>>, W]
    : [];