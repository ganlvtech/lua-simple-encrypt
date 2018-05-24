const SimpleXorEncrypt = require('./SimpleXorEncrypt');
const ShuffleWithKey = require('./ShuffleWithKey');
const compareVersion = require('compare-version');
const luamin = require('luamin');

const templates = {
    credit: '-- Lua simple XOR encrypt by Ganlv\n',
    main: 'local main = ',
    decoder: '((function (bytes, key)\n' +
    '    -- http://lua-users.org/wiki/BitUtils\n' +
    '    function bxor(a, b)\n' +
    '        local r = 0\n' +
    '        for i = 0, 31 do\n' +
    '            local x = a / 2 + b / 2\n' +
    '            if x ~= math.floor(x) then\n' +
    '                r = r + 2 ^ i\n' +
    '            end\n' +
    '            a = math.floor(a / 2)\n' +
    '            b = math.floor(b / 2)\n' +
    '        end\n' +
    '        return r\n' +
    '    end\n' +
    '\n' +
    '    local getDataBytes = function (bytes)\n' +
    '        local result = {}\n' +
    '        local i = 1\n' +
    '        local index = bytes[i]\n' +
    '        while (index >= 0) do\n' +
    '            result[i] = bytes[index + 1]\n' +
    '            i = i + 1\n' +
    '            index = bytes[i]\n' +
    '        end\n' +
    '        return result\n' +
    '    end\n' +
    '\n' +
    '    local decode = function (bytes, key)\n' +
    '        if #key <= 0 then\n' +
    '            return {}\n' +
    '        end\n' +
    '        local i = 1\n' +
    '        local j = 1\n' +
    '        for i = 1, #bytes do\n' +
    '            bytes[i] = bxor(bytes[i], string.byte(key, j))\n' +
    '            j = j + 1\n' +
    '            if j > #key then\n' +
    '                j = 1\n' +
    '            end\n' +
    '        end\n' +
    '        return bytes\n' +
    '    end\n' +
    '\n' +
    '    local bytesToString = function (bytes)\n' +
    '        local result = ""\n' +
    '        for i = 1, #bytes do\n' +
    '            result = result .. string.char(bytes[i])\n' +
    '        end\n' +
    '        return result\n' +
    '    end\n' +
    '\n' +
    '    return bytesToString(decode(getDataBytes(bytes), key))\n' +
    'end)({',
    decoderEnd: '}, key))\n' +
    'if main then\n' +
    '    main()\n' +
    'else\n' +
    '    ',
    keyWrongAlertEnd: '\n' +
    'end'
};

function parseOptions(options) {
    if (options.isGG) {
        if (!options.luaVersion) {
            options.luaVersion = '5.2';
        }
        if (!options.keyInputCode) {
            options.keyInputCode = 'key = gg.prompt({"请输入密码："}, {""}, {"text"})[0]\n';
        }
        if (!options.keyWrongAlertCode) {
            options.keyWrongAlertCode = 'gg.alert("密码错误")';
        }
    }
    if (!options.luaVersion) {
        options.luaVersion = '5.1';
    }
    if (!options.keyInputCode) {
        options.keyInputCode = 'key = "把这里替换成密码"\n';
    }
    if (compareVersion(options.luaVersion, '5.2') < 0) {
        options.loadFunction = 'loadstring';
    } else {
        options.loadFunction = 'load';
    }
    if (!options.keyWrongAlertCode) {
        options.keyWrongAlertCode = 'print("密码错误")';
    }
    return options;
}

function encrypt(bytes, key, options = {}) {
    options = parseOptions(options);
    let encryptedBytes = ShuffleWithKey.shuffle(SimpleXorEncrypt.encrypt(bytes, key), key);
    let code = options.keyInputCode
        + templates.main
        + options.loadFunction
        + templates.decoder
        + encryptedBytes.join(',')
        + templates.decoderEnd
        + options.keyWrongAlertCode
        + templates.keyWrongAlertEnd;
    return templates.credit
        + luamin.minify(code);
}

exports.encrypt = encrypt;