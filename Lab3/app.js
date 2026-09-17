export default function (express, bodyParser, createReadStream, crypto, http) {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "x-test,ngrok-skip-browser-warning,Content-Type,Accept,Access-Control-Allow-Headers",
    );
    res.setHeader("X-Author", "polinaoleynik");

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  });

  app.all("/login/", function (req, res) {
    res.send("polinaoleynik");
  });

  app.all("/code/", function (req, res) {
    const filePath = import.meta.url.substring(7);
    createReadStream(filePath).pipe(res);
  });

  app.all("/sha1/:input/", function (req, res) {
    const hash = crypto
      .createHash("sha1")
      .update(req.params.input)
      .digest("hex");
    res.send(hash);
  });

  app.all("/req/", function (req, res) {
    const addr = req.query.addr || (req.body && req.body.addr);
    http.get(addr, function (resp) {
      let data = "";
      resp.on("data", function (chunk) {
        data += chunk;
      });
      resp.on("end", function () {
        res.send(data);
      });
    });
  });

  app.all("*", function (req, res) {
    res.send("polinaoleynik");
  });

  return app;
}
