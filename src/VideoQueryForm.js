import React, { Component } from 'react'
import './App.css'
import { Form, FormControl, FormGroup, InputGroup } from 'react-bootstrap'
import VideoQuery from './VideoQuery'
import { supportedLanguages } from './languages'
import * as qs from 'query-string'
import { withRouter } from 'react-router-dom'

class VideoQueryForm extends Component {
  constructor(props, context) {
    super(props, context)
    const search = qs.parse(this.props.location.search)
    this.delayed = 0
    this.state = {
      q: search.q,
    }
    this.handleQueryChange = this.handleQueryChange.bind(this)
    this.handleLangChange = this.handleLangChange.bind(this)
  }

  delay(callback, ms) {
    clearTimeout(this.delayed)
    this.delayed = setTimeout(callback, ms)
  }

  search(key, value) {
    const search = qs.parse(this.props.location.search)
    this.props.history.push({
      search: qs.stringify(Object.assign(search, { [key]: value })),
    })
  }

  handleQueryChange(e) {
    const q = e.target.value
    this.setState({ q })
    this.delay(() => this.search('q', q), 500)
  }

  handleLangChange(e) {
    this.search('lang', e.target.value)
  }

  render() {
    const search = qs.parse(this.props.location.search)
    const { q, lang } = search
    const { q: qImmediate } = this.state

    return (
      <div>
        <Form inline>
          <FormGroup bsSize="lg" style={{ width: '100%' }}>
            <FormControl
              type="text"
              value={qImmediate || ''}
              placeholder="Search or enter a YouTube URL"
              onChange={this.handleQueryChange}
              style={{ width: '75%' }}
              autoFocus={true}
            />
            &nbsp;
            <FormControl
              componentClass="select"
              value={lang || ''}
              onChange={this.handleLangChange}
              style={{ width: '20%' }}
            >
              <option key="any" value={''}>
                Any Language
              </option>
              {Object.keys(supportedLanguages).map(lang => (
                <option key={lang} value={lang}>
                  {supportedLanguages[lang]}
                </option>
              ))}
            </FormControl>
          </FormGroup>
        </Form>
        <br />
        <VideoQuery q={q || ''} lang={lang || ''} />
      </div>
    )
  }
}

export default withRouter(VideoQueryForm)
