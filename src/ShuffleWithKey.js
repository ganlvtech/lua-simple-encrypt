const _ = require('lodash');
const jsencrypt = require('jsencrypt');
const JSEncrypt = jsencrypt.JSEncrypt;

function keyEncrypt(key) {
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(
        '-----BEGIN PUBLIC KEY-----\n' +
        'MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgH5QQw7WPEowArtgXJ44cVLSqeMH\n' +
        'o3js/MNm4u4gFJXB3lrbAhtU3QPj39kEkNSp7ji5E7jvEiz4HmKryTIaONwKBXpU\n' +
        '1OBboGYsXpdio78AAVHRAXEpNPphVN7GQE05UqVRzlZLjBfgv42sAUB5+iCF0T1R\n' +
        'g/uimzFodQYPLdutAgMBAAE=\n' +
        '-----END PUBLIC KEY-----'
    );
    let h = encrypt.getKey().encrypt(key);
    let result = [];
    for (let i = 0; i < h.length; i += 2) {
        result.push(parseInt(h.substr(i, 2), 16));
    }
    return result;
}

function shuffleWithKey(bytes, key) {
    let result = [];
    let keyBytes = keyEncrypt(key);
    let resultLen = bytes.length + keyBytes.length;
    let shuffleIndices = _.shuffle(_.range(resultLen));
    let byteIndices = [];
    let keyByteIndices = _.sortBy(_.sampleSize(_.range(resultLen), keyBytes.length));
    let j = 0;
    for (let i = 0; i < resultLen; ++i) {
        let resultIndex = shuffleIndices[i];
        let keyByteIndex = _.indexOf(keyByteIndices, resultIndex);
        if (keyByteIndex >= 0) {
            result[resultIndex] = keyBytes[keyByteIndex];
        } else {
            result[resultIndex] = bytes[j++];
            byteIndices.push(resultIndex);
        }
    }
    return [result, byteIndices];
}

function joinShuffleResult(shuffleResult) {
    let bytes = shuffleResult[0], byteIndices = shuffleResult[1];
    let byteIndicesLen = byteIndices.length;
    byteIndices = _.map(byteIndices, function (index) {
        return index + byteIndicesLen + 1;
    });
    byteIndices.push(-1);
    return _.concat(byteIndices, bytes);
}

function shuffle(bytes, key) {
    return joinShuffleResult(shuffleWithKey(bytes, key));
}

exports.shuffle = shuffle;

function unshuffle(shuffled) {
    let i = 0;
    let index;
    let bytes = [];
    while ((index = shuffled[i++]) >= 0) {
        bytes.push(shuffled[index]);
    }
    return bytes;
}

exports.unshuffle = unshuffle;
