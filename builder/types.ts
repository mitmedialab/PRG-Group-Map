import { ProjectName, ThemeName } from "../categories/projectsByTheme";
import { RoleName } from "../categories/roles";
import { SkillName } from "../categories/skills";

// Common

export type ValueOf<T> = T[keyof T];

export type PathToAsset = { path: string };

export type VerboseLink = { text: string, url: string };
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
export type NormalizedTimeFrame = readonly [...[number, number][], [number, number | "present"]];

export type VerboseDetails = {
    /**
     * Short (one sentence or less) description of what this thing is
     */
    summary: string,
    /**
     * Lengthier explanation of what this thing is
     */
    description?: string,
    timeFrame?: YearsTimeFrame,
    links?: readonly Link[]
};

export type NormalizedDetails = Replace<Replace<VerboseDetails, "links", VerboseLink[] | undefined>, "timeFrame", NormalizedTimeFrame | undefined>;

export type CategoryDetails = string | VerboseDetails;

export type ProjectDetails = CategoryDetails;

type projects<T> = { [K in keyof T]: ProjectDetails };

export const project = <T extends string>(obj: Name<T> & Details): { [key in T]: ProjectDetails } => {
    return { [obj.name]: obj.details } as { [key in T]: ProjectDetails }
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

export const category = <T>(namesAndDetails: { [K in keyof T]: CategoryDetails }) => namesAndDetails;

type ThemeDescription<T> = { [K in keyof T]: K extends "details" ? CategoryDetails : ProjectDetails };
export const themes = <T>(x: { [K in keyof T]: ThemeDescription<T[K]> }) => x;

type Entries<TKey extends string, TValue = CategoryDetails> = { [projectName in TKey]?: TValue }

// Projects

export type ProjectEntries = Entries<ProjectName>;

// Themes

export type Theme = { details: CategoryDetails } & ProjectEntries;

export type NormalizedTheme = { details: VerboseDetails } & Entries<ProjectName, VerboseDetails>;

export type ThemeEntries = Entries<ThemeName, Theme>;

export type NormalizedThemeEntries = Entries<ThemeName, NormalizedTheme>;

// Skills

export type SkillEntries = Entries<SkillName>;

// Roles

export type VerboseRole = { role: RoleName, year?: number };
type Role = RoleName | VerboseRole;
export type RoleEntries = Entries<RoleName>;

// People

export type GroupMember = {
    name: string,
    email: string,
    bio: string,
    role: Role,
    projects: readonly ProjectName[],
    skills: readonly SkillName[],
    main?: readonly ProjectName[],
    links?: readonly Link[],
    photo?: PathToAsset,

    /**
     * @summary How long you have been a member of the lab
     * @example
     * yearsActive: 2020 // represents 2020-present
     * @example
     * yearsActive: [2018, 2020] // represents 2018-2020
     * @example
     * yearsActive: [ [2000, 2005], [2010, 2020] ] // represents 2000-2005, 2010-2020
     * @example
     * yearsActive: [ [2000, 2005], [2010, 2020], 2022 ] // represents 2000-2005, 2010-2020, 2022-present
     */
    yearsActive?: YearsTimeFrame,
}

export type NormalizedMember = Replace<Replace<GroupMember, "role", VerboseRole>, "yearsActive", NormalizedTimeFrame>

type Identity<T> = { [P in keyof T]: T[P] }
type Replace<T, K extends keyof T, TReplace> = Identity<Pick<T, Exclude<keyof T, K>> & {
    [P in K]: TReplace
}>
type ReplaceAll<T, TReplace> = {
    [P in keyof T]: TReplace
}

export type Data = {
    skills: SkillEntries,
    roles: RoleEntries,
    themes: ThemeEntries,
    members: GroupMember[],
}

export type NormalizedData = {
    skills: Record<SkillName, NormalizedDetails>,
    roles: Record<RoleName, NormalizedDetails>,
    themes: NormalizedThemeEntries,
    members: NormalizedMember[],
}