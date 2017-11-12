/*
 * @Author: clam
 * @Date: 2017-11-12 00:20:57
 * @Last Modified by: clam
 * @Last Modified time: 2017-11-12 00:46:21
 */

/**
 * Layer: 将路径一样的路由整合成一组，提高匹配路由的效率
 * @example
 *
 * //=> GET books/1 PUT books/1 DELETE books/1
 *
 * 每隔Layer含有三个变量: path/handle/route
 * -------------------------------------------------
 * |     0     |     1     |     2     |     3     |
 * ------------------------------------------------
 * | Layer     | Layer     | Layer     | Layer     |
 * |  |- path  |  |- path  |  |- path  |  |- path  |
 * |  |- handle|  |- handle|  |- handle|  |- handle|
 * |  |- route |  |- route |  |- route |  |- route |
 * -------------------------------------------------
 */

class Layer {

    constructor(path, fn) {
        this._path = path;
        this._name = fn.name || '<anonymous>';
        this._handle = fn;
    }

    handleReq(req, res) {
        if (this._handle) {
            this._handle(req, res);
        }
    }

    /**
     * 匹配路由
     */
    match(path) {
        return path === this._path || this._path === '*';
    }
}

exports = module.exports = Layer;