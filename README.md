# PRG-Group-Map
Organizing the (wonderful) people and (exciting) projects of the Personal Robotics Group

## Start editing!

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/mitmedialab/PRG-Group-Map)

1. **Login to Gitpod:** Click the above button to open [Gitpod](https://www.gitpod.io/), a service we'll use to access a cloud development environment pre-configured for this project.
    1. Unless you already have a gitpod account (and are logged in), you should be prompted with the below screen. Login through github and authorize gitpod when/if prompted.
    - **NOTE:** If you do NOT have a github account, please make one and let [Parker](https://github.com/pmalacho-mit) know. Once he gives you the necessary permissions, you can continue with the below steps. 
2. **Give Gitpod write access:** Gitpod should then open you up a worskpace (cool, right?). Unfortunately, we need to make one permissions change before we can start editing.
    1. Click the 3 horizontal lines ("hamburger" menu) in the top left corner, and select `Gitpod: Stop Workplace`.
    2. Once redirected, click `Go to Dashboard`.
    3. From your gitpod dashboard, (1) click on your user icon, (2) navigate to _Settings_ > _Integrations_, (3) click on the 3 dots ("kebab" menu) beside _Github_, (4) select `Edit Permissions`, (5) enable `public_repo`, and (6) select `Update Permissions`.
        - **NOTE:** If anyone has security concerns about enabling this setting, please discuss with [Parker](https://github.com/pmalacho-mit)
3. **Restart workspace**: Once you can write to public repositories from gitpod (which only needs to be enabled once), we should re-start our workspace. Do so, by 
selecting `Workspaces` in the top left corner, and click to open your workspace (there should be only one if you're a first time gitpod user).
# How to (work in progress, ignore for now):

## Add yourself

1. Create a new typescription file (`.ts` extension) inside of the `people/` directory. For example, `cynthia.ts`.

2. This code file will be responsible for doing one thing, which is calling the `describeYourself` function. This function takes a single paramter, which is an [object](https://www.w3schools.com/js/js_objects.asp) that, well, *describes you*. Check out the below examples:

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
