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
    // TODO: simplify. shouldn't need to set all these is rendered properly
    this.state = {
      youtubeUrl: '',
      snippet: {},
      captions: [],
      caption: {},
    };
  }

  handleYoutubeUrlChange(e) {
    const youtubeUrl = e.target.value

    this.setState({
      youtubeUrl
    })

    // TODO: add color to form if not matched
    const matches = youtubeUrl.match(YOUTUBE_REGEX)
    if (!matches) {
      return
    }
    const videoId = matches[5]

    window.gapi.client.youtube.videos.list({
      id: videoId,
      part: 'snippet'
    }).then(response => {
      let items = response.result.items
      if (items.length !== 1) {
        return
      }
      this.setState({
        snippet: items[0].snippet
      })
    });

    window.gapi.client.youtube.captions.list({
      videoId: videoId,
      part: 'snippet'
    }).then(response => {
      this.setState({
        captions: response.result.items
      })
    });
  }

  handleCaptionChange(e) {
    this.setState({
      caption: this.state.captions.find((c) => c.id === e.target.value),
    })
  }

  handleSubmit() {
    const { jamakPost, jamakPostResponse } = this.props
    const { youtubeUrl, snippet, captions, caption } = this.state

    console.log(youtubeUrl, caption.id, caption.snippet.language)

    window.gapi.client.youtube.captions.download({
      id: caption.id,
      tfmt: 'srt'
    }).then(response => {
      console.log(response)
    });

    // jamakPost(youtubeUrl, caption.snippet.language)
  }

  render() {
    const { jamakPost, jamakPostResponse } = this.props
    const { youtubeUrl, snippet, captions, caption } = this.state

    return (
      <FormGroup>
        <FormControl
          type="text"
          value={youtubeUrl}
          placeholder="Enter a YouTube URL with subtitles"
          onChange={this.handleYoutubeUrlChange.bind(this)}
        />

        <div>
          <FormControl.Static>
            {snippet.channelTitle}: {snippet.title}
          </FormControl.Static>

          <FormControl
            componentClass="select"
            style={{width: "20em"}}
            value={caption.id}
            onChange={this.handleCaptionChange.bind(this)}
          >
            {
              captions.map((caption) => {
                let langCode = caption.snippet.language
                // TODO: update isoCodes with support for dialects
                let langInfo = isoCodes[langCode]
                let label = langInfo ? langInfo.name : langCode
                if (caption.trackKind === "ASR") {
                  label += " (auto-translated)"
                }
                return (
                  <option key={caption.id} value={caption.id}>{label}</option>
                )
              })
            }
          </FormControl>
        </div>

        <PromiseStateContainer ps={jamakPostResponse} onFulfillment={() => {}} onRejection={(reason) =>
          <HelpBlock style={{color: 'red'}}>
            { reason.message }
          </HelpBlock>
        }/>

        <Button bsStyle="primary" onClick={this.handleSubmit.bind(this)}>Submit</Button>
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
}))(ConversionForm);

