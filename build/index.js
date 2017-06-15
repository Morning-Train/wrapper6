"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Module = exports.Scope = exports.ready = exports.use = exports.require = exports.define = exports.scope = exports.queryObject = exports.resolve = exports.promisify = exports.config = undefined;

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _promises = require("./promises");

var _scope = require("./scope");

var _packages = require("./packages");

var _modules = require("./modules");

var _dom = require("./dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.config = _config2.default;
exports.promisify = _promises.promisify;
exports.resolve = _promises.resolve;
exports.queryObject = _scope.queryObject;
exports.scope = _scope.createScope;
exports.define = _packages.definePackage;
exports.require = _packages.requireDependencies;
exports.use = _modules.useModule;
exports.ready = _dom.ready;
exports.Scope = _scope.Scope;
exports.Module = _modules.Module;