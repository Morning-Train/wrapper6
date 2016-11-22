"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = queryObject;
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