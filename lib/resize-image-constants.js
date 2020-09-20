const SUFFIX_SEPARATOR = '-';
const SIZES = [
    {
        suffix: 'icon',
        size: 50
    },
    {
        suffix: 'xs',
        size: 150
    },
    {
        suffix: 'md',
        size: 500
    },
    {
        suffix: 'lg',
        size: 750
    }
];
const ALLOWED_EXTENSIONS = [
    '.jpg','.png',
    '.gif','.bmp',
    '.tiff','.jpeg'
];

module.exports = {
    SUFFIX_SEPARATOR,
    SIZES,
    ALLOWED_EXTENSIONS
};