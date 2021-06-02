# gaia project generator (nodejs)

## Getting Started

First, install then run the development server:

__This project prefered `yarn` instead of `npm`__

```bash
yarn

yarn dev
```

<del>
[npm]

```bash
npm i

npm run dev
```
</del>

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Change port

```bash
yarn dev -p 3301
```

<del>
[npm]

```bash
npm run dev -- -p 3301
```
</del>

## To start mongo db (Local Machine)

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

<del>
[npm]

```bash
npm run build
```
</del>

## Start

```bash
yarn start [-p PORT]
```

<del>
[npm]

```bash
npm start [-- -p PORT]
```
</del>

## Debugging

```bash
yarn debug [-p PORT]
```

Then use __Chrome Inspector__ or __VSCode Inspector__ as a debugger

## Copyright

Keeradit B. (oskee121)
