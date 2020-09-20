//libs
const ResizeImagePlugin = require('../lib/resize-image');
const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
//const
const distDir = './spec/mock/dist';
const distDirImages = distDir + "/images";
//variables
let testDefaultSizeAndAlgorith = null;
let testCustomSizeExcludeAndCopyOriginal = null;
//functions
function inizializaPlugin() {
    testDefaultSizeAndAlgorith = new ResizeImagePlugin(
        {
            patterns: [
                {
                    from: "./spec/mock/images1",
                    to: "images",
                    resizeAlgorith: 'bicubicInterpolation',
                }
            ],
            resizeAlgorith: 'bezierInterpolation',
            copyOriginal: false,
            noDefaultSize: false,
            sizes: [
                {suffix: 'peq',size: 20},
                {suffix: 'big',size: 1200}
            ]
        },distDir
    );
    testCustomSizeExcludeAndCopyOriginal = new ResizeImagePlugin(
        {
            patterns: [
                {
                    from: "./spec/mock/images2",
                    to: "images",
                    //no x.gif y no jpgs
                    exclude: ['a.gif','b.gif',/\.jpg$/],
                    copyOriginal: true,
                }
            ],
            resizeAlgorith: 'bezierInterpolation',
            copyOriginal: false,
            noDefaultSize: true,
            sizes: [
                {suffix: 'peq',size: 20},
                {suffix: 'big',size: 800}
            ]
        },distDir
    );
}
//tests
describe('Main Test', () => {
    beforeAll(() => {
        inizializaPlugin();
        fsExtra.emptyDirSync(distDirImages);
    });
    beforeEach(() => {
    });
    afterEach(() => {
        //fsExtra.emptyDirSync(distDirImages);
    });
    test('test Default Size And Algorith ', async () => {
        await testDefaultSizeAndAlgorith.process().then(data => {
            console.log("data");
            console.log(data);
            expect(data).toStrictEqual([true]);

        });
    });
    test('test Custom Size,Exclude and copy Original', async () => {
        await testCustomSizeExcludeAndCopyOriginal.process().then(data => expect(data).toStrictEqual([true]));
    });
});