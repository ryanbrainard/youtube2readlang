import React, {Component} from 'react';
import './App.css';
import {FormControl, FormGroup} from 'react-bootstrap'
import VideoQuery from './VideoQuery'

class SearchForm extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      videoQuery: '',
      videoQueryDelayed: '',
    };
  }

  delay() {
    let timer = 0;
    return (callback, ms) => {
      clearTimeout (timer)
      timer = setTimeout(callback, ms)
    }
  }

  handleVideoQueryChange(e) {
    const videoQuery = e.target.value

    this.setState({
      videoQuery
    })

    this.delay()(() => {
      this.setState({
        videoQueryDelayed: videoQuery
      })
    }, 500);
  }

  render() {
    const { videoQuery } = this.state

    return (
      <FormGroup>
        <FormControl
          type="text"
          value={videoQuery}
          placeholder="Search or enter a YouTube URL"
          onChange={this.handleVideoQueryChange.bind(this)}
        />
        <br/>
        <VideoQuery videoQuery={this.state.videoQueryDelayed}/>
      </FormGroup>
    );
  }
}

export default SearchForm
