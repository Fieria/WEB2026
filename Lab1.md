# ЛАБА 1

## Задание 1
<img width="1745" height="315" alt="image" src="https://github.com/user-attachments/assets/7d491d5d-2ccd-4b1e-a88b-ea4afdfde065" />

создание шлюза 

<img width="1181" height="488" alt="image" src="https://github.com/user-attachments/assets/e0237980-22d8-4c85-bb69-678eeb4bed20" />

`url`: https://d5dtovk2o8j7na734bpe.g4vq2kuy.apigw.yandexcloud.net

* `servers.url` — задаёт адрес шлюза (`https://d5dtovk2o8j7na734bpe.apigw.yandexcloud.net`), через который ресурс доступен по HTTPS
* `paths: /` → `get` — описывает обработку GET-запроса к корневому маршруту
* `x-yc-apigateway-integration` с `type: dummy` — это специальное расширение Yandex Cloud, которое говорит шлюзу не проксировать запрос никуда, а сразу вернуть статический ответ:
   * `content: '*': polinaoleynik` — тело ответа для любого типа запроса (`*`) — строка `polinaoleynik`
   * `http_code: 200` — код ответа
   * `http_headers` — кастомные заголовки:
      * `Content-Type: text/plain` — ответ отдаётся как обычный текст
      * `Access-Control-Allow-Origin: '*'` — разрешает CORS-запросы с любого источника
      * `X-Author: polinaoleynik` —  кастомный заголовокм

проверка

<img width="1049" height="602" alt="image" src="https://github.com/user-attachments/assets/6e241cf9-db9a-428c-a1c3-96a8da8c1364" />


## Задание 2


## Задание 3
