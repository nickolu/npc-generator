'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (config) {

	var app = (0, _express2.default)();
	var server = _http2.default.createServer(app);

	app.use('/libs', _express2.default.static(_path2.default.join(__dirname, '../node_modules')));
	app.use(_express2.default.static(config.webServer.folder));

	server.listen(config.webServer.port, function () {
		return console.log('web server running on port ' + config.webServer.port);
	});
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }