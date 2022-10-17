import { category, set } from "../builder";

const skills = category({
    "Dev": "",
    "General AI": "",
    "Jibo Skill": "",
    "Verbal & Nonverbal Behavior": "",
    "Vision & Sensors": "",
    "Ethics": "",
    "Policy": "",
    "Co-Design": "",
    "Teacher Training": "",
    "Assessment": "",
    "Human Study Design": "",
    "Inclusive Education": "",
    "Mixed Method": "",
    "Statistical Analysis": "",
    "Qualitative Analysis": "",
    "Methodology Design": "",
    "Child Study": "",
    "Reinforcement Learning": "",
    "Art": "",
    "Robot Engineering": "",
    "Scratch Master": "",
    "Child-Robot Interaction": "",
    "Human-Computer Interaction": "",
    "Teacher Education": "",
    "STEM Education": "",
    "Project Management": "",
    "NLP":"",
    "Curriculum Design": "", 
    "User Experience": "", 
});

set("skills", skills);

export type SkillName = keyof typeof skills;