# OONI Explorer

For the live website see: https://explorer.ooni.org.

## Setup

We assume you have a working node.js development environment with yarn installed.

Then do:

```
yarn install
```

## Usage

To run the dev server do:

```
yarn run dev
```

To build the app:

```
yarn run build
```

To start the production server run:

```
yarn run start
```

We also provide a `Dockerfile` for easy deployment.

## Managing translations

You should have checked out the https://github.com/ooni/translations
repository.

From inside of `ooni/translations` to update the transifex master copy (this is
done when edits to the master spreadsheet are done), you should run:
```
./update-explorer-source.sh
```

Then when the translations have been done and you want to pull in the
translated versions, run:
```
./update-explorer-translations.sh
```

From inside of the ooni/explorer repo you should then run:
```
yarn run script:build-translations
```

(this assumes you have `ooni/translations` checked out in the parent directory)
