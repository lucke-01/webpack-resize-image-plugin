const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const constants = require('./resize-image-constants');
class ResizeImage {
    
    constructor(options,outputPath){
        let defaultOption = {
            copyOriginal: true,
            noDefaultSize: false,
            sizes: [],
            resizeAlgorith: Jimp.RESIZE_BILINEAR
        };
        this.options = Object.assign(defaultOption,options);
        if (this.options.noDefaultSize == false) { 
            this.options.sizes =  this.options.sizes.concat(constants.SIZES);
        }
        this.outputPath = outputPath;
    }
    process() {
        //TODO: hacer que process devuelva una promesa para ser mas sencillo de manejar ej: tests: https://stackoverflow.com/a/18983245/6207773
        let patternsProcesados = this.options.patterns.map((pattern) => {
            return new Promise((resolve) => {
                this.processPattern(pattern,resolve);
              });
        });
        return Promise.all(patternsProcesados);
        /*this.options.patterns.forEach((pattern) => {
            this.processPattern(pattern);
        });*/
    }
    processPattern(pattern,resolve) {
        const resizeAlgorith = pattern.resizeAlgorith != null ? pattern.resizeAlgorith : this.options.resizeAlgorith;
        const copyOriginal = pattern.copyOriginal != null ? pattern.copyOriginal : this.options.copyOriginal;

        //each file of pattern
        fs.readdir(path.resolve(pattern.from),(err,files) => {
            // On error, show it and return
            if (err) {
                return console.error(err);
            }
            //process files
            let procesedFiles = 0;
            let filesToProcess = files.length+1;
            files.forEach((fileName) => {
                //check file extension
                let fileExtension = path.extname(fileName).toLowerCase();
                if (!constants.ALLOWED_EXTENSIONS.includes(fileExtension)) {
                    procesedFiles++;
                    console.warn('Error Processing file extension: '+fileExtension+' not allowed');
                    if (procesedFiles == filesToProcess) {
                        resolve(true);
                    }
                    return;
                }
                //check if file is processed or not.
                let toProcessFile = true;
                if (pattern.exclude != null) {
                    let patternExclude = pattern.exclude.map(exclude=>exclude instanceof RegExp ? exclude.toString().slice(1,-1) : exclude);
                    let allPatternsExclude = new RegExp(patternExclude.join('|'));
                    if (allPatternsExclude.test(fileName)) {
                        toProcessFile = false;
                    }
                }
                if (toProcessFile == true) {
                    const pathFileInput = path.resolve(pattern.from,fileName);
                    //copy original image
                    if (copyOriginal == true) {
                        fs.copyFile(pathFileInput,  path.resolve(this.outputPath,pattern.to,fileName), (err) => {
                            procesedFiles++;
                            
                            if (err) {
                                console.error("Error copying original image: "+err);
                                console.error(err);
                            }
                            if (procesedFiles == filesToProcess) {
                                resolve(true);
                            }
                        });
                    }
                    console.log('pathFileInput');
                    console.log(pathFileInput);
                    Jimp.read(pathFileInput).then(fileJimp => {
                        console.log('fileJimp');
                        console.log(fileJimp);
                        const fileJimpWidth = fileJimp.bitmap.width;
                        const fileJimpHeight = fileJimp.bitmap.height;
                        const higherSize = (fileJimpWidth > fileJimpHeight == true) ? fileJimpWidth : fileJimpHeight;
                        this.options.sizes.forEach(size => {
                            //only process sizes minor than higherSize
                            if (size.size < higherSize) {
                                const fileNameSuffixed = path.parse(fileName).name + constants.SUFFIX_SEPARATOR +size.suffix+path.parse(fileName).ext;
                                const pathFileOutputSuffixed = path.resolve(this.outputPath,pattern.to,fileNameSuffixed);
                                if (fileJimpWidth > fileJimpHeight) {
                                    fileJimp = fileJimp.resize(size.size, Jimp.AUTO,resizeAlgorith);
                                } else {
                                    fileJimp = fileJimp.resize(Jimp.AUTO,size.size,resizeAlgorith);
                                }
                                return fileJimp.write(pathFileOutputSuffixed,
                                            ()=>{
                                                procesedFiles++;
                                                if (procesedFiles == filesToProcess) {
                                                    resolve(true);
                                                }
                                            });
                            }
                        });
                    }).catch(err => {
                        console.error('Error processing image: ');
                        console.error(err);
                        procesedFiles++;
                        if (procesedFiles == filesToProcess) {
                            resolve(true);
                        }
                    });
                } else {
                    procesedFiles++;
                    if (procesedFiles == filesToProcess) {
                        resolve(true);
                    }
                }
            });
        });
    }
}
module.exports = ResizeImage;