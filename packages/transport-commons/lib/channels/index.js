"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const lodash_1 = require("lodash");
const combined_1 = require("./channel/combined");
const mixins_1 = require("./mixins");
exports.keys = mixins_1.keys;
const debug = debug_1.default('@feathersjs/transport-commons/channels');
const { CHANNELS, PUBLISHERS, ALL_EVENTS } = mixins_1.keys;
function channels() {
    return (app) => {
        if (typeof app.channel === 'function' && typeof app.publish === 'function') {
            return;
        }
        Object.assign(app, mixins_1.channelMixin(), mixins_1.publishMixin());
        Object.defineProperty(app, 'channels', {
            get() {
                return Object.keys(this[CHANNELS]);
            }
        });
        app.mixins.push((service, path) => {
            if (typeof service.publish === 'function' || !service._serviceEvents) {
                return;
            }
            Object.assign(service, mixins_1.publishMixin());
            // @ts-ignore
            service._serviceEvents.forEach((event) => {
                service.on(event, function (data, hook) {
                    if (!hook) {
                        // Fake hook for custom events
                        hook = { path, service, app, result: data };
                    }
                    debug('Publishing event', event, hook.path);
                    const servicePublishers = service[PUBLISHERS];
                    const appPublishers = app[PUBLISHERS];
                    // This will return the first publisher list that is not empty
                    // In the following precedence
                    const callback = [
                        // 1. Service publisher for a specific event
                        lodash_1.get(servicePublishers, event),
                        // 2. Service publisher for all events
                        lodash_1.get(servicePublishers, ALL_EVENTS),
                        // 3. App publishers for a specific event
                        lodash_1.get(appPublishers, event),
                        // 4. App publishers for all events
                        lodash_1.get(appPublishers, ALL_EVENTS)
                    ].find(current => typeof current === 'function') || lodash_1.noop;
                    Promise.resolve(callback(data, hook)).then(result => {
                        if (!result) {
                            return;
                        }
                        const results = Array.isArray(result) ? lodash_1.compact(lodash_1.flattenDeep(result)) : [result];
                        const channel = new combined_1.CombinedChannel(results);
                        if (channel && channel.length > 0) {
                            app.emit('publish', event, channel, hook, data);
                        }
                        else {
                            debug('No connections to publish to');
                        }
                    });
                });
            });
        });
    };
}
exports.channels = channels;
//# sourceMappingURL=index.js.map