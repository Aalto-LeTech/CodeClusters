-- Based on: https://medium.com/@tumulr/building-an-api-gateway-with-nginx-lua-e3dff45e6e63

local jwt = require "resty.jwt"
local validators = require "resty.jwt-validators"

function stringify_table(o)
  if type(o) == 'table' then
    local s = '{ '
    for k,v in pairs(o) do
      if type(k) ~= 'number' then k = '"'..k..'"' end
      s = s .. '['..k..'] = ' .. stringify_table(v) .. ','
    end
    return s .. '} '
  else
    return tostring(o)
  end
end

if ngx.var.request_method ~= "OPTIONS" and not string.match(ngx.var.uri, "login") then
  local authHeader = ngx.var.http_Authorization

  if authHeader == nil or string.sub(authHeader, 1, 6) ~= 'Bearer' then
    ngx.status = ngx.HTTP_UNAUTHORIZED
    ngx.header.content_type = "application/json; charset=utf-8"
    ngx.say("{\"error\": \"No Authorization header with Bearer JWT token\"}")
    ngx.exit(ngx.HTTP_UNAUTHORIZED)
  end

  local claim_spec = {
    exp = validators.is_not_expired()
  }
  local jwtSecret = 'verylongrandomstring'
  local jwt_obj = jwt:verify(jwtSecret, string.sub(authHeader, 8), claim_spec)

  if not jwt_obj["verified"] then
    ngx.status = ngx.HTTP_UNAUTHORIZED
    ngx.header.content_type = "application/json; charset=utf-8"
    ngx.say(string.format("{\"error\": \"JWT invalid\", \"jwt_obj\": \"%s\" }", stringify_table(jwt_obj)))
    ngx.exit(ngx.HTTP_UNAUTHORIZED)
  end
end
