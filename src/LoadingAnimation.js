import React, {Component} from 'react'
import PropTypes from 'prop-types'

class LoadingAnimation extends Component {
  static propTypes = {
    containerClass: PropTypes.string,
  }

  static defaultProps = {
    containerClass: 'center',
  }

  render() {
    return (
      <div className={this.props.containerClass}>
        <p className="loading-dots">
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
        </p>
      </div>
    )
  }
}

export default LoadingAnimation
