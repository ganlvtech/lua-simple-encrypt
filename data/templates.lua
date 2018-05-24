-- Lua simple XOR encrypt by Ganlv
-- key = gg.prompt({"请输入密码："}, {""}, {"text"})
key = "把这里替换成密码"
-- load
local main = loadstring((function (bytes, key)
    -- http://lua-users.org/wiki/BitUtils
    function bxor(a, b)
        local r = 0
        for i = 0, 31 do
            local x = a / 2 + b / 2
            if x ~= math.floor(x) then
                r = r + 2 ^ i
            end
            a = math.floor(a / 2)
            b = math.floor(b / 2)
        end
        return r
    end

    local getDataBytes = function (bytes)
        local result = {}
        local i = 1
        local index = bytes[i]
        while (index >= 0) do
            result[i] = bytes[index + 1]
            i = i + 1
            index = bytes[i]
        end
        return result
    end

    local decode = function (bytes, key)
        if #key <= 0 then
            return {}
        end
        local i = 1
        local j = 1
        for i = 1, #bytes do
            bytes[i] = bxor(bytes[i], string.byte(key, j))
            j = j + 1
            if j > #key then
                j = 1
            end
        end
        return bytes
    end

    local bytesToString = function (bytes)
        local result = ""
        for i = 1, #bytes do
            result = result .. string.char(bytes[i])
        end
        return result
    end

    return bytesToString(decode(getDataBytes(bytes), key))
end)({
    -- data
}, key))
if main then
    main()
else
    print("密码错误")
end
