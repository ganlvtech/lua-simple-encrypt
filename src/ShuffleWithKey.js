import JSEncrypt from 'jsencrypt';
import {range, sampleSize} from 'lodash';

function keyEncrypt(key) {
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(`-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgH5QQw7WPEowArtgXJ44cVLSqeMH
o3js/MNm4u4gFJXB3lrbAhtU3QPj39kEkNSp7ji5E7jvEiz4HmKryTIaONwKBXpU
1OBboGYsXpdio78AAVHRAXEpNPphVN7GQE05UqVRzlZLjBfgv42sAUB5+iCF0T1R
g/uimzFodQYPLdutAgMBAAE=
-----END PUBLIC KEY-----`);
    let h = encrypt.getKey().encrypt(key);
    let result = [];
    for (let i = 0; i < h.length; i += 2) {
        result.push(parseInt(h.substr(i, 2), 16));
    }
    return result;
}

function shuffleWithKey(bytes, key) {
    let keyBytes = keyEncrypt(key);
    let result = new Array(bytes.length + 1 + keyBytes.length + bytes.length);
    result[bytes.length] = -1;
    let bytesIndices = sampleSize(range(keyBytes.length + bytes.length), bytes.length);
    for (let i = 0; i < bytes.length; i++) {
        result[i] = bytes.length + 1 + bytesIndices[i];
        result[result[i]] = bytes[i];
    }
    let j = 0;
    for (let i = bytes.length + 1; i < result.length; i++) {
        if (result[i] === undefined) {
            result[i] = keyBytes[j];
            j++;
        }
    }
    return result;
}

function unshuffle(shuffled) {
    let i = 0;
    let index;
    let bytes = [];
    while ((index = shuffled[i++]) >= 0) {
        bytes.push(shuffled[index]);
    }
    return bytes;
}

export default shuffleWithKey;
