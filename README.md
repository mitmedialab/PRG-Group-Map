# PRG-Group-Map
Organizing the (wonderful) people and (exciting) projects of the Personal Robotics Group

## Contributing through Gitpod (reccomended)

### Gitpod Configuration

Because we are forcing everyone to write code, we want to make it as easy as possible to get going with this project. To do this, we'll make use of [Gitpod](https://www.gitpod.io/), which provides access to virtual development environments.

1. **Login to Gitpod:** Click the following button to open a [Gitpod](https://www.gitpod.io/) workspace for this project: 
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/mitmedialab/PRG-Group-Map)
    1. Unless you already have a gitpod account (and are logged in), you should be prompted to `Continue with Github`. After clicking `Continue with Github`, login to github (if prompted) and authorize gitpod (if prompted).
    - **NOTE:** If you do NOT have a github account, please make one and let [Parker](https://github.com/pmalacho-mit) know. Once he gives you the necessary permissions, you can continue with the below steps. 
2. **Configure User Preferences**: Once logged in, gitpod will likely ask you about some user preferences. We recommend the following:
    - Select 'VS Code Broswer for your editor
    - Select 'Dark' theme
3. **Give Gitpod write access:** Gitpod should then open you up a worskpace (cool, right?). We just need to make one permissions change to ensure once we start editing code we can preserve our changes through [git](https://git-scm.com/).
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

After navigating back to your workspace tab, you should be ready to start editing! 

But first, there's a few things to notice about your workspace:

#### Terminal

A terminal window (also know as a _command line_) should be visible at the bottom of your screen. 

It should currently be executing a series of commands to setup your development environment and then eventually start a development server to host the Group Map site. 

Once you see `Bundle End` outputted in the terminal, the development server is up and running. 

As you make changes to files, the development server will automatically rebuild the project and refresh the webpage to reflect your changes (~10s). 
   - **NOTE:** Because of how gitpod controls the file system, changes are automatically saved. This can trigger multiple rebuilds when you're editing (since every save triggers a rebuild), which is annoying but does not indicate a problem with your code or workflow. 
 
For the best developer experience, keep this command/terminal running for your entire session. If it exits due to an error or you accidentally close it, you can restart it be running:

```bash
npm run dev # it will take around ~30s to start up again
```

### Where you come in

As a member of PRG, we are asking you to: (1) keep your information in the group map up to date, and (2) keep the information about the projects you work on up to date.  

This requires the following:
- [Adding Yourself to The Graph](#Adding-Yourself-to-the-Graph)
- [Editing your information]()
- [Editing infromation about projects]().
- [Saving you changes]()

#### Adding Yourself to the Graph

If you do not see a file with your name included in the `people/` directory, you'll need to create one. 

(If you do, hop down to [Editing Your Information]())

1. **Open up a new terminal:** You'll need to open a new terminal in the workspace in order to run a a custom [npm script](https://docs.npmjs.com/cli/v8/commands/npm-run-script)
    - There are a couple ways to open a terminal in gitpod, but the most straight forward way is to click on the 'hamburger' menu (3 stacked horizontal lines) on the top left and select _Terminal_ > _New Terminal_
    - **NOTE**: Do NOT interrupt the already running `Dev Server` command unless you know what you're doing!
2. Run the following command, followed by your name (and do **NOT** include spaces): ```npm run new:person``` 
    - For example:
```bash
npm run new:person cynthia
```
3. If successful, the command will point you to a newly created `.ts` file where you can add your details. Jump down to [Editing your information](https://github.com/pmalacho-mit) to see what to add.
    - **NOTE:** you can also close the newly create terminal window.

#### Editing Your Information

Inside of the file named for you, you'll find a call to the `describeYourself(...)` function, which is how youryYour details are fed to the graph (specifically through [javascript object](https://www.w3schools.com/js/js_objects.asp) passed to it as an argument). 

We make use of [Typescript](https://www.typescriptlang.org/) to ensure this object contains all the necessary information, and to also make our lives easier through helpful suggestings and code-completion. 

Check out the [Why Typescript is Great]() section to see why ([Parker](https://github.com/pmalacho-mit) thinks) Typescript is great, and how it can help you provide the necessary details to the `describeYourself(...)` function.

#### Editing a Project

Every group member works on 0 or more projects, specified in the `projects` field of the object passed to the `describeYourself(...)` function (mentioned above). 

For example: 

```ts
describeYourself({
    ...,
    projects: ["Dancing with AI", { name: "Jibo", main: true }], 
    ...,
})
```

The acceptable values for project names are pulled from objects defined elsewhere in the project (which is part of the reason why Typescript is so useful to us). 

Below we outline how you can locate and update these definitions.

##### Locating a project definition

The easiest way to locate a project definition is to highlight it's name and click `⌘ Cmd` + `↑ Shift` + `F` (maybe `Ctrl` + `↑ Shift` + `F` on Windows) to find it's usages in the project. 

Locate the usage within a file inside of the `categories/themes/`. It will be used in one of the manners outlined below:
- [Inline Project Summary -- defined in a single line within object passed to `theme(...)`]()
- [Local Project Details -- defined within an object passed to `theme(...)`]()
- [Exteneral Project Details -- defined within an object passed to `project(...)`]()
- 
##### Inline Project Summary

The minimum information you can provided about a project is simply a summary about it. This will look like following (within the `projects` object passed to the `theme()` function):

```ts
theme({
    ...
    projects: {
        ...,
        "Name of Project": "This is a summary of project"
    }
});
```

##### Local Project Details

If you'd like to say a little bit more about a project, you can specify project details like so:

```ts
theme({
    ...
    projects: {
        ...,
        "Name of Project": {
            summary: "This is a summary of project",
            description: "This is a longer description of the project"
        }
    }
});
```

##### External Project Details

If you have so much to say about a project that it will hurt the readability of the object passed to the `theme()` function, you can opt to define the project in a seperate file, and then [import](https://www.javascripttutorial.net/es-next/javascript-import/) the definition into the theme.

1. Create a new file in `categories/themes/projects`
2. Copy the following boilerplate into it:
```ts
import { project } from "../../../builder";

export default project({
    name: "Name of Project",
    details: {
        summary: "This is a summary of project",
    }
});
```
3. Add the details about your project
4. In the appropriate theme file, import the default export from your newly created file (e.g. `import callItWhateverYouWant from "./projects/newProject";`) and spread the object within `projects` object:

```ts
// Inside of theme file
import callItWhateverYouWant from "./projects/newProject";

theme({
    ...
    projects: {
        ...callItWhateverYouWant,
    }
});
```


> NOTE: The above file creation + boilerpalte will soon be turned into a command.


## Why Typescript Is Great

### Not sure what keys are available in an object? 

Typescript can tell us what keys belong in an object by typing a `"` within it's curly brackets (`{ ... }`). 



Any keys succeeded by a `?` are optional and can be left out. 

### Not sure what values are appropriate?

Hover over a key to see documentation on what values it can take on. Often times they'll be multiple acceptable values, and you can pick which is most convenient to convey the necessary information. 

If you provide a value that typescript doesn't like, it will underline the error in red. Hover over it to see a potentially-helpful error message. If you aren't able to resolve it, please contact [Parker](https://github.com/pmalacho-mit).

## Advanced editing

...Coming soon...

## Advanced Details
Some of the initial commands on startup include: 
    - Checking out a git branch off of `main`, named `gitpod/<email username>/<time stamp>`
    - Setuping bash aliases to enable: (1) closing the gitpod workspace ("Quit"); (2) adding, committing, and pushing all changes, and then closing the gitpod workspace ("SaveAndQuit")
    
2. **Browser Preview**: Once the development server starts up, a simple-browser window will be opened at the top right of your screen displaying the project. 
     - **NOTE**: Due to an issue with live-reloading on gitpod, you might need to refresh the window in order for the map to display initially once the developmet server is up and running. 
3. **File explorer:** All of the files included in the project will be displayed in the panel on the left. 
    - You can open them by either clicking on their name directly, or by selecting `Open File` in the File menu (accessed through the "hamburger" menu in the top left)
