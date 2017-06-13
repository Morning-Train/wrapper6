import {Promise} from "es6-promise";
export {
    ready
};

/**
 * document.ready
 *
 * @param callback
 * @returns {Promise<U>|*|Promise.<TResult>}
 */
function ready(callback = null) {
    let promise = new Promise((resolve) => {
        if (document.readyState === "complete") {
            return resolve();
        }

        document.addEventListener("DOMContentLoaded", () => {
            resolve();
        });
    });

    return (typeof callback === "function") ?
        promise.then(callback) :
        promise;
}