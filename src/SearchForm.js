import React, {Component} from 'react';
import './App.css';
import {FormControl, FormGroup} from 'react-bootstrap'
import VideoUrlQuery from './VideoUrlQuery'

class SearchForm extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      videoQuery: '',
    };
  }

  handleVideoQueryChange(e) {
    this.setState({
      videoQuery: e.target.value
    })
  }

  render() {
    const { videoQuery } = this.state

    return (
      <FormGroup>
        <FormControl
          type="text"
          value={videoQuery}
          placeholder="Enter a YouTube URL with subtitles"
          onChange={this.handleVideoQueryChange.bind(this)}
        />
        <br/>
        <VideoUrlQuery videoUrl={this.state.videoQuery}/>
      </FormGroup>
    );
  }
}

export default SearchForm
