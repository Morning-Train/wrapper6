"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
                                                                                                                                                                                                                                                                              Dependencies
                                                                                                                                                                                                                                                                               */

exports.queryObject = queryObject;
exports.promisify = promisify;
exports.resolve = resolve;
exports.now = now;

var _es6Promise = require("es6-promise");

/**
 * Query an object for a value
 *
 * @param {Object} object
 * @param {String} query
 * @param defaults
 * @returns {*}
 */

function queryObject(object, query) {
    var defaults = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var current = object,
        queryParts = query.split("."),
        part;

    if (object === null || object === undefined) {
        return defaults;
    }

    while (current && queryParts.length > 0) {
        part = queryParts.shift();

        if (current[part] === undefined) {
            return defaults;
        }

        current = current[part];
    }

    return current;
}

/**
 * Transform everything into a promise
 *
 * @param {*} promiseLike
 * @returns {Promise}
 */

function promisify() {
    var promiseLike = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if (promiseLike instanceof _es6Promise.Promise) {
        return promiseLike;
    }

    if (typeof promiseLike === "function") {
        return promisify(promiseLike());
    }

    return new _es6Promise.Promise(function (resolve, reject) {
        promiseLike === false ? reject() : resolve(promiseLike);
    });
}

/**
 * Resolves one or more promise-likes
 *
 * @param {*} promiseLike
 * @returns {Promise}
 */
function resolve(promiseLike) {

    // Return if already promised
    if (promiseLike instanceof _es6Promise.Promise) {
        return promiseLike;
    }

    var promises = [];

    if (promiseLike instanceof Array) {
        promiseLike.forEach(function (promiseLikeEntry) {
            promises.push(promisify(promiseLikeEntry));
        });
    } else if (promiseLike && (typeof promiseLike === "undefined" ? "undefined" : _typeof(promiseLike)) === "object") {
        Object.keys(promiseLike).forEach(function (key) {
            promises.push(promisify(promiseLike[key]));
        });
    } else {
        return promisify(promiseLike);
    }

    return _es6Promise.Promise.all(promises).then(function (result) {
        if (promiseLike instanceof Array) {
            return result;
        }

        var response = {};
        Object.keys(promiseLike).forEach(function (key, index) {
            response[key] = result[index];
        });

        return response;
    });
}

/**
 Returns the current unix timestamp in seconds
 */

function now() {
    return Math.floor((typeof Date.now === "function" ? Date.now() : new Date().getTime()) / 1000);
}