import { timedtext2readlangAsync } from './timedtext2readlang'

const sampleXml = `<transcript>
  <text start="2.71" dur="1.7">예전에 &quot;영화에서  봤는데 ... </text>
  <text start="6.923" dur="1.53">이렇게 앉아있으니까</text>
</transcript>`

const sampleBook = {
  plainText: '예전에 "영화에서  봤는데 ...\n\n이렇게 앉아있으니까\n\n',
  htmlMarkup: false,
  generatedVersion: 0,
  audioMap: [
    {
      t: 2.71,
      w: 0,
    },
    {
      t: 6.923,
      w: 3,
    },
  ],
}

it('converts timedTextXML to audioMap', done => {
  timedtext2readlangAsync(sampleXml, response => {
    expect(response).toEqual(sampleBook)
    done()
  })
})
