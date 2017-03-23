'use strict';

/**
 * Converts a given string to Base64 encoding.
 * @param {String} str - String to be converted
 * @returns {String} String encoded in Base64.
 */
const toBase64 = (str) => {
    return Buffer.from(str).toString('base64');
};

/**
 * Converts a given Base64 string to UTF-8
 * @param {String} str - Base64 string to be decoded
 * @returns {String} The original decoded string.
 */
const fromBase64 = (str) => {
    return Buffer.from(str, 'base64').toString();
};

module.exports = {
    toBase64: toBase64,
    fromBase64: fromBase64
};