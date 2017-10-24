import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Button} from 'react-bootstrap'
import {connect} from 'react-refetch'
import youtube from './youtube'
import PromiseStateContainer from './PromiseStateContainer'

class ConversionSubmitButton extends Component {
  static propTypes = {
    videoId: PropTypes.string,
    language: PropTypes.string,
  }

  render() {
    const { jamakPost, jamakPostResponse } = this.props

    return <PromiseStateContainer
      ps={jamakPostResponse}
      onUndefined={() => <Button bsStyle="primary" onClick={jamakPost}>Import</Button>}
      onPending={() => <em>Processing...</em>}
      onFulfillment={(r) => <Button bsStyle="success" href={r.output} target="_blank">View</Button>}
    />
  }
}

export default connect(({ videoId, language }) => ({
  jamakPost: () => ({
    jamakPostResponse: {
      url: 'https://jamak.herokuapp.com/',
      method: 'POST',
      body: JSON.stringify({
        input: `https://youtu.be/${videoId}`,
        parser: 'youtube',
        formatter: 'readlang-api',
        options: {
          'readlang.access_token': localStorage.getItem('readlang.access_token'),
          'language': language,
          // TODO: pass in author
          // TODO: pass in title
        }
      })
    }
  }),
}))(ConversionSubmitButton);
