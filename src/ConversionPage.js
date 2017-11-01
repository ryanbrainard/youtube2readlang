import React, {Component} from 'react';
import './App.css';
import {Col, Jumbotron, Row} from 'react-bootstrap'
import VideoSearchForm from './VideoSearchForm'
import logoImage from './logo-64.png'

class ConversionPage extends Component {
  render() {
    return (
      <div>
        <Row>
          <Col xs={11} md={10}>
            &nbsp;
            <Jumbotron>
              <img src={logoImage} alt={"logo"}/>
              <h2>YouTube ➜ Readlang</h2>
              <p>
                Search for a video and import into Readlang with synchronized subtitles.
              </p>
            </Jumbotron>
            <VideoSearchForm/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ConversionPage;
