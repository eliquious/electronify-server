# fermion

Fermion is a lightweight tool which starts then loads local web servers in an Electron shell.

## Example

```js
var fermion = require('fermion');

fermion({
  command: 'python -m SimpleHTTPServer',
  url: 'https://127.0.0.1:8000',
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
  childProcess.stdout.on('data', console.log);
  childProcess.stderr.on('data', console.log);
  
}).on('child-closed', function(app, stderr, stdout) {
  // the child process has finished
  
}).on('child-error', function(err, app) {
  // close electron if the child crashes
  app.quit();
});
```

## How does it work?

When the electron app loads, `fermion` will start a child process with the command you gave it in the configuration. This command is assumed to be a web server but it doesn't have to be. If the child process was started successfully, the window will open and load the url to your server.

## Configuration

## Events

Fermion also returns an EventEmitter which emits several events for the child process. This allows you to do additional work when the child process starts, exits or fails unexpectantly.

* `child-started`: Emitted immediately on successful start of child process
    * `process`: The [child process][1] that was started
* `child-closed`: Emitted when the child process exits gracefully.
    * `app`: Electron application
    * `stderr`: Standard error of child process
    * `stdout`: Standard output of child process
* `child-error`: Emitted when the child process fails.
    * `err`: Error returned from executing child process.
    * `app`: Electron application
* `error`: Fermion configuration error
    * `err`: Configuration error
    * `app`: Electron application

[1]: https://nodejs.org/api/child_process.html#child_process_class_childprocess "child process"
