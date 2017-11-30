# Блог

## Задание

Создать простой блог в виде REST сервера выполняющего следующие функции:
- Регистрация
- Авторизация
- Просмотр статей
- Добавление новой стати
- Редактирование статьи
- Удаление статьи
- Возможность изменять статус стати public/draft
- Добавление тегов
- Поиск по тегам и названию статьи
- Добавление комментариев
- Выдача списка статей и комментариев должна иметь возможность постраничного разбиения (skip, limit) и параметров фильтрации по полям

Все пользователи системы, включая незарегестрированных пользователей должны иметь возможность просмаривать публичные статьи.

## Регистрация и авторизация
Регистрация должна происходить по следующему сценарию:
- пользователь вводить необходимые регистранционные данные
- система генерирует подтверждающую ссылку (код), добавляет ее в Redis и отправляет ее на введенный email
- Коды для email имеют срок жизни 24 часа
- переходя по ссылке, `/auth/confirm/:hash_code` система ищет код в Redis и если есть активирует пользователя и дает возможность авторизоваться
- пока пользователь не подтвердил email, при попытке авторизации пользователю выдается соотвествующая ошибка.

**Пользователь должен иметь следующие поля:**
```
User {
    id: Integer/UID,
    first_name: String,
    last_name: String,
    password: String,
    email: String,
    created_at: Date
}
```

Пользователь должен иметь возможность восстановить пароль по стандартному сценарию.
`/auth/forgot_password` POST {email} отправлять письмо с кодом и в редис складывать этот код

`/auth/reset` POST {code, new_password} брать из редиса код и если он верен, то устанавливать новый 
парль

`/auth/check_code`  GET {code}  проверять актуальность кода сброса и возвращать в ответ

## Статьи

**Статья должна иметь следующие поля:**
```
Article {
    id: Integer/UID,
    title: String,
    text: Text,
    status: Enum,
    author_id: Integer/UID
    created_at: Date,
    updated_at: Date
}
```
**REST**

`PUT /articles/:id` - Редактирование стати, может только создатель поста

`POST /articles` - Добавить пост

`GET /articles` - получить публичные посты

`GET /my` - получить список постов авторизованного пользователя

`DELETE /articles/:id` - удалить стаью, удалить может только автор поста

Фильтрация должна выглядеть следующим образом:
`/articles?skip=0&limit=10&q=post_title&author=id&sort=field_name&order=asc|desc`

## Комментарии
**Комментарий должен иметь следующие поля:**
```
Comment {
    id: Integer/UID,
    message: Text,
    post_id: Integer/UID,
    author_id: Integer/UID
    created_at: Date
}
```
**REST**
`POST /articles/:id/comments` - добавить со ссылкой на пост и пользователя 

`GET /articles/:id/comments` - список комментариев поста

`GET /articles/:id/comments/:id` - просмотр комментария

`DELETE /articles/:id/comments/:id` - удалить, удалить может только автор комментария или поста

Фильтрация должна выглядеть следующим образом:
`/articles/:id/comments?skip=0&limit=10&q=post_title&author=id&sort=field_name&order=asc|desc`

## Теги
**Теги должны иметь следующие поля:**
```
Tag {
    id: Integer/UID,
    name: String
}
```

Связь необходимо организовать многие ко многим, через таблицу связки. 
Теги передаются в виде массива при при создании или редактировании поста. Если переданный тег уже существует в базе не нужно дублировать, а нужно добавить ID уже существующего поста.

**REST**

`GET /articles?tags=tag1,tag2` - в результате поиска должны быть посты которые содержат хотябы один искомый тег

`GET /tags-cloud` - Облако тегов. Где необходимо посчитать кол-во постов в которых встречается тег. Примерный результат: `[{tag: 'tagName', post_count: 10}]`

## Тестирование
В проекте необходимо настроить среду тестирования и создать 2 unit и 2 интеграционных теста. Необходимо в проект подключить [Linter](https://github.com/airbnb/javascript)


## Стек Технологий
- [Node.js](https://nodejs.org/en/) Express или другой фреймверк
- [MongoDb](https://www.mongodb.com/) или [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [Redis](https://redis.io/)


## Этапы работы над проектом

1. Продумать и создать структуру базы данных. Прикрепить к проекту в виде рисунка или pdf файла
2. Продумать архитектуру проекта, создать структуру папок и файлов (сделать Pull Request)
3. Разбить проект на этапы разработки и дать грубую оценку каждому из этапу. 
4. Создать файл `estimate.md` и описать в нем все этапы и время.
Пример:
```
Этап 1: 40 часов
    Регистрация - 8 часов
    Авторизация -8 часов
    Подтверждеине email - 8 часов
    Востановление пароля - 8 часов
    Тестирование - 8 часов
```
5. Начать разработку
6. Необходимо делать коммиты несолько раз в день, а по завершению задачи, задачи открывать Pull Request

## Рекомендации

- Для авторизации необходимо использовать стандарт JWT ( [JSON Web Token](https://jwt.io/introduction/) )
- Для проверки API можно использовать [Postman](https://www.getpostman.com/)
- Проект нужно поднимать в Docker контейнере
