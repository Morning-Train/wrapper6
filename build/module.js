"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     Dependencies
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _es6Symbol = require("es6-symbol");

var _es6Symbol2 = _interopRequireDefault(_es6Symbol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
Symbols
 */

var _app = (0, _es6Symbol2.default)("app");

/*
Class
 */

var Module = function () {
    function Module(app) {
        _classCallCheck(this, Module);

        this[_app] = app;
    }

    _createClass(Module, [{
        key: "boot",
        value: function boot(app) {}
    }, {
        key: "ready",
        value: function ready(app) {}

        /*
        Getters
         */

    }, {
        key: "app",
        get: function get() {
            return this[_app];
        }
    }]);

    return Module;
}();

exports.default = Module;