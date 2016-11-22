"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = bootstrap;

var _application = require("./application");

var _application2 = _interopRequireDefault(_application);

var _queryObject = require("./query-object");

var _queryObject2 = _interopRequireDefault(_queryObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
Dependencies
 */

function bootstrap() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var callback = arguments[1];

    (function () {

        try {
            var app = new _application2.default(options);

            // Register modules
            if (typeof callback === "function") {
                callback(app);
            }

            // Boot
            app.boot();

            return app;
        } catch (error) {
            if ((0, _queryObject2.default)(options, "debug", true)) {
                console.error(error);
            }
        }
    })();
}