import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect, PromiseState } from 'react-refetch'
import youtube from './youtube'
import VideoQueryResult from './VideoQueryResult'
import PromiseStateContainer from './PromiseStateContainer'

class VideoQuery extends Component {
  static propTypes = {
    q: PropTypes.string.isRequired,
    lang: PropTypes.string,
  }

  render() {
    return (
      <PromiseStateContainer
        ps={this.props.videosFetch}
        onFulfillment={videos =>
          videos.items.map(video => (
            <VideoQueryResult
              key={video.etag}
              video={video}
              lang={this.props.lang}
            />
          ))
        }
      />
    )
  }
}

const YOUTUBE_REGEX = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/

export default connect(({ q }) => {
  const urlMatches = q.match(YOUTUBE_REGEX)
  const videoId = urlMatches && urlMatches[5]

  if (videoId) {
    return {
      videosFetch: youtube.buildApiV3Request('GET', '/videos', {
        id: videoId,
        part: 'snippet',
      }),
    }
  } else if (q.length > 0) {
    return {
      videosFetch: youtube.buildApiV3Request('GET', '/search', {
        type: 'video',
        part: 'snippet',
        videoCaption: 'closedCaption',
        maxResults: 20,
        q: q,
      }),
    }
  } else {
    return {
      videosFetch: {
        value: PromiseState.resolve({ items: [] }),
      },
    }
  }
})(VideoQuery)
