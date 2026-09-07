import { createServer } from "node:http";

const port = Number.parseInt(process.env.PORT ?? "5000", 10);
const host = process.env.HOST ?? "0.0.0.0";
const LOGIN = "polinaoleynik";

function pad(n) {
  return String(n).padStart(2, "0");
}

function todayDDMMYYYY() {
  const now = new Date();
  return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
}

const server = createServer((request, response) => {
  const url = new URL(
    request.url ?? "/",
    `http://${request.headers.host ?? "localhost"}`,
  );
  const path = url.pathname;

  // (A) /DDMMYY — дата
  const dateMatch = path.match(/^\/\d{6}$/);
  if (dateMatch) {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({
        date: todayDDMMYYYY(),
        login: LOGIN,
      }),
    );
    return;
  }

  // (Б) /api/rv/abc — перевёрнутая строка
  const rvMatch = path.match(/^\/api\/rv\/([a-z]+)$/);
  if (rvMatch) {
    const reversed = rvMatch[1].split("").reverse().join("");
    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(reversed);
    return;
  }

  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});
