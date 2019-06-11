function simpleXorEncrypt(bytes, key) {
  let result = [];
  let j = 0;
  for (let i = 0; i < bytes.length; ++i) {
    result[i] = bytes[i] ^ key.charCodeAt(j);
    ++j;
    if (j >= key.length) {
      j = 0;
    }
  }
  return result;
}

export default simpleXorEncrypt;
