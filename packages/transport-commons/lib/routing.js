"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const radix_router_1 = __importDefault(require("radix-router"));
const commons_1 = require("@feathersjs/commons");
exports.ROUTER = Symbol('@feathersjs/transport-commons/router');
exports.routing = () => (app) => {
    if (typeof app.lookup === 'function') {
        return;
    }
    const router = new radix_router_1.default();
    Object.assign(app, {
        [exports.ROUTER]: router,
        lookup(path) {
            if (!path) {
                return null;
            }
            return this[exports.ROUTER].lookup(commons_1.stripSlashes('' + path) || '/');
        }
    });
    // Add a mixin that registers a service on the router
    app.mixins.push((service, path) => {
        // @ts-ignore
        app[exports.ROUTER].insert({ path, service });
        // @ts-ignore
        app[exports.ROUTER].insert({
            path: `${path}/:__id`,
            service
        });
    });
};
//# sourceMappingURL=routing.js.map