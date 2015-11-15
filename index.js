'use strict';

/* eslint no-path-concat: 0, func-names:0 */
// require('electron-debug')();
// require('crash-reporter').start();
// const crashReporter = require('electron').crashReporter;

// Imports
var app = require('app');
var util = require('util');
var colors = require('colors');
var EventEmitter = require('events');
var BrowserWindow = require('browser-window');
var exec = require('child-process-promise').exec;
// var dialog = require('electron').dialog;

var DEFAULT_WINDOW = { width: 1024, height: 728, show: false };
var NOOP = function(){};
var DEBUG = function(text) {
  var time = new Date().toLocaleTimeString();
  console.log('['.grey + time.green + ']'.grey + colors.reset(' ' + text));
};

function Fermion(cfg) {
  var self = this;

  // Initialize necessary properties from `EventEmitter` in this instance
  EventEmitter.call(self);

  // setup debug logger
  var debug = NOOP;
  if (cfg.debug) {
    debug = DEBUG;
  }

  app.on('window-all-closed', function() {
    debug('All windows closed.');

    // quit after last window is closed
    app.quit();
  });

  app.on('ready', function() {
    debug('App ready.');
    if (cfg.ready) cfg.ready(app);

    // The app will quit if there is no command to run.
    if (!cfg.command) {
      debug('No command configured!');
      self.emit('error', new Error('Empty command!'), app);
      return
    }

    // start child process
    exec(cfg.command, cfg.options)
      .then(function (result) {
        debug('Command completed.');

        // Send output
        var stdout = result.stdout;
        var stderr = result.stderr;
        self.emit('child-closed', app, stderr, stdout);
      })
      .fail(function (err) {
        debug(err);
        self.emit('error', err);
        // app.quit();
      })
      .progress(function (childProcess) {
        debug('Command started. [PID: ' + childProcess.pid + ']');
        self.emit('child-started', childProcess);

        app.on('quit', function() {
          if(!childProcess.killed) childProcess.kill();
        });

        // setup window config
        var browserConfig =  cfg.window || DEFAULT_WINDOW ;
        browserConfig.show = false;

        // create window
        var mainWindow = new BrowserWindow(browserConfig);

        // call pre load handler
        // menus could be created in this function
        // window and app event handlers could also be added here
        if (cfg.preLoad) cfg.preLoad(app, mainWindow);

        // load url
        mainWindow.loadUrl(cfg.url);
        mainWindow.show();

        // call post load handler
        if (cfg.postLoad) cfg.postLoad(app, mainWindow);

        mainWindow.webContents.on('did-finish-load', function() {
          debug('Finished loading.');
        });

        // Clean resource
        mainWindow.on('closed', function() {
          debug('Window closed.');
          mainWindow = null;
        });

        // Enable dev tools
        if (cfg.devTools) mainWindow.openDevTools();
      });
  });
}

// Inherit functions from `EventEmitter`'s prototype
util.inherits(Fermion, EventEmitter);

module.exports = function(cfg) {
  return new Fermion(cfg);
};
