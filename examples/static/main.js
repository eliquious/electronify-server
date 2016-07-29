var electronify = require('../../index');

electronify({
  command: 'node',
  args: ['server.js'],
  options: {},
  url: 'http://127.0.0.1:8080',
  debug: true,
  window: {height: 768, width: 1024, 'title-bar-style': 'default', frame: true},
  ready: function(app){
    // application event listeners could be added here
  },
  preLoad: function(app, window){
    // window event listeners could be added here
  },
  postLoad: function(app, window, error){
    // Error only exists if there was an error while loading
    // error == {
    //   event: event,
    //   errorCode: errorCode,
    //   errorDescription: errorDescription,
    //   validatedURL: validatedURL,
    //   isMainFrame: isMainFrame
    // }
    if (error) {
      console.log(error.errorCode, error.errorDescription, error.validatedURL);
    }

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
