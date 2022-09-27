import { Project } from "./projects";
import { Role } from "./roles";
import { Skill } from "./skills";

export type Description = string;

export type EmptyDescription = "TBD" & Description;

export type ValueOf<T> = T[keyof T];

export type PathToAsset = { path: string };

export type GroupMember = {
    name: string,
    email: string,
    photo: PathToAsset,
    bio: string,
    role: Role,
    projects: Project[],
    skills: Skill[],
    yearsActive: number | [number, number] | [...[number, number][], number | [number, number]],
}