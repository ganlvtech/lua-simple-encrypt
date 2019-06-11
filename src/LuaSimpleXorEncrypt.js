import utf8 from 'utf8';
import luamin from 'luamin';
import simpleXorEncrypt from './SimpleXorEncrypt';
import shuffleWithKey from './ShuffleWithKey';
import templates from './templates';

function luaSimpleXorEncrypt(bytes, key, options = {}) {
  let encrypted = simpleXorEncrypt(bytes, utf8.encode(key));
  let shuffled = shuffleWithKey(encrypted, key);
  let code = (options.isGG ? templates.keyInputCodeGG : templates.keyInputCode)
    + templates.main
    + (options.isLua52 ? templates.load : templates.loadstring)
    + templates.decoder
    + shuffled.join(',')
    + templates.decoderEnd
    + (options.isGG ? templates.keyWrongAlertCodeGG : templates.keyWrongAlertCode)
    + templates.keyWrongAlertEnd;
  return templates.credit
    + luamin.minify(code);
}

export default luaSimpleXorEncrypt;
