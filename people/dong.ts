import { person } from "../builder";

export default person({
    name: "Dong Won Lee",
    email: "",
    bio: "I'm a graduate student at MIT in the Personal Robots Group at the Media Lab. I graduated with a Master's in Machine Learning (MSML) from Carnegie Mellon University in May 2022. I completed my B.S. in Machine Learning at CMU, as well. ",
    role: { name: "Masters Student", year: 1 },
    projects: "Museum Interaction",
    skills: ["General AI", "Verbal & Nonverbal Behavior", "Vision & Sensors"],
    years: 2022,
    links: [{ text: "Dong Won Lee", url: "https://dongwonl.com/" }]
});