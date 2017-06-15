"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.wrapAll = exports.requireDependencies = exports.definePackage = undefined;

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _events = require("./events");

var _es6Promise = require("es6-promise");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @private
var events = new _events.EventEmitter(),
    packages = new Map();

// @public
/*
 |--------------------------------------------------------------------------
 | Package manager
 |--------------------------------------------------------------------------
 |
 |
 |
 */

// @dependencies
exports.definePackage = definePackage;
exports.requireDependencies = requireDependencies;
exports.wrapAll = wrapAll;

/**
 * Resolve an array of dependencies
 *
 * @param dependencies
 * @returns {Promise}
 */

function requireDependencies(dependencies) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var promise = new _es6Promise.Promise(function (succeed, fail) {
        var requirements = {};

        // no requirements
        if (!(dependencies instanceof Array)) {
            return succeed(requirements);
        }

        // check if succeeded
        function checkStatus() {
            if (Object.keys(requirements).length === dependencies.length) {
                succeed(requirements);
            }
        }

        dependencies.forEach(function (dependency) {
            if (packages.has(dependency)) {
                requirements[dependency] = packages.get(dependency);
            } else {
                events.once("load:" + dependency, function (requirement) {
                    requirements[dependency] = requirement;
                    checkStatus();
                });
            }
        });

        // First check
        checkStatus();
    });

    return typeof callback === "function" ? promise.then(callback) : promise;
};

/**
 * Define a package
 *
 * @param name
 * @param dependencies
 * @param callback
 * @returns {Promise.<TResult>}
 */
function definePackage(name, dependencies, callback) {
    // Adjust arguments
    if (typeof name === "function") {
        callback = name;
        name = null;
        dependencies = null;
    } else if (typeof dependencies === "function") {
        callback = dependencies;
        dependencies = null;

        if (name instanceof Array) {
            dependencies = name;
            name = null;
        }
    }

    // Check name conflicts
    if (typeof name === "string") {
        if (packages.has(name)) {
            throw new Error("Package '" + name + "' is already loaded!");
        }
    }

    // Resolve timeout
    var timeout = _config2.default.get('package_timeout', 5000),
        timer = null;

    return new _es6Promise.Promise(function (succeed, fail) {

        // Start timeout
        if (typeof timeout === "number") {
            timer = setTimeout(function () {
                timer = null;

                if (_config2.default.get("debug", true)) {
                    throw new Error("Package '" + name + "' timed out!");
                }
            }, timeout);
        }

        // Resolve dependencies
        requireDependencies(dependencies).then(function (requirements) {
            try {

                // register package
                var register = function register(pack) {
                    // cancel timeout
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }

                    if (pack === false) {
                        return;
                    }

                    if (typeof name === "string") {
                        packages.set(name, pack);
                        events.emit("load:" + name, packages.get(name));
                    }

                    return succeed(pack);
                };

                // Check boot response


                var bootResponse = typeof callback === "function" ? callback(requirements) : callback;return bootResponse instanceof _es6Promise.Promise ? bootResponse.then(register) : register(bootResponse);
            } catch (ex) {
                if (_config2.default.get("debug", true)) {
                    console.error(ex);
                }

                return fail(ex);
            }
        });
    });
};

/**
 * Runs the callback with all currently loaded packages
 *
 * @param callback
 * @returns {*}
 */
function wrapAll(callback) {
    // Prepare packages
    var packs = {};

    packages.forEach(function (pack, name) {
        packs[name] = pack;
    });

    return callback(packs);
}