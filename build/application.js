"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      Dependencies
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _reactiveMap = require("./reactive-map");

var _reactiveMap2 = _interopRequireDefault(_reactiveMap);

var _es6Symbol = require("es6-symbol");

var _es6Symbol2 = _interopRequireDefault(_es6Symbol);

var _es6Map = require("es6-map");

var _es6Map2 = _interopRequireDefault(_es6Map);

var _es6Promise = require("es6-promise");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 Symbols
 */

var _options = (0, _es6Symbol2.default)("options"),
    _bindings = (0, _es6Symbol2.default)("bindings"),
    _listeners = (0, _es6Symbol2.default)("listeners"),
    _factories = (0, _es6Symbol2.default)("factories"),
    _boot = (0, _es6Symbol2.default)("boot");

/*
 Class
 */

var Application = function () {

    /**
     * Constructor
     *
     * @param options
     */
    function Application() {
        var _this = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Application);

        this[_options] = new _reactiveMap2.default(options);
        this[_bindings] = new _es6Map2.default();
        this[_listeners] = new _es6Map2.default();
        this[_factories] = [];

        if (document.readyState !== "complete") {
            document.addEventListener("DOMContentLoaded", function () {
                _this.trigger("ready");
                _this[_factories].forEach(function (factoryMeta) {
                    _this[_boot](factoryMeta);
                });
            });
        }
    }

    /*
     Accessors
     */

    /**
     * Returns the option map
     *
     * @returns {ReactiveMap}
     */


    _createClass(Application, [{
        key: "on",


        /*
         Events
         */

        /**
         * Registers an event listener
         *
         * @param eventName
         * @param callback
         * @returns {*}
         */
        value: function on(eventName, callback) {
            var _this2 = this;

            if (typeof callback !== "function") {
                throw new Error("Invalid callback passed as application event listener!");
                return;
            }

            var events = eventName.split(" ");

            events.forEach(function (eventName) {
                if (!_this2[_listeners].has(eventName)) {
                    _this2[_listeners].set(eventName, []);
                }

                _this2[_listeners].get(eventName).push(callback);
            });

            return this;
        }

        /**
         * Unregisters an event listener
         *
         * @param eventName
         * @param callback
         * @returns {Application}
         */

    }, {
        key: "off",
        value: function off(eventName) {
            var _this3 = this;

            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var events = eventName.split(" ");

            events.forEach(function (eventName) {
                if (typeof callback !== "function") {
                    _this3[_listeners].delete(eventName);
                    return;
                }

                if (_this3[_listeners].has(eventName)) {
                    var index = _this3[_listeners].get(eventName).indexOf(callback);

                    if (index > -1) {
                        _this3[_listeners].get(eventName).splice(index, 1);
                    }
                }
            });

            return this;
        }

        /**
         * Triggers an event listener
         *
         * @param eventName
         * @param args
         * @returns {Application}
         */

    }, {
        key: "trigger",
        value: function trigger(eventName) {
            var _this4 = this;

            var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var events = eventName.split(" ");

            events.forEach(function (eventName) {
                if (_this4[_listeners].has(eventName)) {
                    _this4[_listeners].get(eventName).forEach(function (callback) {
                        callback.apply(_this4, args instanceof Array ? args : []);
                    });
                }
            });

            return this;
        }

        /*
         Requests
         */

        /**
         * Requires a set of bindings
         *
         * @param requirements
         * @returns {Promise}
         */

    }, {
        key: "require",
        value: function require(requirements) {
            var _this5 = this;

            return new _es6Promise.Promise(function (resolve) {
                if (!requirements instanceof Array) {
                    requirements = [requirements];
                }

                if (requirements.length === 0) {
                    return resolve({});
                }

                var // Store solutions
                solutions = {},


                // Create event name
                events = [],
                    eventName,


                // Event callback
                callback = function callback(name, module) {
                    solutions[name] = module;

                    if (Object.keys(solutions).length === requirements.length) {
                        _this5.off(eventName, callback);
                        resolve(solutions);
                    }
                };

                // Build event name
                requirements.forEach(function (name) {
                    // Check if already loaded
                    if (_this5[_bindings].has(name)) {
                        solutions[name] = _this5[_bindings].get(name);
                        return;
                    }

                    events.push("load:" + name);
                });

                // Check if all solutions are loaded
                if (events.length === 0) {
                    // Resolve if document is loaded
                    if (document.readyState === "complete") {
                        resolve(solutions);
                    } else {
                        _this5.on("ready", function () {
                            resolve(solutions);
                        });
                    }

                    return;
                }

                // Create event name
                eventName = events.join(" ");

                // Bind event
                _this5.on(eventName, callback);
            });
        }

        /*
         Modularization
         */

        /**
         * Registers a module
         *
         * @param name
         * @param factory
         * @returns {*}
         */

    }, {
        key: "use",
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

            var factoryMeta = {
                name: name,
                factory: factory
            };

            this[_factories].push(factoryMeta);

            // Boot factory if document is already loaded
            if (document.readyState === "complete") {
                this[_boot](factoryMeta);
            }
        }

        /**
         * Defines a module binding
         *
         * @param name
         * @param binding
         */

    }, {
        key: "define",
        value: function define(name, module) {
            var _this6 = this;

            this[_bindings].set(name, module);

            // Define property
            if (!this.hasOwnProperty(name)) {
                Object.defineProperty(this, name, {
                    get: function get() {
                        return _this6[_bindings].get(name);
                    }
                });
            }

            // Trigger load
            this.trigger("load:" + name, [name, module]);
        }
    }, {
        key: _boot,
        value: function value(factoryMeta) {
            var _this7 = this;

            var module = new factoryMeta.factory(this);

            (0, _utils.promisify)(typeof module.boot === "function" ? function () {
                return module.boot(_this7);
            } : true).then(function (result) {
                // Register binding
                if (typeof factoryMeta.name === "string") {
                    _this7.define(factoryMeta.name, module);
                }

                // Call ready
                if (typeof module.ready === "function") {
                    module.ready(_this7, result);
                }
            }).catch(function (reason) {
                //console.error(reason);
            });
        }
    }, {
        key: "options",
        get: function get() {
            return this[_options];
        }
    }]);

    return Application;
}();

exports.default = Application;