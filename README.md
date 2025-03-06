## Description

Test campaign reports

Fetch URL with big data manually and by cron in separate process

Parse data and save to db

Get aggregated data from db

## Stack
Cron, Queue, Redis, NestJS, TypeORM, Postgresql, TypeScript, JavaScript, docker-compose, git, json

## Setup development

1. Install Redis
```bash
   $ sudo apt-get install redis-server
```
1. Install Postgresql
```bash
   $ sudo apt install postgresql
```
2. Create .env file based on .env.example
3. Create Database DB_DATABASE
```bash
   sudo -u postgres psql -c 'create database DB_DATABASE;'
```
4. Install packages 
```bash
   $ npm i
```
4. Run migrations
```bash
   $ npm run migration:run
```

## Docker usage

#### Run database

```bash
$ cd docker
$ docker-compose up db
```

#### Run queue

```bash
$ cd docker
$ docker-compose up queue
```

#### Run project

```bash
$ cd docker
$ docker-compose up -d
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# with docker
$ cd docker
$ docker-compose up -d
```

## API Documentation

[http://localhost:3000/api](http://localhost:3000/api)
