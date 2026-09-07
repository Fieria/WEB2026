import { createServer } from "node:http";

const port = Number.parseInt(process.env.PORT ?? "5000", 10);
const host = process.env.HOST ?? "0.0.0.0";

function setCorsHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS",
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "x-test,ngrok-skip-browser-warning,Content-Type,Accept,Access-Control-Allow-Headers",
  );
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let data = "";
    request.on("data", (chunk) => {
      data += chunk;
    });
    request.on("end", () => resolve(data));
    request.on("error", reject);
  });
}

const server = createServer(async (request, response) => {
  setCorsHeaders(response);

  const url = new URL(
    request.url ?? "/",
    `http://${request.headers.host ?? "localhost"}`,
  );

  if (url.pathname === "/result4/") {
    const body = await readBody(request);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({
        message: "polinaoleynik",
        "x-result": request.headers["x-test"] ?? "",
        "x-body": body,
      }),
    );
    return;
  }

  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});
