import React, {Component} from 'react'
import PropTypes from 'prop-types'
import VideoQueryResult from './VideoQueryResult'

const YOUTUBE_REGEX = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/

class VideoUrlQuery extends Component {
  static propTypes = {
    videoUrl: PropTypes.string.isRequired,
  }

  render() {
    const { videoUrl, ...others } = this.props

    const matches = videoUrl.match(YOUTUBE_REGEX)
    if (!matches) {
      return null
    }
    const videoId = matches[5]

    return <VideoQueryResult {...others} videoId={videoId} />
  }
}

export default VideoUrlQuery
