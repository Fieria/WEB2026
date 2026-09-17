# Лаба 3. Веб-приложение на ExpressJS

## Цель работы

Разработать веб-приложение на фреймворке Express, соответствующее требованиям задания: работа по HTTPS, поддержка CORS, политика Trailing Slashes, набор маршрутов с определённой логикой, публичный деплой.

## Структура проекта

Приложение состоит из трёх файлов в одной папке репозитория:

- `app.js` — экспортирует функцию инициализации Express-приложения (без импортов, без обращений к файловой системе напрямую — все зависимости передаются аргументами)
- `index.js` — импортирует внешние модули (`express`, `body-parser`, `fs`, `crypto`, `http`), вызывает функцию из `app.js` и запускает прослушивание порта
- `package.json` — конфигурация проекта с `"type": "module"` для поддержки ESM


## Реализованные маршруты

| Маршрут | Метод(ы) | Описание |
|---|---|---|
| `/login/` | все | Возвращает логин в системе OpenEDU (`polinaoleynik`) |
| `/code/` | все | Возвращает исходный код `app.js` через `createReadStream` |
| `/sha1/:input/` | все | Возвращает SHA1-хэш от строки-параметра |
| `/req/` | все | Делает запрос по адресу из `?addr=` (query) или из тела запроса и возвращает содержимое |
| `*` (catch-all) | все | Возвращает логин (`polinaoleynik`) на любой другой запрос |

Каждый маршрут отвечает одинаково независимо от HTTP-метода (`GET`, `POST`, `PUT`, `DELETE`) — для этого использовался `app.all(...)` вместо `app.get(...)`.

## Настройка CORS

Для всех ответов приложения настроена отдача следующих заголовков через middleware:

Access-Control-Allow-Origin: *

Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS

Access-Control-Allow-Headers: x-test,ngrok-skip-browser-warning,Content-Type,Accept,Access-Control-Allow-Headers

X-Author: polinaoleynik


Отдельно обработаны preflight-запросы (`OPTIONS`) — сервер сразу отвечает статусом `204 No Content` с нужными заголовками, не выполняя бизнес-логику маршрута. Это необходимо для корректной работы CORS с кастомными заголовками и методами вроде `PUT`/`DELETE`.


## Политика Trailing Slashes

Все маршруты объявлены с завершающим слэшем (`/login/`, `/code/` и т.д.), что соответствует требованию задания об обязательном слэше в конце URI.


## Пояснения к коду

### `app.js`

**Экспорт функции инициализации**

```javascript
export default function (express, bodyParser, createReadStream, crypto, http) {
```

Файл не делает собственных импортов — все нужные модули (`express`, `bodyParser`, `createReadStream`, `crypto`, `http`) передаются как аргументы функции снаружи, из `index.js`. Это требование задания: `app.js` не должен сам обращаться к внешним модулям или файловой системе напрямую.

**CORS-middleware**

```javascript
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'x-test,ngrok-skip-browser-warning,Content-Type,Accept,Access-Control-Allow-Headers');
  res.setHeader('X-Author', 'polinaoleynik');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});
```

`app.use(...)` без указания пути подключает middleware **до любого маршрута** — то есть эти заголовки добавляются к абсолютно каждому ответу приложения, независимо от того, какой маршрут вызван.

Отдельно обрабатывается метод `OPTIONS`: перед "сложными" кросс-доменными запросами (с кастомными заголовками вроде `x-test` или методами `PUT`/`DELETE`) браузер сам отправляет предварительный `OPTIONS`-запрос, чтобы проверить, разрешён ли основной запрос. Сервер должен ответить на него быстро и без выполнения бизнес-логики — поэтому здесь стоит `return res.sendStatus(204)`, который сразу завершает обработку запроса кодом "успешно, но без содержимого", не доходя до `next()` и, соответственно, до самих маршрутов.

**Маршрут `/login/`**

```javascript
app.all('/login/', function (req, res) {
  res.send('polinaoleynik');
});
```

