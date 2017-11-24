import React, { Component } from 'react'
import './App.css'
import { Button } from 'react-bootstrap'
import { PromiseState } from 'react-refetch'
import PropTypes from 'prop-types'
import readlang from './readlang'
import PromiseStateContainer from './PromiseStateContainer'
import VideoSearchForm from './VideoSearchForm'

class VideoSearchPage extends Component {
  static contextTypes = {
    readlangUserFetch: PropTypes.instanceOf(PromiseState),
  }

  render() {
    const { readlangUserFetch } = this.context

    return (
      <PromiseStateContainer
        ps={readlangUserFetch}
        onFulfillment={() => <VideoSearchForm />}
        onRejection={() => (
          <div>
            <p>
              <strong>To get started, log into your Readlang account.</strong>{' '}
              If you're not familiar with{' '}
              <a href="http://readlang.com" target="_blank">
                Readlang
              </a>, it is a nifty little service that let's you read anything in
              a foreign language with built-in translations, dictionary, and
              flashcards. You can also watch YouTube videos and this service
              automatically extracts and synchronize the subtitles.
            </p>
            <Button bsStyle="primary" onClick={readlang.login}>
              Login with Readlang
            </Button>
            &nbsp;
            {/* Sign up still goes to login, but two buttons for better UX */}
            <Button onClick={readlang.login}>Sign Up for Readlang</Button>
          </div>
        )}
      />
    )
  }
}

export default VideoSearchPage
