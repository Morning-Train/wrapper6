"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ready = undefined;

var _es6Promise = require("es6-promise");

exports.ready = ready;

/**
 * document.ready
 *
 * @param callback
 * @returns {Promise<U>|*|Promise.<TResult>}
 */

function ready() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var promise = new _es6Promise.Promise(function (resolve) {
        if (document.readyState === "complete") {
            return resolve();
        }

        document.addEventListener("DOMContentLoaded", function () {
            resolve();
        });
    });

    return typeof callback === "function" ? promise.then(callback) : promise;
}