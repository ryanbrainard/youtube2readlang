import queryString from 'query-string'
import xml2js from 'xml2js'
import {supportedLanguages} from './languages'

const apiKey = 'AIzaSyDYzJX4JLJ7JHF8Ki_CW5mz9Om_fEWD7a4'

function buildApiV3Request(method, path, params, others) {
  params.key = apiKey
  return Object.assign({
    method,
    url:`https://www.googleapis.com/youtube/v3${path}?${queryString.stringify(params)}`,
  }, others)
}

function getVideoTimedTextRequest(v, lang, others) {
  return Object.assign({
    method: 'GET',
    url: `https://www.youtube.com/api/timedtext?${queryString.stringify({
      v, 
      lang, 
      name: supportedLanguages[lang] // required for some reason on some videos
    })}`,
    headers: {
      'Content-Type': undefined
    },
    handleResponse: handleXmlResponse
  }, others)
}

function handleXmlResponse(response) {
  if (response.headers.get('content-length') === '0' || response.status === 204) {
    return
  }

  const textPromise = response.text()
  if (response.ok) {
    return new Promise((resolve, reject) => {
      textPromise.then((text) => {
        xml2js.parseString(text, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
    })
  } else {
    return textPromise.then(cause => Promise.reject(new Error((cause))))
  }
}

export default {
  buildApiV3Request,
  getVideoTimedTextRequest
}
