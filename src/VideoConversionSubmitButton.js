import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import { connect } from 'react-refetch'
import PromiseStateContainer from './PromiseStateContainer'
import youtube from './youtube'
import readlang from './readlang'
import { timedtext2readlangSync } from './timedtext2readlang'

class ConversionSubmitButton extends Component {
  static propTypes = {
    videoId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
  }

  render() {
    const { importVideo, readlangBookResponse } = this.props

    return (
      <PromiseStateContainer
        ps={readlangBookResponse}
        onUndefined={() => (
          <Button bsStyle="primary" onClick={importVideo}>
            Import
          </Button>
        )}
        onPending={() => <em>Processing...</em>}
        onFulfillment={b => (
          <Button
            bsStyle="success"
            href={readlang.url(`/library/${b.bookID}`)}
            target="_blank"
          >
            View
          </Button>
        )}
      />
    )
  }
}

export default connect(({ videoId, title, author, language }) => ({
  importVideo: () => ({
    readlangBookResponse: youtube.getVideoTimedTextRequest(videoId, language, {
      then: youtubeTimedText => ({
        value: timedtext2readlangSync(youtubeTimedText),
        then: bookPatch =>
          readlang.buildApiRequest('POST', '/book', {
            body: JSON.stringify({
              title,
              author,
              body:
                'youtube2readlang temp text. if you see this, there was an error importing this video.',
              language,
              public: false,
              source: 'youtube2readlang',
            }),
            then: readlangPostBookResponse =>
              readlang.buildApiRequest(
                'PATCH',
                `/book/${readlangPostBookResponse.bookID}`,
                {
                  body: JSON.stringify(
                    Object.assign(bookPatch, {
                      youTubeID: videoId,
                    })
                  ),
                }
              ),
          }),
      }),
    }),
  }),
}))(ConversionSubmitButton)
