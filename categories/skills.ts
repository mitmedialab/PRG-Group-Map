import { set } from "../builder";

const skills = {
    "Dev": "",
    "General AI": "",
    "Jibo Skill": "",
    "Verbal & Nonverbal Behavior": "",
    "Vision & Sensors": "",
    "Ethics": "",
    "Policy": "",
    "Teacher Training": "",
    "Assessment": "",
    "Human Study Design": "",
    "Inclusive Education": "",
    "Mixed Method": "",
    "Statistical Analysis": "",
    "Child Study": ""
}

set("skills", skills);

export type SkillName = keyof typeof skills;