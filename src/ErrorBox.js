import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ErrorBox extends Component {
  static propTypes = {
    error: PropTypes.oneOfType([
      PropTypes.instanceOf(Error),
      PropTypes.node,
      PropTypes.string,
    ]),
  }

  render() {
    const { error } = this.props

    if (error instanceof Error) {
      console.error(error)
    }

    return (
      <div className="alert alert-danger">
        {error instanceof Error ? <p>{error.message}</p> : error}
      </div>
    )
  }
}

export default ErrorBox
