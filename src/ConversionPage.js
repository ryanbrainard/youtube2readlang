import React, {Component} from 'react';
import './App.css';
import {Col, Jumbotron, Row} from 'react-bootstrap'
import ConversionForm from './ConversionForm'

class ConversionPage extends Component {
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
            <ConversionForm/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ConversionPage;
