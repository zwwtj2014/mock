/*
 * @Author: clam
 * @Date: 2017-11-12 00:20:18
 * @Last Modified by: clam
 * @Last Modified time: 2017-11-18 01:16:41
 */
'use strict'
const Layer = require('./layer');
const Route = require('./route');
const http = require('http');


class RouteBase {

    constructor() {
        http.METHODS.forEach(method => {
            method = method.toLowerCase();
            RouteBase.prototype[method] = (path, fn) => {
                let route = this.route(path);
                route[method].call(route, fn);
                return this;
            };
        });
    }

    use(fn, ...args) {
        let path = '/';

        if (typeof fn !== 'function') {
            path = fn;
            fn = args[0];
        }

        /**
         * 从这能看到普通路由和中间件的区别:
         * => 普通路由(app.METHOD(path,fn))放到Route中，且Router.route属性指向Route对象，Router.handle属性指向Route.dispatch函数；
         * => 中间件(app.use(path,fn))的Router.route属性为undefined，Router.handle指向中间件处理函数，被放到Router.stack数组中。
         */
        let layer = new Layer(path, fn);
        layer.route = undefined;
        this.stack.push(layer);
        return this;
    }

    handle(req, res, done) {
        let method = req.method;
        let idx = 0;

        /**
         * 这里的next函数起到遍历router里的stack的作用
         * => 即找同一个Route匹配的path的情况
         */
        let next = (err) => {
            let layerError = (err === 'route' ? null : err);

            // 跳过路由系统
            if (layerError === 'router') {
                return done(null);
            }

            if (idx >= this.stack.length || layerError) {
                return done(layerError);
            }

            let layer = this.stack[idx++];
            if (layer.match(req.url) && layer.route && layer.route.handlesMethod(method)) {
                return layer.handleReq(req, res, next);
            } else {
                next(layerError);
            }
        };

        next();

        // this.stack.forEach(router => {
        //     if (router.match(req.url) && router.route && router.route.handlesMethod(method)) {
        //         return router.handleReq(req, res);
        //     }
        // });
        // return this.stack[0].handleReq(res, res);
    }

    route(path) {
        let route = new Route(path);
        let layer = new Layer(path, route.dispatch.bind(route)); // router里的layer
        layer.route = route;
        this.stack.push(layer);
        return route;
    }
}

/**
 * 问题: 如果像下面的代码一样创建一个新的路由系统是无法让路由系统内部的逻辑生效的，因为这个路由系统没法添加到现有的系统中。
 *
 * ```
 * let app = express();
 * let router = express.Router();
 * router.use(function (req, res, next) {
 *  console.log('Time:', Date.now());
 * });
 * ```
 *
 * 答案: express将Router定义成一个特殊的中间件，而不是一个单独的类。这样可以直接使用下面的方式进行挂载:
 * ```
 * let app = express();
 * let router = express.Router();
 *
 * app.use('/',router);
 * ```
 */
// class Router extends RouteBase {

//     constructor() {
//         super();
//         this.stack = [];
//         return this.router;
//     }

//     router(req, res, next) {
//         Router.prototype.handle(req, res, next);
//     }
// }

module.exports = function () {
    function router(req, res, next) {
        router.handle(req, res, next);
    }

    Object.setPrototypeOf(router, new RouteBase());

    router.stack = [];
    return router;
};

// exports = module.exports = Router;