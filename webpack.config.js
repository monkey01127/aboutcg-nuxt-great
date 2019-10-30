const path = require('path');
module.exports = {
    resolve: {
        // for WebStorm
        alias: {
            '@': path.join(path.resolve(__dirname), '/'),
            '~': path.join(path.resolve(__dirname), '/')
        }
    }
};
