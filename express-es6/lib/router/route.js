const Layer = require('./layer');

class Route {
    constructor(path) {
        this.path = path;
        this.stack = [];
        this.methods = {};
    }

    handlesMethod(method) {
        let name = method.toLowerCase();
        return Boolean(this.methods[name]);
    }

    get(fn) {
        let layer = new Layer('/', fn);
        layer.method = 'get';
        this.methods['get'] = true;
        this.stack.push(layer);
        return this;
    }

    dispatch(req, res) {
        let method = req.method.toLowerCase();

        for (let i = 0, len = this.stack.length; i < len; i++) {
            if (method === this.stack[i].method) {
                return this.stack[i].handleReq(req, res);
            }
        }
    }
}

exports = module.exports = Route;