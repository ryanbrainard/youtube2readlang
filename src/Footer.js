import React, {Component} from 'react';
import readlang from './readlang'

export default class Footer extends Component {
  render() {
    const { user } = this.props
    return (
      <footer>
        <hr/>
        <a href="https://github.com/ryanbrainard/youtube2readlang" target="_blank" rel="noopener noreferrer">
          View Source & Issues
        </a>

        &nbsp;|&nbsp;

        Not associated with YouTube or Readlang

        &nbsp;|&nbsp;

        All copyright belong to their respective owners

        { user &&
        <span>
          &nbsp;|&nbsp;
          Logged in as {user.username}
          &nbsp;|&nbsp;
          <a href="/" onClick={readlang.logout}>Logout</a>
          </span>
        }
      </footer>
    )
  }
}
