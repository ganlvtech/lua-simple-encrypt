const FileSaver = require('file-saver');
const LocalFileLoader = require('./LocalFileLoader');
const LuaSimpleXorEncrypt = require('./LuaSimpleXorEncrypt');

document.addEventListener("DOMContentLoaded", function (e) {
    document.getElementById('encrypt').addEventListener('click', function (e) {
        let elFiles = document.getElementById('files');
        if (elFiles.files[0]) {
            LocalFileLoader.readAsByteArray(elFiles.files[0], function (bytes, file) {
                let encrypted = LuaSimpleXorEncrypt.encrypt(bytes, document.getElementById('key').value, {
                    isGG: document.getElementById('is-gg').checked,
                    luaVersion: document.getElementById('lua-version').value
                });
                let blob = new Blob([encrypted], {type: "application/octet-stream"});
                FileSaver.saveAs(blob, file.name);
            });
        }
    });
});
