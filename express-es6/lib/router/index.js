/*
 * @Author: clam
 * @Date: 2017-11-12 00:20:18
 * @Last Modified by: clam
 * @Last Modified time: 2017-11-12 22:33:26
 */
'use strict'
const Layer = require('./layer');
const Route = require('./route');

class Router {

    constructor() {
        let commonLayer = new Layer('*', (req, res) => {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('404');
        });
        this.stack = [commonLayer];
    }

    get(path, fn) {
        let route = this.route(path);
        route.get(fn);
        return this;
    }

    handle(req, res) {
        let method = req.method;
        this.stack.forEach(router => {
            if (router.match(req.url) && router.route && router.route.handlesMethod(method)) {
                return router.handleReq(req, res);
            }
        });
        return this.stack[0].handleReq(res, res);
    }

    route(path) {
        let route = new Route(path);
        let layer = new Layer(path, (req, res) => {
            route.dispatch(req, res);
        });
        layer.route = route;
        this.stack.push(layer);
        return route;
    }
}

exports = module.exports = Router;