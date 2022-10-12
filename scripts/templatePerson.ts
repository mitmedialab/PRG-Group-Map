import { describeYourself, pathToFileInAssetsFolder } from "../builder";

describeYourself({
    // Required fields (don't leave these blank)
    name: "", // Name of person
    email: "", // Email of person
    //photo: pathToFileInAssetsFolder("parker.png"),
    bio: "", // Short bio of person
    role: "", // Role of person
    projects: [], // Projects person is involved in
    skills: [], // Skills person has

    // Optional fields (remove if not needed)
    links: [
        {
            text: "", // Text to display
            url: "" // URL to link to
        },
    ],
    main: [], // Main project person is involved in
});