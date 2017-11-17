/*
 * @Author: clam
 * @Date: 2017-11-12 00:20:43
 * @Last Modified by: clam
 * @Last Modified time: 2017-11-18 00:01:51
 */
const App = require('./application');

function createApplication() {
    return new App();
}

exports = module.exports = createApplication;


/**
 *  ----- -----------        -------------
    |     | Layer     | ----> | Layer     |
    |  0  |   |-path  |       |  |- method|   route
    |     |   |-route |       |  |- handle|
    |-----|-----------|       -------------
    |     | Layer     |       -------------
    |  1  |   |-path  | ----> | Layer     |
    |     |   |-route |       |  |- method|   route
    |-----|-----------|       |  |- handle|
    |     | Layer     |       -------------
    |  2  |   |-path  |       -------------
    |     |   |-route | ----> | Layer     |
    |-----|-----------|       |  |- method|   route
    | ... |   ...     |       |  |- handle|
    ----- -----------        -------------
        router
 *
 */