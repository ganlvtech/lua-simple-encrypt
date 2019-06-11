import {readAsByteArray} from './LocalFileLoader';
import luaSimpleXorEncrypt from './LuaSimpleXorEncrypt';
import {saveAs} from 'file-saver';

let elFile = document.getElementById('file');
let elEncrypt = document.getElementById('encrypt');
let elFileName = document.getElementById('file-name');
let elKey = document.getElementById('key');
let elSettings = document.getElementById('settings');

elFile.addEventListener('change', function () {
  if (elFile.files[0]) {
    elFileName.textContent = elFile.files[0].name;
  }
});

elEncrypt.addEventListener('click', function () {
  if (elFile.files[0]) {
    let options = {
      isGG: false,
      isLua52: false
    };
    switch (elSettings.value) {
      case 'gg':
        options.isGG = true;
        options.isLua52 = true;
        break;
      case '52':
        options.isLua52 = true;
        break;
    }
    readAsByteArray(elFile.files[0], function (bytes, file) {
      let encrypted = luaSimpleXorEncrypt(bytes, elKey.value, options);
      let blob = new Blob([encrypted], {type: 'application/octet-stream'});
      saveAs(blob, file.name);
    });
  }
});
