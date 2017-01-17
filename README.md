# electronify-server

`electronify-server` is a lightweight tool which starts a local web server and opens a url in an Electron shell.

#### Installation

```
npm install --save electronify-server
```

## How does it work?

When the Electron app loads, `electronify-server` will start a child process with the command you gave it in the configuration. This command is assumed to be a web server (but it doesn't have to be). If the child process was started successfully, the window will open and load the url to your server.

## Examples

There are a couple examples included in the repo. In order to run the examples, you need to have electron installed. If you do not have it installed, perhaps the simplest way is to use `electron-prebuilt` like so:

```
npm install -g electron-prebuilt
```

To run the examples, simply go into each example folder and run:

```
electron .
```

The `static` example has a dependency that will need to be installed first via:

```
npm install
```

### Short Example

```js
var electronify = require('electronify-server');

electronify({
  url: 'https://google.com',
  noServer: true
});
```

### Long Example

```js
var electronify = require('electronify-server');

electronify({
  command: 'python -m SimpleHTTPServer',
  url: 'http://127.0.0.1:8000',
  debug: true,
  window: {height: 768, width: 1024},
  ready: function(app){
    // application event listeners could be added here
  },
  preLoad: function(app, window){
    // window event listeners could be added here
  },
  postLoad: function(app, window){
    // url finished loading
  },
  showDevTools: false
}).on('child-started', function(child) {
  // child process has started
  console.log('PID: ' + child.pid);

  // setup logging on child process
  child.stdout.on('data', console.log);
  child.stderr.on('data', console.log);

}).on('child-closed', function(app, stderr, stdout) {
  // the child process has finished

}).on('child-error', function(err, app) {
  // close electron if the child crashes
  app.quit();
});
```

## Configuration Options

* `url [String]`: URL to load after child process starts
* `command [String]`: command to start child process
* `options [Object]`: options for [exec][2]
* `debug [Boolean]`: enables debug output
* `noServer [Boolean]`: allows urls to load without starting a child process
* `showDevTools [Boolean]`: shows dev tools on startup
* `window [Object]`: BrowserWindow configuration
* `ready [Function]`: called when the application is ready
    * `app [Object]`: Electron application
* `preLoad [Function]`: called after the window is created but before the url is loaded
    * `app [Object]`: Electron application
    * `window [Object]`: Electron BrowserWindow
* `postLoad [Function]`: called after the url has finished loading
    * `app [Object]`: Electron application
    * `window [Object]`: Electron BrowserWindow

#### Relevant documentation

* [Node Child Process](https://nodejs.org/api/child_process.html#child_process_class_childprocess)
* [Electron Application](https://github.com/atom/electron/blob/master/docs/api/app.md)
* [Electron BrowserWindow](https://github.com/atom/electron/blob/master/docs/api/browser-window.md#new-browserwindowoptions)

## Events

`electronify` also returns an EventEmitter which emits several events for the child process. This allows you to do additional work when the child process starts, exits or fails unexpectantly.

* `child-started`: Emitted immediately on successful start of child process
    * `process`: The [child process][1] that was started
* `child-closed`: Emitted when the child process exits gracefully.
    * `app`: Electron application
    * `stderr`: Standard error of child process
    * `stdout`: Standard output of child process
* `child-error`: Emitted when the child process fails.
    * `err`: Error returned from executing child process.
    * `app`: Electron application
* `error`: Configuration error
    * `err`: Configuration error
    * `app`: Electron application

[1]: https://nodejs.org/api/child_process.html#child_process_class_childprocess "child process"
[2]: https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback "child_process.exec"
