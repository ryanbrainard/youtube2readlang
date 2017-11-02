import React, {Component} from 'react';
import PromiseStateContainer from './PromiseStateContainer'
import {connect} from 'react-refetch'
import readlang from './readlang'
import {Button} from 'react-bootstrap'
import Footer from './Footer'

class ReadlangSessionContainer extends Component {
  render() {
    const loginButton =
      <div>
        <Button bsStyle="primary" onClick={readlang.login}>
          Sign into Readlang
        </Button>
        <Footer/>
      </div>

    return (
      <PromiseStateContainer
        ps={this.props.userFetch}
        onPending={() => readlang.isLoggedIn() ? null : loginButton}
        onRejection={() => loginButton}
        onFulfillment={(user) =>
          <div>
            {this.props.children}
            <Footer user={user}/>
          </div>
        }
      />
    );
  }
}

export default connect((props) => ({
  userFetch: readlang.buildApiRequest('GET', '/user')
}))(ReadlangSessionContainer)
