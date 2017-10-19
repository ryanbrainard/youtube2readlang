import React, {Component} from 'react';
import './App.css';
import {Button, Col, ControlLabel, FormControl, FormGroup, Jumbotron, Row} from 'react-bootstrap'

class ConvertionForm extends Component {
  render() {
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
              <ControlLabel>YouTube URL</ControlLabel>
              <FormControl
                type="text"
                // value={this.state.value}
                // placeholder="Enter text"
                // onChange={this.handleChange}
              />
              <Button bsStyle="primary">Submit</Button>
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ConvertionForm;

