// Copied and stripped down from https://github.com/SteveRidout/readlang-api

const tokenKey = 'readlang.access_token'

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
    Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  handleResponse: function(response) { // TODO: this shouldn't be needed, but react-refetch isn't reseting to default after XML override
    if (response.headers.get('content-length') === '0' || response.status === 204) {
      return
    }

    const json = response.json()
    if (response.ok) {
      return json
    } else {
      return json.then(cause => Promise.reject(cause))
    }
  }
}, others)

// Authorization access token
// --------------------------

var accessToken = localStorage.getItem(tokenKey);

// Read the access token if present in the window hash,
// and write it to localStorage so it's not quite so visible
var tokenMatch = /token=(.*)/.exec(window.location.hash);
if (tokenMatch) {
  accessToken = decodeURIComponent(tokenMatch[1]);
  localStorage.setItem(tokenKey, accessToken);
  window.location.hash = "";
}

readlang.isLoggedIn = function () {
  return !!localStorage.getItem(tokenKey);
};

// Redirects to auth page without warning
readlang.login = function (force) {
  if (accessToken && !force) {
    return
  }

  window.location.href = readlang.url('/oauth?response_type=token&client_id=' + config.APIKey +
    '&redirect_uri=' + encodeURIComponent(window.location.href) + '&scope=words')
};

readlang.logout = function () {
  localStorage.removeItem(tokenKey);
};

// TODO: pass in config for these
readlang.setup({
  baseURL: "https://readlang.com",
  APIKey: process.env.REACT_APP_READLANG_API_KEY
})

export default readlang;
