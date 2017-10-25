import xml2js from 'xml2js'

export default function timedtext2readlang(transcriptXmlString, callback) {
  xml2js.parseString(transcriptXmlString, (err, result) => {
    const book = {
      plainText: '',
      htmlMarkup: false,
      generatedVersion: 0,
      audioMap: [],
    }

    let wordCount = 0

    result.transcript.text.forEach((t) => {
      console.log(t._)
      book.plainText += t._ + "\n\n"
      book.audioMap.push({t: parseFloat(t.$.start), w: wordCount})
      wordCount += t._.split(" ").length
    })

    callback(book)
  })
}
