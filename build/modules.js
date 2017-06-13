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

var _es6Promise = require("es6-promise");

var _promises = require("./promises");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    var module = new moduleClass(),
        bootResponse = void 0;

    // Wrapper methods
    function boot() {
        var initialResponse = typeof module.boot === "function" ? module.boot() : null;

        if (initialResponse === false) {
            return false;
        }

        return initialResponse instanceof _es6Promise.Promise ? initialResponse.then(function (response) {
            bootResponse = response;
            return module;
        }) : module;
    }

    function ready() {
        if (typeof module.ready === "function") {
            return module.ready(bootResponse);
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

/*
 -------------------------------
 Exports
 -------------------------------
 */

exports.useModule = useModule;
exports.Module = Module;