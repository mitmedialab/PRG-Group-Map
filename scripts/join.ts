import { fork } from "child_process";
import { join } from "path";
import { joinFragments } from "../builder";
import { processCommandLineArgs } from "./CLI";

const { fragment1, fragment2 } = processCommandLineArgs("npm run build --", {
    fragment1: {
        alias: 'a',
        description: 'watch for file changes',
        type: String,
    },
    fragment2: {
        alias: 'b',
        description: 'watch for file changes',
        type: String,
    }
});

if (fragment1 && fragment2) {
    joinFragments(fragment1, fragment2);
};
