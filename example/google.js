var fermion = require('../index');

fermion({
  url: 'https://google.com',
  debug: true,
  command: 'sleep 1',
  window: {height: 768, width: 1024},
  ready: function(app){},
  preLoad: function(app, window){},
  postLoad: function(app, window){},
  devTools: false
}).on('child-started', function(child) {
}).on('child-closed', function(app, stderr, stdout) {
}).on('child-error', function(err, app) {
  app.quit();
});
