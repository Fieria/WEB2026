# Лаба 4

## Цель работы

Разработать веб-приложение на Express с двумя маршрутами: возврат логина в системе Moodle и получение поля `login` из внешнего API `nd.kodaktor.ru` по числовому идентификатору. Приложение должно работать по HTTPS и поддерживать CORS.

## Структура проекта

- `index.js` — вся логика приложения (маршруты, CORS, запрос к внешнему API)
- `package.json` — конфигурация проекта с `"type": "module"`

<!-- Сюда можно вставить скриншот структуры файлов в Replit -->

## Реализованные маршруты

| Маршрут | Описание |
|---|---|
| `/login/` | Возвращает логин в системе Moodle |
| `/id/:n/` | Делает GET-запрос к `https://nd.kodaktor.ru/users/{n}` и возвращает значение поля `login` из ответа |

## Настройка CORS

Middleware добавляет ко всем ответам заголовки:

Access-Control-Allow-Origin: *

Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS

Access-Control-Allow-Headers: x-test,ngrok-skip-browser-warning,Content-Type,Accept,Access-Control-Allow-Headers


Preflight-запросы (`OPTIONS`) обрабатываются отдельно — сервер отвечает `204 No Content`, не доходя до логики маршрутов. Все маршруты реагируют одинаково на любой HTTP-метод через `app.all(...)`.

## Особенность запроса к внешнему API

По условию задания заголовок `Content-Type` в запросе к `nd.kodaktor.ru` должен отсутствовать. Поэтому запрос сделан через встроенный модуль `https`, а не через `fetch` или сторонние библиотеки — они могли бы неявно подставить этот заголовок.

## Деплой

Приложение развёрнуто на Replit.


## Комментарии по коду

**Заголовки CORS и `OPTIONS`**

```javascript
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'x-test,ngrok-skip-browser-warning,Content-Type,Accept,Access-Control-Allow-Headers');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});
```

`app.use(...)` без пути подключает middleware перед любым маршрутом — заголовки добавляются ко **всем** ответам. `OPTIONS`-запрос браузер отправляет автоматически перед "сложным" кросс-доменным запросом (с кастомным заголовком или методом `PUT`/`DELETE`), чтобы проверить разрешения, — сервер должен сразу ответить `204` без выполнения бизнес-логики, что и делает `return`.

**Маршрут `/login/`**

```javascript
app.all('/login/', function (req, res) {
  res.send(MOODLE_LOGIN);
});
```

`app.all(...)` реагирует на любой HTTP-метод одинаково.

**Маршрут `/id/:n/`**

```javascript
app.all('/id/:n/', function (req, res) {
  const options = {
    hostname: 'nd.kodaktor.ru',
    path: '/users/' + req.params.n,
    method: 'GET'
  };

  const externalReq = https.request(options, function (externalRes) {
    let data = '';
    externalRes.on('data', function (chunk) { data += chunk; });
    externalRes.on('end', function () {
      const parsed = JSON.parse(data);
      res.send(parsed.login);
    });
  });

  externalReq.end();
});
```

`:n` — именованный параметр URL, Express кладёт его значение в `req.params.n`. `https.request(options, ...)` формирует запрос к внешнему API без каких-либо дополнительных заголовков (в частности, без `Content-Type`) — это ключевое требование задания. Ответ приходит по частям (`'data'`), склеивается в строку и после полного получения (`'end'`) разбирается как JSON, из которого достаётся именно поле `login`.

`externalReq.end()` — обязателен: без него запрос не отправляется, а просто формируется и "зависает".
