// Copied and stripped down from https://github.com/SteveRidout/readlang-api

var readlang = {};

var config;
readlang.setup = function (_config) {
  config = _config;
};

readlang.url = function(path) {
  return config.baseURL + path
}

readlang.buildApiRequest = (method, path, others) => Object.assign({
  method,
  url: readlang.url(`/api${path}`),
  headers: {
    Authorization: `Bearer ${localStorage.getItem('readlang.access_token')}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
}, others)

// Authorization access token
// --------------------------

var accessToken = localStorage.getItem('readlang.access_token');

// Read the access token if present in the window hash,
// and write it to localStorage so it's not quite so visible
var tokenMatch = /token=(.*)/.exec(window.location.hash);
if (tokenMatch) {
  accessToken = decodeURIComponent(tokenMatch[1]);
  localStorage.setItem('readlang.access_token', accessToken);
  window.location.hash = "";
}

// Redirects to auth page without warning
readlang.requestAuth = function (force) {
  if (accessToken && !force) {
    return
  }

  window.location.href = readlang.url('/oauth?response_type=token&client_id=' + config.APIKey +
    '&redirect_uri=' + encodeURIComponent(window.location.href) + '&scope=words')
};

// TODO: pass in config for these
readlang.setup({
  baseURL: "https://readlang.com",
  APIKey: "youtube2readlang"
})

export default readlang;
