# Portfolio for IIM students

## Collaborators
- Florient DECOTS
- Allia JARJIR
- Anthony LOPES
- Thomas SAUVAGE



## Install requirements

```bash
cd back
composer install
cd ../front
npm install
```

## Content of .env

```dotenv
APP_ENV=your_env
APP_SECRET=your_secret_key
DATABASE_URL="mysql://app:!ChangeMe!@127.0.0.1:3306/app?serverVersion=8.0.32&charset=utf8mb4"
CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'
```

## Create database

```bash
cd back
php bin/console doctrine:database:create
```

## Migrate database

```bash
cd back
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

## Create key for jwt

```bash
cd back
php bin/console lexik:jwt:generate-keypair
```


## Run server

```bash
cd back
symfony server:start --no-tls
```

## .env for front

```dotenv
NEXT_PUBLIC_API_URL=http://your_api_url
```


## Run front

```bash
cd front
npm i
npm run dev
```

