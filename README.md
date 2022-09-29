# PRG-Group-Map
Organizing the (wonderful) people and (exciting) projects of the Personal Robotics Group

# How to:

## Add yourself

1. Create a new typescription file (`.ts` extension) inside of the `people/` directory. For example, `cynthia.ts`.

2. This code file will be responsible for doing one thing, which is calling the `describeYourself` function. This function takes a single paramter, which is an object that, well, describes yourslef. Check out the below example:

```ts
// Inside of ./people/cynthia.ts

import { describeYourself } from "../builder";

describeYourself({
    name: "Cynthia Breazeal",
    email: "cynthiab@media.mit.edu",
    bio: "Mother of robots",
    role: "Principle Investigator",
    projects: ["All of them"],
    skills: ["Also all of them"],
    yearsActive: // I don't know, @parker ask someone!
});
```

3. Use type hints, typescript errors, and code documentation (visible when you hover over a field/') to fill out the function's argument properly. 

## Add a Project

## Add a Theme

## Add a Role

## Add a Skill

## Add a Category that doesn't exist yet
