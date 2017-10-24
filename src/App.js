import React, {Component} from 'react';
import './App.css';
import {Grid, Jumbotron} from 'react-bootstrap';
import readlang from './readlang'
import SearchForm from './SearchForm'

class App extends Component {
  componentDidMount() {
    readlang.requestAuth()
  }

  render() {
    return (
      <div>
        <div className="a2a_kit a2a_kit_size_24 a2a_floating_style a2a_vertical_style" style={{right: '0px', top: '200px'}}>
          {/* eslint-disable */}
          <a className="a2a_button_facebook"></a>
          <a className="a2a_button_twitter"></a>
          <a className="a2a_button_reddit"></a>
          <a className="a2a_dd" href="https://www.addtoany.com/share"></a>
          {/* eslint-enable */}
        </div>

        <Grid>
          <br/>
          <Jumbotron>
            <h1>YouTube -> ReadLang</h1>
          </Jumbotron>

          <SearchForm/>

          <footer>
            <hr/>
            Made in Korea.
            &nbsp;
            <a href="https://github.com/ryanbrainard/youtube2readlang" target="_blank" rel="noopener noreferrer">
              View Source
            </a>
            <hr/>
          </footer>
        </Grid>
      </div>
    );
  }
}

export default App;
