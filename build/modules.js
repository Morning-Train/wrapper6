"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Module = exports.useModule = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |--------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Module wrapper
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |--------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _packages = require("./packages");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

exports.useModule = useModule;
exports.Module = Module;

/**
 * Module loader
 *
 * @param name
 * @param moduleClass
 * @returns {Promise.<TResult>}
 */

function useModule(name, moduleClass) {
    if (arguments.length === 1) {
        moduleClass = name;
        name = null;
    }

    // create module
    var module = new moduleClass();

    // Wrapper methods
    function boot() {
        if (typeof module.boot === "function") {
            return module.boot.apply(module, arguments);
        }
    }

    function ready() {
        if (typeof module.ready === "function") {
            return module.ready.apply(module, arguments);
        }
    }

    return typeof name === "string" ? (0, _packages.define)(name, boot).then(ready) : (0, _packages.define)(boot).then(ready);
}

/**
 * Module base class
 */

var Module = function () {
    function Module() {
        _classCallCheck(this, Module);
    }

    _createClass(Module, [{
        key: "boot",
        value: function boot() {}
    }, {
        key: "ready",
        value: function ready() {}
    }]);

    return Module;
}();