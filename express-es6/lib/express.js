/*
 * @Author: clam
 * @Date: 2017-11-12 00:20:43
 * @Last Modified by: clam
 * @Last Modified time: 2017-11-12 00:35:01
 */
const App = require('./application');

function createApplication() {
    return new App();
}

exports = module.exports = createApplication;