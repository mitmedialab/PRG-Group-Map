import { bundle } from "./bundle";

bundle(false).then(() => {
  console.log("Bundle complete. Exiting...");
  process.exit();
});