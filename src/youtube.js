import queryString from 'query-string'

const apiKey = 'AIzaSyDYzJX4JLJ7JHF8Ki_CW5mz9Om_fEWD7a4'

function buildApiRequest(method, path, params, extras) {
  params.key = apiKey
  return Object.assign({
    method,
    url:`https://www.googleapis.com/youtube/v3${path}?${queryString.stringify(params)}`,
  }, extras)
}

export default { buildApiRequest }
