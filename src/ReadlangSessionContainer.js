import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PromiseStateContainer from './PromiseStateContainer'
import { connect } from 'react-refetch'
import readlang from './readlang'
import { Button } from 'react-bootstrap'

class ReadlangSessionContainer extends Component {
  static propTypes = {
    container: PropTypes.func, // TODO
    children: PropTypes.any.isRequired,
  }

  static childContextTypes = {
    readlangUser: PropTypes.object,
  }

  getChildContext() {
    return {
      readlangUser: this.props.userFetch.fulfilled
        ? this.props.userFetch.value
        : null,
    }
  }

  render() {
    const { container: Container, userFetch, children } = this.props

    const loggedOut = (
      <Container>
        <Button bsStyle="primary" onClick={readlang.login}>
          Log into Readlang
        </Button>
      </Container>
    )

    return (
      <PromiseStateContainer
        ps={userFetch}
        onPending={() => (readlang.isLoggedIn() ? null : loggedOut)}
        onRejection={() => loggedOut}
        onFulfillment={() => <Container>{children}</Container>}
      />
    )
  }
}

export default connect(() => ({
  userFetch: readlang.buildApiRequest('GET', '/user'),
}))(ReadlangSessionContainer)
