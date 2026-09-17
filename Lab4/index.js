import express from "express";
import https from "https";

const app = express();

const MOODLE_LOGIN = "polinaoleynik";

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "x-test,ngrok-skip-browser-warning,Content-Type,Accept,Access-Control-Allow-Headers",
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.all("/login/", function (req, res) {
  res.send(MOODLE_LOGIN);
});

app.all("/id/:n/", function (req, res) {
  const options = {
    hostname: "nd.kodaktor.ru",
    path: "/users/" + req.params.n,
    method: "GET",
  };

  const externalReq = https.request(options, function (externalRes) {
    let data = "";

    externalRes.on("data", function (chunk) {
      data += chunk;
    });

    externalRes.on("end", function () {
      try {
        const parsed = JSON.parse(data);
        res.send(parsed.login);
      } catch (err) {
        res.status(502).send("bad response from nd.kodaktor.ru");
      }
    });
  });

  externalReq.on("error", function () {
    res.status(502).send("request failed");
  });

  externalReq.end();
});

app.listen(process.env.PORT || 3000);
