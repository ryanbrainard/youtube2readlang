import React, { Component } from 'react'
import './App.css'
import {
  Col,
  Grid,
  Jumbotron,
  MenuItem,
  Nav,
  Navbar,
  NavDropdown,
  NavItem,
  Row,
} from 'react-bootstrap'
import { Redirect, Route, Switch } from 'react-router-dom'
import logoImage from './logo-64.png'
import ReadlangSessionContainer from './ReadlangSessionContainer'
import VideoSearchForm from './VideoSearchForm'
import PropTypes from 'prop-types'
import readlang from './readlang'

class App extends Component {
  render() {
    return (
      <ReadlangSessionContainer container={AppContainer}>
        <Switch>
          <Route path="/search" component={VideoSearchForm} />
          <Redirect to="/search" />
        </Switch>
      </ReadlangSessionContainer>
    )
  }
}

class AppContainer extends Component {
  static contextTypes = {
    readlangUser: PropTypes.object,
  }

  render() {
    const { children } = this.props
    const { readlangUser } = this.context

    return (
      <div>
        <Navbar inverse fixedTop>
          <Grid>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/">YouTube ➜ Readlang</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                <NavItem href="/search">Search</NavItem>
              </Nav>
              <Nav pullRight>
                {readlangUser ? (
                  <NavDropdown
                    title={readlangUser.email}
                    id="nav-user-dropdown"
                  >
                    <MenuItem onClick={readlang.logout}>Logout</MenuItem>
                  </NavDropdown>
                ) : (
                  <NavItem onClick={readlang.login}>Login</NavItem>
                )}
                <NavItem href="https://github.com/ryanbrainard/youtube2readlang">
                  Source
                </NavItem>
                <NavItem href="https://github.com/ryanbrainard/youtube2readlang/issues">
                  Issues
                </NavItem>
              </Nav>
            </Navbar.Collapse>
          </Grid>
        </Navbar>

        <Grid style={{ marginTop: 50 }}>
          <Row>
            <Col xs={11} md={10}>
              &nbsp;
              <Jumbotron>
                <img src={logoImage} alt={'logo'} />
                <h2>YouTube ➜ Readlang</h2>
                <p>
                  Search for a video and import into Readlang with synchronized
                  subtitles.
                </p>
              </Jumbotron>
              {children}
              <footer>
                Not associated with YouTube or Readlang &nbsp;|&nbsp; All
                copyright belong to their respective owners
              </footer>
            </Col>
          </Row>
        </Grid>

        <div
          className="a2a_kit a2a_kit_size_24 a2a_floating_style a2a_vertical_style"
          style={{ right: '0px', top: '200px' }}
        >
          {/* eslint-disable */}
          <a className="a2a_button_facebook" />
          <a className="a2a_button_twitter" />
          <a className="a2a_button_reddit" />
          <a className="a2a_dd" href="https://www.addtoany.com/share" />
          {/* eslint-enable */}
        </div>
      </div>
    )
  }
}

export default App
