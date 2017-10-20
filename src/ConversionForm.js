import React, {Component} from 'react';
import './App.css';
import {Button, FormControl, FormGroup, HelpBlock} from 'react-bootstrap'
import {connect, PromiseState} from 'react-refetch'
import PromiseStateContainer from './PromiseStateContainer'
import {isoCodes} from './isoCodes'

const YOUTUBE_REGEX = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/

class ConversionForm extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      youtubeUrl: '',
      language: 'ko'
    };
  }

  handleYoutubeUrlChange(e) {
    const youtubeUrl = e.target.value

    // TODO: add color to form if not matched
    const matches = youtubeUrl.match(YOUTUBE_REGEX)
    if (matches) {
      const videoId = matches[5]
      // TODO: combine?
      this.props.youtubeGetVideoInfo(videoId)
      this.props.youtubeGetCaptionList(videoId)
    }

    this.setState({
      youtubeUrl
    })
  }

  handleLanguageChange(e) {
    this.setState({
      language: e.target.value,
    })
  }

  render() {
    const { jamakPost, jamakPostResponse, youtubeGetVideoInfoResponse, youtubeGetCaptionListResponse } = this.props
    const { youtubeUrl, language } = this.state
    const videoFetch = PromiseState.all([
      youtubeGetVideoInfoResponse || PromiseState.create(),  // TODO
      youtubeGetCaptionListResponse || PromiseState.create() // TODO
    ]).then(([info, captions]) => {
        let title = undefined
        let channelTitle = undefined
        let languages = []

        if (info.items.length === 1) {
          const snippet = info.items[0].snippet
          title = snippet.title
          channelTitle = snippet.channelTitle
        }

        languages = captions.items.reduce((langs, item) => {
          // TODO: item.snippet.language is not unique; use array
          return Object.assign({[item.snippet.language]: item.snippet.trackKind}, langs)
        }, {})

        return {
          title,
          channelTitle,
          languages
        }
      })

    return (
      <FormGroup>
        <FormControl
          type="text"
          value={youtubeUrl}
          placeholder="Enter a YouTube URL with subtitles"
          onChange={this.handleYoutubeUrlChange.bind(this)}
        />

        <PromiseStateContainer ps={videoFetch} onFulfillment={(video) =>
          <div>
            <FormControl.Static>
              {video.channelTitle}: {video.title}
            </FormControl.Static>

            <FormControl
              componentClass="select"
              style={{width: "10em"}}
              value={language}
              onChange={this.handleLanguageChange.bind(this)}
            >
              {
                Object.keys(video.languages).map((langCode) => {
                  let langInfo = isoCodes[langCode]
                  // TODO: split on '-'
                  let label = langInfo ? langInfo.name : langCode
                  if (video.languages[langCode] === "ASR") {
                    label += " (auto-translated)"
                  }
                  return (
                    <option key={langCode} value={langCode}>{label}</option>
                  )
                })
              }
            </FormControl>
          </div>
        }/>

        <PromiseStateContainer ps={jamakPostResponse} onFulfillment={() => {}} onRejection={(reason) =>
          <HelpBlock style={{color: 'red'}}>
            { reason.message }
          </HelpBlock>
        }/>

        <Button bsStyle="primary" onClick={() => jamakPost(youtubeUrl, language)}>Submit</Button>
      </FormGroup>
    );
  }
}

export default connect(props => ({
  jamakPost: (youtubeUrl, language) => ({
    jamakPostResponse: {
      url: 'https://jamak.herokuapp.com/',
      method: 'POST',
      body: JSON.stringify({
        input: youtubeUrl,
        parser: 'youtube',
        formatter: 'readlang-api',
        options: {
          'readlang.access_token': localStorage.getItem('readlang.access_token'), // TODO: how should pass in?
          'language': language,
          // TODO: pass in author
          // TODO: pass in title
        }
      }),
      then: response => {
        window.location.href = response.output // TODO dont do this!
      }
    }
  }),
  youtubeGetVideoInfo: (videoId) => ({
    youtubeGetVideoInfoResponse: `https://www.googleapis.com/youtube/v3/videos/?id=${videoId}&part=snippet%2CcontentDetails%2Cstatistics&key=AIzaSyDYzJX4JLJ7JHF8Ki_CW5mz9Om_fEWD7a4`
  }),
  youtubeGetCaptionList: (videoId) => ({
    youtubeGetCaptionListResponse: `https://www.googleapis.com/youtube/v3/captions/?videoId=${videoId}&part=snippet&key=AIzaSyDYzJX4JLJ7JHF8Ki_CW5mz9Om_fEWD7a4`
  })
}))(ConversionForm);

