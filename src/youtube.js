import queryString from 'query-string'
import xml2js from 'xml2js'
import {supportedLanguages} from './languages'

const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY

function buildApiV3Request(method, path, params, others) {
  params.key = apiKey
  return Object.assign({
    method,
    url:`https://www.googleapis.com/youtube/v3${path}?${queryString.stringify(params)}`,
  }, others)
}

function getVideoTimedTextRequest(v, lang, others) {
  return _getVideoTimedTextRequest(v, lang, '', Object.assign(others, {
    catch: () => _getVideoTimedTextRequest(v, lang, supportedLanguages[lang], others)
  }))
}

function _getVideoTimedTextRequest(v, lang, name, others) {
  return Object.assign({
    method: 'GET',
    url: `https://www.youtube.com/api/timedtext?${queryString.stringify({
      v, 
      lang, 
      name // required for some reason on some videos, so do crazy `catch` above
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
          } else if (!result) {
            reject('null xml result')
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
