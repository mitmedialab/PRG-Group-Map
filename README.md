# PRG-Group-Map
Organizing the (wonderful) people and (exciting) projects of the Personal Robotics Group

## Contributing through Gitpod (reccomended)

### Gitpod Configuration

1. **Login to Gitpod:** Click the following button to open [Gitpod](https://www.gitpod.io/), a service we'll use to access a cloud development environment pre-configured for this project: 
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/mitmedialab/PRG-Group-Map)
    1. Unless you already have a gitpod account (and are logged in), you should be prompted to `Continue with Github`. After clicking `Continue with Github`, login to github (if prompted) and authorize gitpod (if prompted).
    - **NOTE:** If you do NOT have a github account, please make one and let [Parker](https://github.com/pmalacho-mit) know. Once he gives you the necessary permissions, you can continue with the below steps. 
2. **Configure User Preferences**: Once logged in, gitpod will likely ask you about some user preferences. We recommend the following:
    - Select 'VS Code Broswer for your editor
    - Select 'Dark' theme
3. **Give Gitpod write access:** Gitpod should then open you up a worskpace (cool, right?). Unfortunately, we need to make one permissions change to ensure once we start editing we can preserve our changes.
    1. Click the green Gitpod button in the very bottom left corner of the screen, which will open up a list of gitpod commands. Select `Gitpod: Open Access Control`.
        - **NOTE:** The gitpod workspace might be a little slow to start, so if nothing happens when you click the button, wait a moment and try again.
    3. In the tab that the previous step opened:
        1. Click on the 3 dots ("kebab" menu) to the right of _Github_ 
        2. Click `Edit Permissions`
        3. Enable `public_repo`
        4. Click `Update Permissions`.
        - **NOTE:** If anyone has security concerns about enabling this setting, please discuss with [Parker](https://github.com/pmalacho-mit)
    - **NOTE:** This also could have been completed as part of the initial user preference setup. 

### Tour of Workspace

1. After navigating back to your workspace tab, you should be ready to start editing! There's a few things to notice about your workspace:
    1. **Terminal**: A terminal window should be visible at the bottom of your screen. It is currently executing a series of commands to setup your development environment and then eventually start a development server to host the Group Map site (). 
        1. **ADVANCED**: Some of initial commands include: 
            - Checking out a git branch off of `main`, named `gitpod/<email username>/<time stamp>`
            - Setuping bash aliases to enable: (1) closing the gitpod workspace ("Quit"); (2) adding, committing, and pushing all changes, and then closing the gitpod workspace ("SaveAndQuit")
    2. **Browser Preview**: Once the development server starts up, a browser window will be opened at the top right of your screen displaying the project. 
        - **NOTE**: Due to an issue with live-reloading on gitpod, you might need to refresh the window a couple times in order for the map to display initially. 
    4. **File explorer:** All of the files included in the project will be displayed in the panel on the left. 

### Editing the Project

As a member of PRG, we are tasking you to: (1) keep your information in the group map up to date, and (2) keep the information about the projects you work on up to date.  

This requires the following, [Adding yourself to the graph](), [Editing your information](), and [Editing infromation about projects]().

#### Adding Yourself to the Graph

If you did not see a file with your name included in the `people/` directory, you'll need to create one.

1. **Open up a new terminal:** We'll need to open a new terminal in the workspace in order to run an npm script 
    - There are a couple ways to open a terminal in gitpod, but the most straight forward way is to click on the 'hamburger' menu (3 stacked horizontal lines) on the top left and select _Terminal_ > _New Terminal_
    - **NOTE**: Do NOT interrupt the already running `Dev Server` command unless you know what you're doing!
2. Run the following command, followed by your name (and do **NOT** include spaces): ```npm run new:person``` (for example ```npm run new:person cynthia```)
3. If successful, the command will point you to a newly create `.ts` file where you can add you details. Jump down to [Editing your information]() to see what to add.

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
