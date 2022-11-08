import { bundle } from "./bundle";
import * as chokidar from "chokidar";
import path from "path";
import { createServer } from "livereload";
import express from 'express';

const enum WatchMethod {
  Rollup, /** better for data modifying (bundling process should be quicker via caching) */
  Chokidar /** better for site editing (because rollup typescript plugin can lead to issues in watch mode where src changes aren't reflected) */
}

const watchMethod: WatchMethod = WatchMethod.Rollup;

const customLocalServeAndWatch = () => {
  const site = path.resolve(__dirname, "..", 'site');

  createServer().watch(site);

  const port = 8000;
  const app = express();
  app.use(express.static(site));
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });

  chokidar
    .watch(`${path.resolve(__dirname, "..", '{src,site}', '**', '*')}`)
    .on('change', (path) => {
      console.log(`Rebundling after change to: ${path}`);
      bundle(false);
    });
}

const useRollup = watchMethod === WatchMethod.Rollup;

bundle(useRollup).then(() => {
  if (useRollup) return console.log("Inital bundle succeeded");
  customLocalServeAndWatch();
});