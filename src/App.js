import React, { Component } from 'react'
import './App.css'
import { Col, Grid, Jumbotron, Row } from 'react-bootstrap'
import { Redirect, Route, Switch } from 'react-router-dom'
import logoImage from './logo-64.png'
import ReadlangSessionContainer from './ReadlangSessionContainer'
import Header from './Header'
import SocialIcons from './SocialIcons'
import VideoSearchPage from './VideoQueryPage'

class App extends Component {
  render() {
    return (
      <div>
        <ReadlangSessionContainer>
          <Header />
          <Grid style={{ marginTop: 50 }}>
            <Row>
              <Col xs={11} md={10}>
                &nbsp;
                <Jumbotron>
                  <img src={logoImage} alt={'logo'} />
                  <h2>YouTube ➜ Readlang</h2>
                  <p>
                    Search for a video and import into Readlang with
                    synchronized subtitles.
                  </p>
                </Jumbotron>
                <Switch>
                  <Route path="/search" component={VideoSearchPage} />
                  <Redirect to="/search" />
                </Switch>
              </Col>
            </Row>
          </Grid>
        </ReadlangSessionContainer>
        <SocialIcons />
      </div>
    )
  }
}

export default App
