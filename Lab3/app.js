export default function (express, bodyParser, createReadStream, crypto, http) {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
    next();
  });

  app.get('/login/', function (req, res) {
    res.send('polinaoleynik');
  });

  app.get('/code/', function (req, res) {
    const filePath = import.meta.url.substring(7);
    createReadStream(filePath).pipe(res);
  });

  app.get('/sha1/:input/', function (req, res) {
    const hash = crypto.createHash('sha1').update(req.params.input).digest('hex');
    res.send(hash);
  });

  function handleReq(req, res) {
    const addr = req.method === 'GET' ? req.query.addr : req.body.addr;
    http.get(addr, function (resp) {
      let data = '';
      resp.on('data', function (chunk) {
        data += chunk;
      });
      resp.on('end', function () {
        res.send(data);
      });
    });
  }

  app.get('/req/', handleReq);
  app.post('/req/', handleReq);

  app.all('*', function (req, res) {
    res.send('polinaoleynik');
  });

  return app;
}
