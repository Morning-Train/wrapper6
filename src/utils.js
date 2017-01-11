/*
Dependencies
 */

import {Promise} from "es6-promise";

/**
 * Query an object for a value
 *
 * @param {Object} object
 * @param {String} query
 * @param defaults
 * @returns {*}
 */

export function queryObject( object, query, defaults = null ) {
    var current = object,
        queryParts = query.split("."),
        part;

    if ((object === null) || (object === undefined)) {
        return defaults;
    }

    while(current && (queryParts.length > 0)) {
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

export function promisify( promiseLike = null ) {
    if (promiseLike instanceof Promise) {
        return promiseLike;
    }

    if (typeof promiseLike === "function") {
        return promisify(promiseLike());
    }

    return new Promise(( resolve, reject ) => {
        promiseLike === false ? reject() : resolve(promiseLike);
    });
}

/**
 * Resolves one or more promise-likes
 *
 * @param {*} promiseLike
 * @returns {Promise}
 */
export function resolve( promiseLike ) {

    // Return if already promised
    if (promiseLike instanceof Promise) {
        return promiseLike;
    }

    var promises = [];

    if (promiseLike instanceof Array) {
        promiseLike.forEach(( promiseLikeEntry ) => {
            promises.push(promisify(promiseLikeEntry));
        });
    }
    else if(promiseLike && (typeof promiseLike === "object")) {
        Object.keys(promiseLike).forEach(( key ) => {
            promises.push(promisify(promiseLike[key]));
        });
    }
    else {
        return promisify(promiseLike);
    }

    return Promise.all(promises).then(( result ) => {
        if (promiseLike instanceof Array) {
            return result;
        }

        var response = {};
        Object.keys(promiseLike).forEach(( key, index ) => {
            response[key] = result[index];
        });

        return response;
    });
}

/**
 Returns the current unix timestamp in seconds
 */

export function now() {
    return Math.floor((typeof Date.now === "function" ? Date.now() : (new Date()).getTime()) / 1000);
}