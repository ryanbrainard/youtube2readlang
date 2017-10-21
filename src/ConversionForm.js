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
      language: '',
      title: '',
      channelTitle: '',
      languages: []
    };
  }

  handleYoutubeUrlChange(e) {
    const youtubeUrl = e.target.value

    // TODO: add color to form if not matched
    const matches = youtubeUrl.match(YOUTUBE_REGEX)
    if (matches) {
      const videoId = matches[5]

      window.gapi.client.youtube.videos.list({
        id: videoId,
        part: 'snippet'
      }).then(response => {
        console.log(response)
        if (response.result.items.length === 1) {
          const snippet = response.result.items[0].snippet
          this.setState({
            snippet: snippet, // TODO: only this?
            title: snippet.title,
            channelTitle: snippet.channelTitle
          })
        }
      });

      window.gapi.client.youtube.captions.list({
        videoId: videoId,
        part: 'snippet'
      }).then(response => {
        console.log(response)

        const languages = response.result.items.reduce((langs, item) => {
          // TODO: item.snippet.language is not unique; use array
          return Object.assign({[item.snippet.language]: item.snippet.trackKind}, langs)
        }, {})

        this.setState({
          languages
        })
      });
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
    const { jamakPost, jamakPostResponse } = this.props
    const { youtubeUrl, language, title, channelTitle, languages } = this.state

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
            {channelTitle}: {title}
          </FormControl.Static>

          <FormControl
            componentClass="select"
            style={{width: "10em"}}
            value={language}
            onChange={this.handleLanguageChange.bind(this)}
          >
            {
              Object.keys(languages).map((langCode) => {
                let langInfo = isoCodes[langCode]
                // TODO: split on '-'
                let label = langInfo ? langInfo.name : langCode
                if (languages[langCode] === "ASR") {
                  label += " (auto-translated)"
                }
                return (
                  <option key={langCode} value={langCode}>{label}</option>
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
}))(ConversionForm);

