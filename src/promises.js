import {Promise} from "es6-promise";

export {
    promisify,
    promises
};

/**
 * Transform everything into a promise
 *
 * @param {*} promiseLike
 * @returns {Promise}
 */

function promisify(promiseLike = null) {
    if (promiseLike instanceof Promise) {
        return promiseLike;
    }

    if (typeof promiseLike === "function") {
        return promisify(promiseLike());
    }

    return new Promise((resolve, reject) => {
        promiseLike === false ? reject() : resolve(promiseLike);
    });
}

/**
 * Resolves one or more promise-likes
 *
 * @param {*} promiseLike
 * @returns {Promise}
 */
function promises(promiseLike) {

    // Return if already promised
    if (promiseLike instanceof Promise) {
        return promiseLike;
    }

    var promises = [];

    if (promiseLike instanceof Array) {
        promiseLike.forEach((promiseLikeEntry) => {
            promises.push(promisify(promiseLikeEntry));
        });
    }
    else if (promiseLike && (typeof promiseLike === "object")) {
        Object.keys(promiseLike).forEach((key) => {
            promises.push(promisify(promiseLike[key]));
        });
    }
    else {
        return promisify(promiseLike);
    }

    return Promise.all(promises).then((result) => {
        if (promiseLike instanceof Array) {
            return result;
        }

        var response = {};
        Object.keys(promiseLike).forEach((key, index) => {
            response[key] = result[index];
        });

        return response;
    });
}
