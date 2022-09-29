import { ProjectName, ThemeName } from "../categories/projectsByTheme";
import { RoleName } from "../categories/roles";
import { SkillName } from "../categories/skills";

// Common

export type ValueOf<T> = T[keyof T];

export type PathToAsset = { path: string };

export type Link = string | { text: string, url: string };

export type VerboseDescription = {
    /**
     * Short (one sentence or less) description of what this thing is
     */
    summary: string,
    /**
     * Lengthier explanation of what this thing is
     */
    description?: string,
    timeFrame?: YearsTimeFrame,
    links?: Link[]
};

export type CategoryDescription = string | VerboseDescription;

type Entries<TKey extends string, TValue = CategoryDescription> = { [projectName in TKey]?: TValue }

/**
 * @summary How long you have been a member of the lab
 * @example
 * 2020 // represents 2020-present
 * @example
 * [2018, 2020] // represents 2018-2020
 * @example
 * [ [2000, 2005], [2010, 2020] ] // represents 2000-2005, 2010-2020
 * @example
 * [ [2000, 2005], [2010, 2020], 2022 ] // represents 2000-2005, 2010-2020, 2022-present
 */
export type YearsTimeFrame = number | [number, number] | [...[number, number][], number | [number, number]];

// Projects

export type ProjectEntries = Entries<ProjectName>;

// Themes

export type Theme = CategoryDescription & ProjectEntries;

export type ThemeEntries = Entries<ThemeName, Theme>;

// Skills

export type SkillEntries = Entries<SkillName>;

// Roles

export type RoleEntries = Entries<RoleName>;

// People

export type GroupMember = {
    name: string,
    email: string,
    bio: string,
    role: RoleName | { role: RoleName, year: number },
    projects: ProjectName[],
    skills: SkillName[],

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

export type Data = {
    skills: SkillEntries,
    roles: RoleEntries,
    themes: ThemeEntries,
    members: GroupMember[],
}