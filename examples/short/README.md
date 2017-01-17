
# Installation

```
cd src && npm install
```

# Packaging

Packaging required the `electron-packager` package. You can install it like so:

```
npm install --save-dev electron-packager
```

To build the package, from within `src` run:

```
./node_modules/electron-packager/cli.js . Google --electron-version=1.4.14 --overwrite
```
