# Лаба 2

## Задание 4

<img width="1757" height="681" alt="image" src="https://github.com/user-attachments/assets/de61b736-1355-4fe8-b94d-196e5683a773" />

`url` : https://fuchsia-pesky-sandbox--polinaoleynik.replit.app


Я делала задание на Replit. Для начала я попросила агента создать шаблон Node.js, потом поменяла код server.js (см фото ниже). Полный скрипт в файле task4_server.js
<img width="1916" height="1035" alt="image" src="https://github.com/user-attachments/assets/f0357ebe-e3cd-4369-bbda-8b819f33cd4a" />

* Сервер написан на встроенном модуле Node.js `node:http`, без сторонних библиотек (Express не используется).
* Функция `setCorsHeaders` вызывается для каждого входящего запроса до какой-либо другой обработки и выставляет три обязательных заголовка: `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods` (все нужные методы) и `Access-Control-Allow-Headers` (включая `x-test`). Так CORS-доступ разрешается для абсолютно любого запроса к серверу.
* Функция `readBody` вручную считывает тело запроса по частям (`request.on('data', ...)`) и собирает его в единую строку — это нужно, поскольку без Express Node сам по себе не парсит тело запроса.
* Обработчик сервера проверяет только путь запроса (`url.pathname === "/result4/"`), но не метод — поэтому GET, POST, PUT, DELETE и OPTIONS обрабатываются полностью одинаково, как того требует задание.
* На маршруте `/result4/` сервер формирует JSON-ответ с тремя полями: `message` (фиксированное значение `polinaoleynik`), `x-result` (значение заголовка `x-test` из запроса) и `x-body` (текст тела запроса), и отдаёт его с заголовком `Content-Type: application/json`.
* Любой другой путь возвращает `404` с JSON-сообщением об ошибке.


## Задание 5
