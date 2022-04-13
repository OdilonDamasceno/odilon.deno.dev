/** @jsx h */
import { Application, Router, Status } from "./deps.ts";

const app = new Application();
const router = new Router();

router.get("/", (context) => {
  context.response.type = "text/html;charset=utf-8";
  context.response.body = Deno.readTextFileSync("./src/index.html");
});

function notFound(context) {
  context.response.status = Status.NotFound;
  context.response.body = Deno.readTextFileSync("./src/404.html");
}

// Middleware to get styles
router.get("/favicon.ico", async (context) => {
  if (context.request.url.toString().match(/^.*\.(ico)/)) {
    await context.send({
      root: `${Deno.cwd()}/public`,
      index: `favicon.ico`,
    });
  }
});
router.get("/styles/:css", async (context) => {
  if (context.params.css.match(/^.*\.(css)/)) {
    await context.send({
      root: `${Deno.cwd()}/`,
      index: `${context.params.css}`,
    });
  }
});

// Middleware to get assets
router.get("/public/:file", async (context) => {
  await context.send({
    root: `${Deno.cwd()}`,
    type: "image/jpeg",
    index: `${context.params.file}`,
  });
});

app.use(router.routes());
app.use(notFound);

app.addEventListener(
  "listen",
  () => console.log("Listen at https://localhost:8000"),
);

await app.listen({ port: 8000 });
