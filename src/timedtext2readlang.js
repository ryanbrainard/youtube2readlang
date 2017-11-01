import xml2js from 'xml2js'

export function timedtext2readlangAsync(transcriptXmlString, callback) {
  xml2js.parseString(transcriptXmlString, (err, result) => {
    callback(timedtext2readlangSync(result))
  })
}

export function timedtext2readlangSync(result) {
  const book = {
    plainText: '',
    htmlMarkup: false,
    generatedVersion: 0,
    audioMap: [],
  }

  let wordCount = 0

  result.transcript.text.forEach((t) => {
    const line = decode((t._ || '').trim())
    book.plainText += line + "\n\n"
    book.audioMap.push({t: parseFloat(t.$.start), w: wordCount})
    const words = line.split(/[\s."]+/).filter(s => s.length > 0) // TODO: match with Readlang calculation
    wordCount += words.length
    console.log({line, words, wordCount})
  })

  return book
}

function decode(str) {
  return new DOMParser().parseFromString('<!doctype html><body>' + str, 'text/html').body.textContent;
}
