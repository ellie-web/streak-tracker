import { createServer } from "http";
import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express, { static as expressStatic } from "express";
import morgan from "morgan";
import * as build from "../build/index.js";

const MODE = process.env.NODE_ENV;

const app = express();

// You need to create the HTTP server from the Express app
const httpServer = createServer(app);


app.use(compression());

// You may want to be more aggressive with this caching
app.use(expressStatic("public", { maxAge: "1h" }));

// Remix fingerprints its assets so we can cache forever
app.use(expressStatic("public/build", { immutable: true, maxAge: "1y" }));

app.use(morgan("tiny"));
app.all(
  "*",
  MODE === "production"
    ? createRequestHandler({ build })
    : (req, res, next) => {
        purgeRequireCache();
        return createRequestHandler({ build, mode: MODE })(req, res, next);
      },
);

const port = process.env.PORT || 3000;

// instead of running listen on the Express app, do it on the HTTP server
httpServer.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

////////////////////////////////////////////////////////////////////////////////
function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  // for (const key in require.cache) {
  //   if (key.startsWith(BUILD_DIR)) {
  //     delete require.cache[key];
  //   }
  // }
}