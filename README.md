# gaia project generator (nodejs)

## Getting Started

First, install then run the development server:

```bash
yarn

yarn dev
```

__npm__

```bash
npm i

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Change port

```bash
yarn dev -p 3301
```

__npm__

```bash
npm run dev -- -p 3301
```


## To start mongo db (local machine)

```
docker run -d -p 27017:27017 --name mongodb_loc  mongo
```

- Create database name "gp_app".

- Create user "app_user" and password (example: user1234!).

- Create a collection "gen_result".

# Run as production mode

## Build project

```
yarn build
```

__npm__

```bash
npm run build
```

## Start

```bash
yarn start [-p PORT]
```

__npm__

```bash
npm start [-- -p PORT]
```


## Copyright

Keeradit B. (oskee121)
