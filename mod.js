import { Application, render, Router, Status } from "./deps.ts";
import App from "./src/app.jsx";
import NotFount from "./src/404/404.jsx";

const app = new Application();
const router = new Router();

router.get("/", (context) => {
  context.response.type = "html";
  context.response.body = render(App(), {}, { pretty: true });
});

function notFound(context) {
  context.response.status = Status.NotFound;
  context.response.body = render(NotFount(), {}, { pretty: true });
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


await app.listen({ port: 8000 });
