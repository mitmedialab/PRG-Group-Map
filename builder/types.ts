import { ProjectName, ThemeName } from "../categories/projects";
import { RoleName } from "../categories/roles";
import { SkillName } from "../categories/skills";

// Common

export type ValueOf<T> = T[keyof T];

export type PathToAsset = { path: string };

export type Link = string | { text: string, url: string };

export type VerboseDescription = { description: string, links?: Link[] };

export type CategoryDescription = string | VerboseDescription;

type Entries<TKey extends string, TValue = CategoryDescription> = { [projectName in TKey]?: TValue }

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
    role: RoleName,
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
    yearsActive?: number | [number, number] | [...[number, number][], number | [number, number]],
}

export type Data = {
    skills: SkillEntries,
    roles: RoleEntries,
    themes: ThemeEntries,
    members: GroupMember[],
}