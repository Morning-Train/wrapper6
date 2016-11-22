"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     Dependencies
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _reactiveMap = require("./reactive-map");

var _reactiveMap2 = _interopRequireDefault(_reactiveMap);

var _module = require("./module");

var _module2 = _interopRequireDefault(_module);

var _es6Symbol = require("es6-symbol");

var _es6Symbol2 = _interopRequireDefault(_es6Symbol);

var _es6Map = require("es6-map");

var _es6Map2 = _interopRequireDefault(_es6Map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
Symbols
 */

var _options = (0, _es6Symbol2.default)("options"),
    _factories = (0, _es6Symbol2.default)("factories"),
    _bindings = (0, _es6Symbol2.default)("bindings"),
    _ready = (0, _es6Symbol2.default)("ready"),
    _deprecated = (0, _es6Symbol2.default)("deprecated");

var Application = function () {
    function Application() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Application);

        this[_options] = new _reactiveMap2.default(options);
        this[_factories] = [];
        this[_bindings] = new _es6Map2.default();
        this[_ready] = false;
    }

    /**
     * Query the options passed to the application
     *
     * @param {String} query
     * @param defaultValue
     * @returns {*}
     */

    _createClass(Application, [{
        key: "option",
        value: function option(query) {
            var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            return this.options.get(query, defaultValue);
        }

        /**
         * Options set
         * @returns {*}
         */

    }, {
        key: "use",


        /**
         * Registers a module
         *
         * @param name
         * @param factory
         * @returns {*}
         */
        value: function use(name, factory) {
            // Decide arguments
            if (typeof name === "function") {
                factory = name;
                name = null;
            }

            // Validate factory
            if (typeof factory !== "function") {
                throw new Error("The module factory can only be a function.");
            }

            this[_factories].push({
                name: name,
                factory: factory
            });
        }

        /**
         * Bootstraps the app
         */

    }, {
        key: "boot",
        value: function boot() {
            var _this = this;

            var instances = [];

            this[_factories].forEach(function (module) {

                // Create instance
                var instance = module.factory instanceof _module2.default ? new module.factory(_this) : module.factory(_this);

                // Set binding
                if (typeof module.name === "string") {
                    _this[_bindings].set(module.name, instance);

                    // Define getter
                    if (!_this.hasOwnProperty(module.name)) {
                        Object.defineProperty(_this, module.name, {
                            get: function get() {
                                return _this[_bindings].get(module.name);
                            }
                        });
                    }
                }

                // Boot instance
                if (typeof instance.boot === "function") {
                    instance.boot(_this);
                }

                // Register for ready
                instances.push(instance);
            });

            // Ready up
            instances.forEach(function (instance) {
                if (typeof instance.ready === "function") {
                    instance.ready(_this);
                }
            });

            // Ready up application
            this[_ready] = true;
        }

        /*
        Helper to check if app is ready
         */

    }, {
        key: "options",
        get: function get() {
            return this[_options];
        }
    }, {
        key: "ready",
        get: function get() {
            return this[_ready];
        }
    }]);

    return Application;
}();

exports.default = Application;