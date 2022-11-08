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

const serveAndWatch = () => {
  const site = path.resolve(__dirname, "..", 'site');

  createServer().watch(site);

  const port = 8000;
  const app = express();
  app.use(express.static(site));
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });

  // @ts-ignore
  if (watchMethod !== WatchMethod.Chokidar) return;

  chokidar
    .watch(`${path.resolve(__dirname, "..", 'src', '**', '*')}`)
    .on('change', (path) => {
      console.log(`Rebundling after change to: ${path}`);
      bundle(false);
    });
}

// @ts-ignore
bundle(watchMethod === WatchMethod.Rollup).then(serveAndWatch);