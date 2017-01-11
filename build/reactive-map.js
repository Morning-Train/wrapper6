"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     Dependencies
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _es6Symbol = require("es6-symbol");

var _es6Symbol2 = _interopRequireDefault(_es6Symbol);

var _es6Map = require("es6-map");

var _es6Map2 = _interopRequireDefault(_es6Map);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 Symbols
 */

var _data = (0, _es6Symbol2.default)("data"),
    _computed = (0, _es6Symbol2.default)("computed"),
    _watchers = (0, _es6Symbol2.default)("watchers");

/*
Class
 */

var ReactiveMap = function () {
    function ReactiveMap() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, ReactiveMap);

        this[_data] = {};
        this[_computed] = new _es6Map2.default();
        this[_watchers] = new _es6Map2.default();

        // Assign data
        this.set(data);
    }

    _createClass(ReactiveMap, [{
        key: "computed",
        value: function computed(key, getter) {
            var _this = this;

            if (key && (typeof key === "undefined" ? "undefined" : _typeof(key)) === "object") {
                Object.keys(key).forEach(function (propKey) {
                    _this.computed(propKey, key[propKey]);
                });

                return this;
            }

            if (typeof getter === "function") {
                this[_computed].set(key, getter);
            }

            return this;
        }
    }, {
        key: "watch",
        value: function watch(key, callback) {
            var watchers = this[_watchers].get(key);

            if (!watchers instanceof Array) {
                watchers = [];
                this[_watchers].set(key, watchers);
            }

            watchers.push(callback);

            return this;
        }
    }, {
        key: "get",
        value: function get(query) {
            var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (arguments.length === 0) {
                return this[_data];
            }

            // Check if computed
            var head = query.split("."),
                tail = [],
                headQuery = void 0,
                getter = void 0,
                result = void 0;

            while (head.length > 0) {
                headQuery = head.join(".");
                getter = this[_computed].get(headQuery);
                if (typeof getter === "function") {
                    result = getter.call(this);

                    return tail.length === 0 ? result : (0, _utils.queryObject)(result, tail.join("."), defaultValue);
                }

                tail.push(head.pop());
            }

            return (0, _utils.queryObject)(this[_data], query, defaultValue);
        }
    }, {
        key: "set",
        value: function set(query, value) {
            var _this2 = this;

            // Check if query is an object
            if ((typeof query === "undefined" ? "undefined" : _typeof(query)) === "object") {
                Object.keys(query).forEach(function (key) {
                    _this2.set(key, query[key]);
                });

                return this;
            }

            var parts = query.split("."),
                key = parts.pop(),
                parentQuery = parts.join("."),
                parent = parts.length === 0 ? this.get() : this.get(parentQuery),
                watchers,
                oldValue = this.get(query);

            if (!parent) {
                parent = {};
                this.set(parentQuery, parent);
            }

            parent[key] = value;

            // Trigger "*" watchers
            watchers = this[_watchers].get("*");

            if (watchers instanceof Array) {
                watchers.forEach(function (watcher) {
                    watcher(query, value, oldValue);
                });
            }

            // Trigger "*" watchers of parent
            watchers = this[_watchers].get(parentQuery + ".*");

            if (watchers instanceof Array) {
                watchers.forEach(function (watcher) {
                    watcher(query, value, oldValue);
                });
            }

            // Trigger specific watcher
            watchers = this[_watchers].get(query);

            if (watchers instanceof Array) {
                watchers.forEach(function (watcher) {
                    watcher(query, value, oldValue);
                });
            }

            return this;
        }
    }, {
        key: "has",
        value: function has(query) {
            return this.get(query) !== null;
        }
    }, {
        key: "resolve",
        value: function resolve(query, resolver) {
            if (!this.has(query)) {
                this.set(query, resolver());
            }

            return this.get(query);
        }
    }, {
        key: "empty",
        value: function empty() {
            this[_data] = {};
            return this;
        }
    }, {
        key: "isEmpty",
        value: function isEmpty() {
            return Object.keys(this[_data]).length === 0;
        }
    }]);

    return ReactiveMap;
}();

exports.default = ReactiveMap;