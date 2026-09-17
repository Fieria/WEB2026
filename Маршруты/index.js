import express from 'express';

const app = express();

const MOODLE_LOGIN = 'polinaoleynik';

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'x-test,ngrok-skip-browser-warning,Content-Type,Accept,Access-Control-Allow-Headers');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

function getTodayDDMMYY() {
  const moscowOffsetMs = 3 * 60 * 60 * 1000;
  const now = new Date(Date.now() + moscowOffsetMs);

  const day = String(now.getUTCDate()).padStart(2, '0');
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const year = String(now.getUTCFullYear()).slice(-2);

  return day + month + year;
}

app.all('/:code/', function (req, res, next) {
  if (/^\d{6}$/.test(req.params.code) && req.params.code === getTodayDDMMYY()) {
    return res.send(MOODLE_LOGIN);
  }
  next();
});

app.all('/add/:x1/:x2/', function (req, res) {
  const x1 = Number(req.params.x1);
  const x2 = Number(req.params.x2);
  res.send(String(x1 + x2));
});

app.all('/mpy/:y1/:y2/', function (req, res) {
  const y1 = Number(req.params.y1);
  const y2 = Number(req.params.y2);
  res.send(String(y1 * y2));
});

app.listen(process.env.PORT || 3000);
