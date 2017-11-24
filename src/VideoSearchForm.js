import React, { Component } from 'react'
import './App.css'
import {
  DropdownButton,
  FormControl,
  FormGroup,
  InputGroup,
  MenuItem,
} from 'react-bootstrap'
import VideoQuery from './VideoQuery'
import { supportedLanguages } from './languages'
import * as qs from 'query-string'
import { withRouter } from 'react-router-dom'

class VideoSearchForm extends Component {
  constructor(props, context) {
    super(props, context)
    const search = qs.parse(this.props.location.search)
    this.state = {
      videoQuery: search.videoQuery,
      videoQueryDelayed: search.videoQuery,
    }
  }

  delay() {
    let timer = 0
    return (callback, ms) => {
      clearTimeout(timer)
      timer = setTimeout(callback, ms)
    }
  }

  handleVideoQueryChange(e) {
    const videoQuery = e.target.value

    this.setState({
      videoQuery,
    })

    this.delay()(() => {
      const search = qs.parse(this.props.location.search)
      this.props.history.push({
        search: qs.stringify(
          Object.assign(search, { videoQueryDelayed: videoQuery })
        ),
      })
    }, 500)
  }

  handlePreferedLanguageChange(lang) {
    const search = qs.parse(this.props.location.search)
    this.props.history.push({
      search: qs.stringify(Object.assign(search, { preferedLanguage: lang })),
    })
  }

  render() {
    const search = qs.parse(this.props.location.search)
    const { videoQueryDelayed, preferedLanguage } = search
    const { videoQuery } = this.state

    return (
      <div>
        <FormGroup>
          <InputGroup>
            <DropdownButton
              id="preferedLanguage"
              componentClass={InputGroup.Button}
              title={
                supportedLanguages[this.state.preferedLanguage] ||
                'Any Language'
              }
              onSelect={this.handlePreferedLanguageChange.bind(this)}
            >
              <MenuItem key="any" eventKey={undefined}>
                Any Language
              </MenuItem>
              {Object.keys(supportedLanguages).map(lang => (
                <MenuItem key={lang} eventKey={lang}>
                  {supportedLanguages[lang]}
                </MenuItem>
              ))}
            </DropdownButton>
            <FormControl
              type="text"
              value={videoQuery}
              placeholder="Search or enter a YouTube URL"
              onChange={this.handleVideoQueryChange.bind(this)}
            />
          </InputGroup>
        </FormGroup>
        <br />
        <VideoQuery
          videoQuery={videoQueryDelayed || ''}
          preferedLanguage={preferedLanguage || ''}
        />
      </div>
    )
  }
}

export default withRouter(VideoSearchForm)
