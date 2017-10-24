import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Form, FormControl, FormGroup, Well} from 'react-bootstrap'
import {connect, PromiseState} from 'react-refetch'
import youtube from './youtube'
import PromiseStateContainer from './PromiseStateContainer'
import {supportedLanguages} from './languages'
import ConversionSubmitButton from './ConversionSubmitButton'
import ErrorBox from './ErrorBox'

class VideoQueryResult extends Component {
  static propTypes = {
    videoId: PropTypes.string,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    const { videosFetch, captionsFetch } = this.props

    return <PromiseStateContainer
      ps={PromiseState.all([videosFetch, captionsFetch])}
      onFulfillment={([videos, captions]) => this.renderFulfilled(videos.items, captions.items)}
    />
  }

  componentWillReceiveProps(nextProps) {
    let noCaptionId = !this.state || !this.state.selectedCaptionId
    const defaultAvailable = nextProps.captionsFetch.fulfilled && nextProps.captionsFetch.value.items[0]
    if (noCaptionId && defaultAvailable) {
      this.setState({
        selectedCaptionId: nextProps.captionsFetch.value.items[0].id,
      })
    }
  }

  renderFulfilled(videos, captions) {
    if (videos.length !== 1) {
      return null
    }
    const snippet = videos[0].snippet
    const { selectedCaptionId } = this.state
    const handleCaptionChange = (e) => {
      this.setState({
        selectedCaptionId: e.target.value,
      })
    }

    const selectedCaption = captions.find((c) => c.id === this.state.selectedCaptionId) || captions[0]
    const selectedLanguage = selectedCaption && selectedCaption.snippet.language
    const selectedTrackKind = selectedCaption && selectedCaption.snippet.trackKind
    const noCaptionsError = <ErrorBox error="This video does not have any subtitles."/>
    const captionsForm = (
      <Form inline>
        <FormGroup>
          <FormControl
            componentClass="select"
            value={selectedCaptionId}
            onChange={handleCaptionChange}
          >
            {
              captions
                .filter((caption) => supportedLanguages[caption.snippet.language])
                .map((caption) => {
                  let label = supportedLanguages[caption.snippet.language]
                  if (caption.snippet.trackKind === "ASR") {
                    label += " (auto-translated)"
                  }
                  return (
                    <option key={caption.id} value={caption.id}>{label}</option>
                  )
                })
            }
          </FormControl>
          &nbsp;&nbsp;
          <ConversionSubmitButton
            videoId={this.props.videoId}
            language={selectedLanguage}
            trackKind={selectedTrackKind}
          />
        </FormGroup>
      </Form>
    )

    return (
      <Well>
        <h4><strong>{snippet.channelTitle}:</strong> {snippet.title}</h4>
        { captions.length === 0 ? noCaptionsError : captionsForm }
      </Well>
    )
  }
}

export default connect(({ videoId }) => ({
  videosFetch: youtube.buildApiRequest('GET', '/videos', {id: videoId, part: 'snippet'}),
  captionsFetch: youtube.buildApiRequest('GET', '/captions', {videoId: videoId, part: 'snippet'}),
}))(VideoQueryResult)
