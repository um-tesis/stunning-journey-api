# Libera - Charity Platform - API

## Introduction

The objective of the project is to create a web platform that connects donors with social projects in need of funding,
taking the donor user experience to the next level.
That is, to link donors and potential donors more deeply with the social projects of the platform, in order to build
loyalty and allow a closer approach to the activities carried out by social projects.

Through different communication channels, the transparency and honesty of the social work will be promoted so that
donors can perceive how their contributions are invested.
In this way, users will be encouraged to continue supporting the different projects, either through financial or
non-monetary contributions.
Likewise, the platform will allow connecting people interested in the project, so that they can participate in it as
volunteers.

## Services

## Usage

### Prerequisites

- [NVM](https://github.com/nvm-sh/nvm)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

Install dependencies using the right Node.js version:

```shell
nvm use
npm i
```

Get the database up and running:

```shell
docker compose up db -d
```

Run the server in watch mode:

```shell
npm run start:dev
```

## Testing

