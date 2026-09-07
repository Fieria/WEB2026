# ЛАБА 1

## Задание 1
<img width="1745" height="315" alt="image" src="https://github.com/user-attachments/assets/7d491d5d-2ccd-4b1e-a88b-ea4afdfde065" />

`url`: https://d5dtovk2o8j7na734bpe.g4vq2kuy.apigw.yandexcloud.net

создание шлюза 

<img width="1181" height="488" alt="image" src="https://github.com/user-attachments/assets/e0237980-22d8-4c85-bb69-678eeb4bed20" />


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

<img width="1761" height="392" alt="image" src="https://github.com/user-attachments/assets/211c23b9-7ede-4a86-9a33-aba086356fa5" />

`url`: https://d5dtovk2o8j7na734bpe.g4vq2kuy.apigw.yandexcloud.net

обновляем спецификацию шлюза, добавляем следующие пути:

<img width="981" height="606" alt="image" src="https://github.com/user-attachments/assets/86990cd4-ea93-4ef8-ba51-80c737afe7e9" />

проверка

<img width="1208" height="544" alt="image" src="https://github.com/user-attachments/assets/a1d4907e-a312-4c9a-84c4-56fb6839d5a5" />

<img width="1183" height="566" alt="image" src="https://github.com/user-attachments/assets/e54ef155-cd56-4443-9d44-e42a0e56acd0" />


## Задание 3

<img width="1799" height="739" alt="image" src="https://github.com/user-attachments/assets/df118f41-ac22-4999-8696-15e99ffc410c" />

`url`: https://d5dtovk2o8j7na734bpe.g4vq2kuy.apigw.yandexcloud.net

обновляем спецификацию шлюза, добавляем пути `/promise/` и `/fetch/` :

<img width="1295" height="502" alt="image" src="https://github.com/user-attachments/assets/d920fddf-85e4-4457-afb7-74ecbf2ad9e0" />


<img width="1251" height="603" alt="image" src="https://github.com/user-attachments/assets/ad2651c1-2035-491d-9f65-d646578d3321" />
<img width="1238" height="169" alt="image" src="https://github.com/user-attachments/assets/c77d78aa-1082-4660-8813-09808ceb599a" />

проверка

<img width="1236" height="52" alt="image" src="https://github.com/user-attachments/assets/b278b049-6a92-4e76-908f-1345218c2006" />
<img width="1339" height="249" alt="image" src="https://github.com/user-attachments/assets/2b705335-1f99-46bb-b3e2-9a7635fe270f" />


