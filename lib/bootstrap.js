/*
Dependencies
 */

import Application from "./application";
import queryObject from "./query-object";


export default function bootstrap( options = {}, callback ) {
    (function() {

        try {
            var app = new Application(options);

            // Register modules
            if (typeof callback === "function") {
                callback(app);
            }

            // Boot
            app.boot();

            return app;

        }
        catch( error ) {
            if (queryObject(options, "debug", true)) {
                console.error(error);
            }
        }

    }) ();
}