import React, { Component } from 'react'
import './App.css'
import {
  Grid,
  MenuItem,
  Nav,
  Navbar,
  NavDropdown,
  NavItem,
} from 'react-bootstrap'
import readlang from './readlang'
import PropTypes from 'prop-types'
import { PromiseState } from 'react-refetch'
import PromiseStateContainer from './PromiseStateContainer'

export default class Header extends Component {
  static contextTypes = {
    readlangUserFetch: PropTypes.instanceOf(PromiseState),
  }

  render() {
    const { readlangUserFetch } = this.context

    return (
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
              <PromiseStateContainer
                ps={readlangUserFetch}
                onPending={() => <NavItem>...</NavItem>}
                onFulfillment={user => (
                  <NavDropdown title={user.email} id="nav-user-dropdown">
                    <MenuItem onClick={readlang.logout}>Logout</MenuItem>
                  </NavDropdown>
                )}
                onRejection={() => (
                  <NavItem onClick={readlang.login}>Login</NavItem>
                )}
              />
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
    )
  }
}