`app.all(...)` (в отличие от `app.get(...)`) реагирует на **любой** HTTP-метод — `GET`, `POST`, `PUT`, `DELETE` и так далее — одинаковым образом. Это нужно для того, чтобы маршрут отвечал одинаково независимо от способа обращения к нему.

**Маршрут `/code/`**

```javascript
app.all('/code/', function (req, res) {
  const filePath = import.meta.url.substring(7);
  createReadStream(filePath).pipe(res);
});
```

`import.meta.url` содержит полный путь к текущему файлу в формате `file:///путь/до/app.js`. Через `.substring(7)` отрезаются первые 7 символов (`file://`), чтобы получить обычный путь файловой системы. `createReadStream` открывает файл как поток на чтение, а `.pipe(res)` направляет этот поток прямо в ответ — то есть содержимое файла передаётся клиенту без промежуточной загрузки целиком в память.

**Маршрут `/sha1/:input/`**

```javascript
app.all('/sha1/:input/', function (req, res) {
  const hash = crypto.createHash('sha1').update(req.params.input).digest('hex');
  res.send(hash);
});
```

`:input` в пути маршрута — это именованный параметр URL: Express сам достаёт значение из адреса и кладёт его в `req.params.input`. Дальше строится SHA1-хэш: `createHash('sha1')` создаёт объект хеширования, `.update(...)` передаёт в него строку, `.digest('hex')` возвращает результат в виде шестнадцатеричной строки.

**Маршрут `/req/`**

```javascript
app.all('/req/', function (req, res) {
  const addr = req.query.addr || (req.body && req.body.addr);
  http.get(addr, function (resp) {
    let data = '';
    resp.on('data', function (chunk) {
      data += chunk;
    });
    resp.on('end', function () {
      res.send(data);
    });
  });
});
```

Адрес для запроса берётся из `req.query.addr` (значение параметра `?addr=...` в URL) либо, если там пусто, из `req.body.addr` (значение поля `addr` в теле запроса — актуально для `POST`). Дальше `http.get(...)` открывает соединение с этим адресом и получает ответ **по частям (чанкам)**: событие `'data'` срабатывает каждый раз, когда приходит новый кусок данных, и он добавляется к переменной `data`. Когда сервер полностью закончил передачу — срабатывает событие `'end'`, и накопленный результат отправляется клиенту.

**Маршрут-заглушка**

```javascript
app.all('*', function (req, res) {
  res.send('polinaoleynik');
});
```

`'*'` — это шаблон, который совпадает с любым путём, не пойманным предыдущими маршрутами. Поскольку Express проверяет маршруты по порядку их объявления, этот маршрут стоит последним и работает как "маршрут отлова остальных запросов" из задания.

### `index.js`

```javascript
import express from 'express';
import bodyParser from 'body-parser';
import { createReadStream } from 'fs';
import crypto from 'crypto';
import http from 'http';
import appSrc from './app.js';

const app = appSrc(express, bodyParser, createReadStream, crypto, http);

app.listen(process.env.PORT);
```

Здесь, в отличие от `app.js`, происходят все настоящие импорты внешних модулей. Затем импортированная из `app.js` функция вызывается с этими модулями как аргументами — так реализуется передача зависимостей "снаружи", без прямых импортов внутри самого `app.js`. `process.env.PORT` — переменная окружения, которую платформа хостинга (Replit, Render и т.д.) подставляет автоматически, поэтому порт не нужно задавать вручную.







## Деплой

**Платформа:** Replit

**Настройки:**
- Environment Variables: не требуются (порт передаётся автоматически через `process.env.PORT`)


## Возникшие сложности

При первой проверке возникала ошибка `TypeError: Failed to fetch` — сервер не отвечал корректно на preflight-запросы (`OPTIONS`) и не отдавал заголовок `Access-Control-Allow-Headers`, из-за чего браузер блокировал кросс-доменные запросы с кастомными заголовками (`x-test`). Проблема решена добавлением явной обработки `OPTIONS` (ответ `204 No Content`) и добавлением заголовка `Access-Control-Allow-Headers` в middleware.



