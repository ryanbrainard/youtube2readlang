import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Button} from 'react-bootstrap'
import {connect} from 'react-refetch'
import PromiseStateContainer from './PromiseStateContainer'
import readlang from './readlang'

class ConversionSubmitButton extends Component {
  static propTypes = {
    videoId: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    trackKind: PropTypes.string.isRequired,
  }

  render() {
    const { jamakPost, readlangPatchBookResponse } = this.props

    return <PromiseStateContainer
      ps={readlangPatchBookResponse}
      onUndefined={() =>
        <Button bsStyle="primary" onClick={jamakPost}>Import</Button>
      }
      onPending={() =>
        <em>Processing...</em>
      }
      onFulfillment={(r) =>
        <Button bsStyle="success" href={readlang.url(`/library/${r.bookID}`)} target="_blank">View</Button>
      }
    />
  }
}

export default connect(({ videoId, language, trackKind }) => ({
  jamakPost: () => ({
    readlangPatchBookResponse: {
      url: 'https://jamak.herokuapp.com/',
      method: 'POST',
      body: JSON.stringify({
        input: `https://youtu.be/${videoId}`,
        parser: 'youtube',
        formatter: 'readlang',
        options: {
          'language': language,
          'trackKind': trackKind,
        }
      }),
      then: (jamakPostResponse) =>
        readlang.buildApiRequest('POST', '/book', {
          body: JSON.stringify({
            title: "youtube2readlang temp title",
            body: "youtube2readlang temp body",
            language: language,
            public: false,
            source: "youtube2readlang",
          }),
          then: (readlangPostBookResponse) =>
            readlang.buildApiRequest('PATCH', `/book/${readlangPostBookResponse.bookID}`, {
              body: jamakPostResponse.output
            })
        })
    }
  }),
}))(ConversionSubmitButton);
