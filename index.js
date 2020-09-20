'use strict';
const ResizeImage = require('./lib/resize-image');
module.exports = class ResizeImagePlugin {
    constructor(options){
        this.options = options;
    }

    apply(compiler) {
        //get the options of webpack.config.js
        const distWebpackDir = compiler.options.output.path;
        const resizeImage = new ResizeImage(this.options,distWebpackDir);
        resizeImage.process();   
    }
}