import React, {Component} from 'react';
import './App.css';
import {Button, Col, FormControl, FormGroup, HelpBlock, Jumbotron, Row} from 'react-bootstrap'
import {connect} from 'react-refetch'

class ConversionForm extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      youtubeUrl: ''
    };
  }

  handleYoutubeUrlChange(e) {
    this.setState({
      youtubeUrl: e.target.value,
    })
  }

  render() {
    const { jamakPost, jamakPostResponse } = this.props
    const { youtubeUrl } = this.state

    return (
      <div>
        <Row>
          <Col xs={11} md={10}>
            &nbsp;
            <Jumbotron>
              <h1>YouTube -> Readlang</h1>
              <p>
                Insert a YouTube URL below. Make sure the video has subtitles.
              </p>
            </Jumbotron>

            <FormGroup>
              <FormControl
                type="text"
                value={youtubeUrl}
                placeholder="Enter a YouTube URL with subtitles"
                onChange={this.handleYoutubeUrlChange.bind(this)}
              />
              <HelpBlock style={{color: 'red'}}>
                { jamakPostResponse && jamakPostResponse.rejected && jamakPostResponse.reason.message }
              </HelpBlock>
              <Button bsStyle="primary" onClick={() => jamakPost(youtubeUrl)}>Submit</Button>
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(props => ({
  jamakPost: youtubeUrl => ({
    jamakPostResponse: {
      url: 'https://jamak.herokuapp.com/',
      method: 'POST',
      body: JSON.stringify({
        input: youtubeUrl,
        parser: 'youtube',
        formatter: 'readlang-api',
        options: {
          'readlang.access_token': localStorage.getItem('readlang.access_token'), // TODO: how should pass in?
          'readlang.language': 'ko', // TODO: set
        }
      }),
      then: response => {
        window.location.href = response.output // TODO: really want to do this?
      }
    }
  })
}))(ConversionForm);

