/*
 |--------------------------------------------------------------------------
 | Package manager
 |--------------------------------------------------------------------------
 |
 |
 |
 */

// @dependencies
import config from "./config";
import {EventEmitter} from "events";
import {Promise} from "es6-promise";

// @private
let events = new EventEmitter(),
    packages = new Map();

// @public
export {
    definePackage,
    requireDependencies,
    wrapAll
};

/**
 * Resolve an array of dependencies
 *
 * @param dependencies
 * @returns {Promise}
 */
function requireDependencies(dependencies, callback = null) {
    let promise = new Promise((succeed, fail) => {
        let requirements = {};

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

        dependencies.forEach((dependency) => {
            if (packages.has(dependency)) {
                requirements[dependency] = packages.get(dependency);
            }
            else {
                events.once(`load:${dependency}`, (requirement) => {
                    requirements[dependency] = requirement;
                    checkStatus();
                });
            }
        });

        // First check
        checkStatus();
    });

    return (typeof callback === "function") ?
        promise.then(callback) :
        promise;
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
    }
    else if (typeof dependencies === "function") {
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
            throw new Error(`Package '${name}' is already loaded!`);
        }
    }

    // Resolve timeout
    let timeout = config.get('package_timeout', 5000),
        timer = null;

    return new Promise((succeed, fail) => {

        // Start timeout
        if (typeof timeout === "number") {
            timer = setTimeout(() => {
                timer = null;

                if (config.get("debug", true)) {
                    throw new Error(`Package '${name}' timed out!`);
                }

            }, timeout);
        }

        // Resolve dependencies
        requireDependencies(dependencies).then((requirements) => {
            try {
                let bootResponse = (typeof callback === "function") ? callback(requirements) : callback;

                // register package
                function register(pack) {
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
                        events.emit(`load:${name}`, packages.get(name));
                    }

                    return succeed(pack);
                }

                // Check boot response
                return bootResponse instanceof Promise ?
                    bootResponse.then(register) :
                    register(bootResponse);
            }
            catch (ex) {
                if (config.get("debug", true)) {
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
    let packs = {};

    packages.forEach((pack, name) => {
        packs[name] = pack;
    });

    return callback(packs);
}