import React, {Component} from 'react';
import {PageHeader, Row, Col} from 'react-bootstrap';
import {wordsPropType} from './words';
import WordTable from './WordTable'

class WordQuiz extends Component {
  static propTypes = {
    words: wordsPropType
  }

  constructor(props, context) {
    super(props, context);
    const {words, sampleSize} = this.props
    this.state = {
      sample: this.sampleWords(words, sampleSize),
    };
  }

  sampleWords(words, sampleSize) {
    return words
      .filter((word) => {
        return /^\d+$/.test(word.rank) && !(/\d/.test(word.term))
      })
      .sort(() => .5 - Math.random())
      .slice(0, sampleSize)
      .map((word, index) => {
        word.setKnow = (value) => {
          const sample = this.state.sample
          sample[index].know = value
          this.setState({words})
        }

        return word
      })
  }

  calcKnowPerc(words, group) {
    return words.filter((word) => {
      return word.know && (group === undefined || group === word.group)
    }).length / words.length
  }

  calcCountsByGroup(words) {
    return words.reduce((counts, w) => {
      counts[w.group] += 1
      return counts
    }, {A: 0, B: 0, C: 0})
  }

  calcResults(all, sample) {
    const allCounts = this.calcCountsByGroup(all)
    const sampleCounts = this.calcCountsByGroup(sample)
    const groups = Object.keys(sampleCounts)

    const sampleKnowPerc = this.calcKnowPerc(sample)

    const sampleKnowPercByGroup = groups.reduce((stats, group) => {
      return Object.assign({[group]: this.calcKnowPerc(sample, group)}, stats)
    }, {})

    const allKnowCountByGroup = groups.reduce((stats, group) => {
      return Object.assign({[group]: Math.round(sampleKnowPercByGroup[group] * allCounts[group])}, stats)
    }, {})

    const allKnowCount = groups.reduce((count, group) => {
      return count + allKnowCountByGroup[group]
    }, 0)

    return {
      allCounts,
      sampleCounts,
      sampleKnowPerc,
      groups,
      sampleKnowPercByGroup,
      allKnowCountByGroup,
      allKnowCount,
    }
  }

  render() {
    const {words} = this.props
    const {sample} = this.state

    const results = this.calcResults(words, sample)
    const resultBreakdown = (group) => {
      return (
        <li>
          <strong>Group {group}:</strong>&nbsp;
          {results.allKnowCountByGroup[group]} words =&nbsp;
          {results.sampleKnowPercByGroup[group]}% of sample *&nbsp;
          {results.allCounts[group]} total words
        </li>
      )
    }

    return (
      <div>
        <Row>
          <Col md={10}>
            <PageHeader>How Many Korean Words Do You Know?</PageHeader>
            <p>
              This is a quiz based on a random sample from the <a
              href="https://ko.wiktionary.org/wiki/%EB%B6%80%EB%A1%9D:%EC%9E%90%EC%A3%BC_%EC%93%B0%EC%9D%B4%EB%8A%94_%ED%95%9C%EA%B5%AD%EC%96%B4_%EB%82%B1%EB%A7%90_5800">list
              of the most common Korean words</a> published by the <a href="https://www.korean.go.kr/front_eng/main.do">The
              National Institute of The Korean Language</a>. For each word below, select if you know the word or not.
              See your result at the bottom. The idea for this site was inspired by <a href="https://redd.it/72wf0s"
                                                                                       target="_blank"
                                                                                       rel="noopener noreferrer">this
              Reddit post</a>.
            </p>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <WordTable
              words={sample}
            />
          </Col>
        </Row>

        <Row>
          <Col md={10}>
            <h3>Results</h3>

            With some super fuzzy, not-so-scientific logic, that means you know:
            <h1>{results.allKnowCount} words</h1>

            <ul>
              {resultBreakdown('A')}
              {resultBreakdown('B')}
              {resultBreakdown('C')}
            </ul>
          </Col>
        </Row>
      </div>
    );
  }
}

export default WordQuiz;