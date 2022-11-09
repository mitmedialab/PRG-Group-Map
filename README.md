# PRG-Group-Map
Organizing the (wonderful) people and (exciting) projects of the Personal Robotics Group

## Contributing through Gitpod (recommended)

1. [Gitpod Configuration](#contributing-through-gitpod-recommended)
2. [Tour of Gitpod Workspace](#tour-of-workspace)
    1. [Terminal](#tour-of-workspace)
    2. [Site Preview](#browser--website-preview)
    3. [File Explorer / System](#file-explorer)
3. [Where you come in!](#where-you-come-in)
    1. [Adding Yourself to The Graph](#adding-yourself-to-the-graph)
    2. [Editing your information](#editing-your-information)
    3. [Editing information about projects](#editing-a-project).
    4. [Saving your changes](#saving-your-changes)

### Gitpod Configuration

Because we are forcing everyone to write code, we want to make it as easy as possible to get going with this project. To do this, we'll make use of [Gitpod](https://www.gitpod.io/), which provides access to virtual development environments (think code editor directly in your browser pre-configured to work with this project).
1. **Login to Gitpod:** Click the following button to open a [Gitpod](https://www.gitpod.io/) workspace for this project: 
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/mitmedialab/PRG-Group-Map)
    1. Unless you already have a gitpod account (and are logged in), you should be prompted to `Continue with Github`. After clicking `Continue with Github`, login to github (if prompted) and authorize gitpod (if prompted).
    - **NOTE:** If you do NOT have a github account, please make one and let [Parker](https://github.com/pmalacho-mit) know. Once he gives you the necessary permissions, you can continue with the below steps. 
2. **Configure User Preferences**: Once logged in, gitpod will likely ask you about some user preferences. We recommend the following:
    - Select 'VS Code Broswer' for your editor
    - Select 'Dark' theme
3. **Give Gitpod write access:** Gitpod should then open you up a workspace (cool, right?). We just need to make one permissions change to ensure once we start editing code we can preserve our changes through [git](https://git-scm.com/).
    1. Click the green Gitpod button in the very bottom left corner of the screen.
        - <img src="https://user-images.githubusercontent.com/95306112/197118951-94509ee8-3d41-4863-ada8-acc5e30bb577.gif" width="100"/> 
        - **NOTE:** The gitpod workspace might be a little slow to start, so if nothing happens when you click the button, wait a moment and try again.
    2. That will open up a list of gitpod commands. Select `Gitpod: Open Access Control`.
        - <img src="https://user-images.githubusercontent.com/95306112/197118742-320c55a1-bca8-46fd-883e-1929649d0fcf.gif" width="300"/>
    2. In the tab that the previous step opened:
        1. Click on the 3 dots ("kebab" menu) to the right of _Github_ 
        2. Click `Edit Permissions`
        3. Enable `public_repo`
        4. Click `Update Permissions`.
        - **NOTE:** If anyone has security concerns about enabling this setting, please discuss with [Parker](https://github.com/pmalacho-mit)
        - <img src="https://user-images.githubusercontent.com/95306112/197117571-f22296da-9a60-4577-b02f-46399fd19d51.gif" width="400"/>
    - **NOTE:** These 'integrations' permissions also could have been granted as part of the initial user preference setup. 

### Tour of Workspace

After navigating back to your workspace tab, you should be ready to start editing! 

But first, there's a few things to notice about your workspace:

#### Terminal

<img src="https://user-images.githubusercontent.com/95306112/197121861-5af68c32-88c8-458c-b74f-8030685cd25f.gif"/>

A terminal window (also know as a _command line_) should be visible at the bottom of your screen. 

It should currently be executing a series of commands to setup your development environment and then eventually start a [development server](#development-server) to host the Group Map website (which will keep running). 

If you'd like to run any commands, you should open a new terminal by doing the following:

###### Opening a new Terminal

There are a couple ways to open a terminal in gitpod, which you'll likely need to since you should **NOT** interrupt the already running `Dev Server` command (unless you know what you're doing)!
 
One of the most straight forward ways is to click on the "hamburger" menu on the top left and select _Terminal_ > _New Terminal_

You can also use the buttons within the Terminal UI, specifically the <img width="33" alt="Plus terminal button" src="https://user-images.githubusercontent.com/95306112/200714298-32194f05-1692-48e9-9aa1-fcc74fb82a3f.png" /> button

##### Development Server

Once you see `Bundle End` outputted in the terminal, the development server is up and running. 

As you make changes to files, the development server will automatically rebuild the project and refresh the [webpage](#browser--website-preview) to reflect your changes (~10s). 
   - **NOTE:** Because of how gitpod controls the file system, changes are automatically saved (think Google Drive). This can trigger multiple rebuilds when you're editing (since every save triggers a rebuild), which can be annoying but does not indicate a problem with your code or workflow. 
 
For the best developer experience, keep this command/terminal running for your entire session. If it exits due to an error or you accidentally close it, you can restart it be running:

```bash
npm run dev # it will take around ~10-20s to start up again
```

#### Browser / Website Preview

<img src="https://user-images.githubusercontent.com/95306112/197122781-0637cf42-1f99-4376-808b-a03420ede437.gif" />

Once the development server starts up, a simple-browser window will be opened at the top right of your workspace displaying the project. 
     - **NOTE**: Due to an issue with live-reloading on gitpod, you might need to refresh the window in order for the map to display initially once the developmet server starts. 
     
#### File explorer
<img src="https://user-images.githubusercontent.com/95306112/197124024-1fff7779-0059-4614-885c-483b2cd4dddb.gif"/>

All of the files included in the project will be displayed in the panel on the left. 
    - You can open them by either clicking on their name directly, or by selecting `Open File` in the File menu (accessed through the "hamburger" menu in the top left)
    
You will mainly be expected to edit files contained within the `people/` and `projects/` directories, and sometimes the `themes/`, `skills`, and `roles` directories. The files in these directories are responsible for defining (information about) nodes in the group map/graph. 

If you are doing something more advanced and need to edit files outside of those directories, hop down to [Advanced Development]().

### Where You Come In

As a member of PRG, we are asking you to keep your information and the information about the projects you work on up to date.  

This requires the following:
- [Adding Yourself to The Graph](#adding-yourself-to-the-graph)
- [Editing your information](#editing-your-information)
- [Editing infromation about projects](#editing-a-project).
- [Saving your changes](#saving-your-changes)

#### Adding Yourself to the Graph

If you do not see a file with your name included in the `people/` directory, you'll need to create one. 

(If you do see a file with your name/details, hop down to [Editing Your Information](#editing-your-information))

1. [Open up a new terminal](#opening-a-new-terminal)
2. In the new terminal, run the following command followed by your name (and do **NOT** include any spaces): ```npm run new:person``` 
    - For example:
```bash
npm run new:person cynthiaBreazeal 
```
3. If successful, the command will point you to a newly created `.ts` file where you can add your details. Jump down to [Editing your information](#editing-your-information) to see what to add.
    - **NOTE:** you can close the newly created terminal window after executing the `new:person` command.

#### Editing Your Information

Inside of the file named for you, you'll find a call to the `person(...)` function, which is how your details are fed to the graph (specifically through the [javascript object](https://www.w3schools.com/js/js_objects.asp) passed to the function as an argument). 

```ts
export default person({
   ... your details go here ...
})
```

We make use of [Typescript](https://www.typescriptlang.org/) to ensure this object contains all the necessary information, and to also make our lives easier through helpful suggestings and code-completion. 

Check out the [Why Typescript is Great](#why-typescript-is-great) section to see why ([Parker](https://github.com/pmalacho-mit) thinks) Typescript is great, and how it can help you provide the necessary details to the `person(...)` function.

You also might notice the use of `export default`, which at a highlevel is used to share the result of the `person(...)` function with other parts of the codebase. If you're interested, you can read more about both [default and named exports](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export), but you don't really need to worry about them. Just **DO NOT** delete them.

#### Adding / editing projects

The projects a group member works on are specified by the `projects` field of the object passed to the `person(...)` function (mentioned above).

This field will typically look like an [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of Project Names, with occasional extra bits of information (like whether or not a project is someone's _main_ project).

For example: 

```ts
export default person({
    ...,
    projects: ["Dancing with AI", { name: "Jibo", main: true }], 
    ...,
})
```

The acceptable values for project names are pulled from objects defined elsewhere in the project (which is part of the reason why Typescript is so useful to us). 

Below we outline how you can add, locate, and update project definitions. Please do so for the projects you work on, especially those that you are a _main_ contributor on. 

##### Adding a new project

If you do not find a file in the `projects/` directory that corresponds to your project, you'll need to create one. 

**But be careful! We don't want to accidentally duplicate project definitions.**

A great way to see all of the currently defined projects (as well as feel like a _spicy_ typescript developer) is to:
1. Inside any file, import the `ProjectName` type: 
```ts
import { ProjectName } from "projects";
``` 
2. Create a variable of type `ProjectName`: 
```ts
let project: ProjectName;
```
3. Try to set `project` equal to something, and let your code editor tell you what values it can take on (and therefore what projects have been defined:
<img src="https://user-images.githubusercontent.com/95306112/200640773-44f7d50c-a60d-4d0a-917b-037c1534a7a8.gif" />
   
If you do find your project, hop down to [Editing an existing Project](#editing-an-existing-project).

Otherwise, we'll need to add a project, like so:

1. [Open up a new terminal](#opening-a-new-terminal)
2. In the new terminal, run the following command followed by your name (and do **NOT** include any spaces): `npm run new:project`
    - For example:
```bash
npm run new:project myProject 
```
3. If successful, the command will point you to a newly created `.ts` file where you can add your details. Jump down to [Editing an existing Project](#editing-an-existing-project) to see what to add.
    - **NOTE:** you can close the newly created terminal window after executing the `new:project` command.

##### Locating a project definition

The easiest way to locate a project definition is to highlight it's name and click `⌘ Cmd` + `↑ Shift` + `F` (maybe `Ctrl` + `↑ Shift` + `F` on Windows) to find it's usages in the project.

<img src="https://user-images.githubusercontent.com/95306112/197128846-b166f835-e395-47ae-87f7-af52080d27d2.gif"/>

Locate the usage within a file inside of the `projects/` directory. 

##### Editing an existing Project

Inside of a project file, you'll find a structure very similiar to what you saw when [editing information about you (or someone else)](#editing-your-information). 

There should be a function call to `project({...})` where the details of the [object]() passed as an argument to the function describe everything the graph needs to know about your project. 

This includes:
- The name of the project
- Details about it (including its summary, description, timeframe, any relevant links, etc. -- this information is passed inside a _nested object_)
- What themes the project fits under (1 or more). Themes are defined inside of the file `themes/index.ts`

See the below example for an idea of what this looks like: 

```ts
export default project({
    name: "My project"
    details: {
        summary: "Short and sweet"
        description: "Some more info"
        years: [2018, 2020],
        links: [{ text: "home", url: "https://google.com" }],
    },
    themes: "Ethics & Policy"
});
```

Make sure to also check out [how typescript can help you](#why-typescript-is-great) to fill out a projects details correctly. 

#### Saving Your Changes

Often a difficult aspect of software projects is using [git for version control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control).

To make this easier, we've tried to automate the process for you.

(If you are comfortable with git, feel free to `add`, `commit`, and `push` as normal. Just note that you should use the branch that gitpod automatically checked out for you, which starts with `gitpod/<your email>`)

Once you're done making your changes:
1. Cntrl-c in the terminal running the development server process
2. Run one of the following commands:
-**NOTE**: These commands must be ran in the terminal that was executing the development server

##### Automatically push up all changes to remote repository and shutdown gitpod workspace

```bash
SaveAndQuit
```

##### Automatically push up all changes to remote repository

```bash
Save
```

**NOTE**: You should get in the habit of shutting down your workspaces (as your limited to 50hrs / month), but they will also automatically supsend after 30 minutes of inactivity. You can do this easily by running the command (you guessed it!):

```bash
Quit
```

## Why Typescript Is Great

### Not sure what keys are available in an object? 

Typescript can tell us what keys belong in an object by typing a `"` within it's curly brackets (`{ ... }`). 

<img src="https://user-images.githubusercontent.com/95306112/197124987-b1092a4d-3207-44a6-a84f-611416e22caf.gif" width="400"/>

Any keys succeeded by a `?` are optional and can be left out. 

### Not sure what values are appropriate?

Hover over a key to see documentation on what values a field can take on. Often times they'll be multiple acceptable values, and you can pick which is most convenient to convey the necessary information. 

<img src="https://user-images.githubusercontent.com/95306112/197125589-9e699420-b7af-4f39-ad93-e5d64c31d634.gif" />

If you provide a value that typescript doesn't like, it will underline the error in red. Hover over it to see a potentially-helpful error message. If you aren't able to resolve it, please contact [Parker](https://github.com/pmalacho-mit).

## Advanced editing

...Coming soon...
