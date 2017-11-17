import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PromiseState } from 'react-refetch'
import LoadingAnimation from './LoadingAnimation'
import ErrorBox from './ErrorBox'

class PromiseStateContainer extends Component {
  static propTypes = {
    onFulfillment: PropTypes.func.isRequired,
    onPending: PropTypes.func,
    onRejection: PropTypes.func,
    onUndefined: PropTypes.func,
    ps: PropTypes.instanceOf(PromiseState),
  }

  static defaultProps = {
    onUndefined: () => null,
    onPending: () => <LoadingAnimation />,
    onRejection: reason => <ErrorBox error={reason} />,
  }

  render() {
    const {
      ps,
      onUndefined,
      onPending,
      onRejection,
      onFulfillment,
    } = this.props

    if (!ps) {
      return onUndefined()
    } else if (ps.pending) {
      return onPending(ps.meta)
    } else if (ps.rejected) {
      return onRejection(ps.reason, ps.meta)
    } else if (ps.fulfilled) {
      return onFulfillment(ps.value, ps.meta)
    } else {
      console.log('invalid promise state', ps)
      return null
    }
  }
}

export default PromiseStateContainer
