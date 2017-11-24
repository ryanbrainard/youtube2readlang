import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect, PromiseState } from 'react-refetch'
import readlang from './readlang'

/*
  Fetches Readlang user to test session and provides
  readlangUserFetch PromiseState in context to children
 */
class ReadlangSessionContainer extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
  }

  static childContextTypes = {
    readlangUserFetch: PropTypes.instanceOf(PromiseState),
  }

  getChildContext() {
    return {
      readlangUserFetch: this.props.readlangUserFetch,
    }
  }

  render() {
    return this.props.children
  }
}

export default connect(() => ({
  readlangUserFetch: readlang.buildApiRequest('GET', '/user'),
}))(ReadlangSessionContainer)
