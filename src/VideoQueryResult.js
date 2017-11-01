import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Form, FormControl, FormGroup, Media, Well} from 'react-bootstrap'
import {connect} from 'react-refetch'
import youtube from './youtube'
import PromiseStateContainer from './PromiseStateContainer'
import {supportedLanguages} from './languages'
import ConversionSubmitButton from './ConversionSubmitButton'
import ErrorBox from './ErrorBox'

class VideoQueryResult extends Component {
  static propTypes = {
    video: PropTypes.object.isRequired,
    preferedLanguage: PropTypes.string,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    const { video, captionsFetch } = this.props

    return <PromiseStateContainer
      ps={captionsFetch}
      onPending={() => null}
      onFulfillment={(captions) => this.renderFulfilled(video, captions.items)}
    />
  }

  componentWillReceiveProps(nextProps) {
    const preferedLanguage = nextProps.preferedLanguage
    const defaultCaption = nextProps.captionsFetch.fulfilled && (
      this.filterSupportedCaptions(nextProps.captionsFetch.value.items).find((c) =>
        preferedLanguage && c.snippet.language === preferedLanguage) ||
      this.filterSupportedCaptions(nextProps.captionsFetch.value.items)[0]
    )

    if (defaultCaption) {
      this.setState({
        selectedCaptionId: defaultCaption.id,
      })
    }
  }

  filterSupportedCaptions(captions) {
    return captions
      .filter((caption) => caption.snippet.trackKind !== "ASR")
      .filter((caption) => supportedLanguages[caption.snippet.language])
  }

  renderFulfilled(video, captions) {
    const videoId = (typeof video.id === 'object' && video.id.videoId) || video.id
    const snippet = video.snippet
    const { selectedCaptionId } = this.state
    const handleCaptionChange = (e) => {
      this.setState({
        selectedCaptionId: e.target.value,
      })
    }
    const thumbnail = snippet.thumbnails.default
    const selectedCaption = captions.find((c) => c.id === this.state.selectedCaptionId) || captions[0]
    const selectedLanguage = selectedCaption && selectedCaption.snippet.language
    const noCaptionsError = <ErrorBox error="This video does not have any subtitles."/>
    const supportedCaptions = this.filterSupportedCaptions(captions)
    const captionsForm = (
      <Form>
        <FormGroup>
          <FormControl
            componentClass="select"
            value={selectedCaptionId}
            style={{width: `${thumbnail.width}px`}}
            onChange={handleCaptionChange}
          >
            {
              supportedCaptions.map((caption) => {
                return (
                  <option key={caption.id} value={caption.id}>
                    {supportedLanguages[caption.snippet.language]}
                  </option>
                )
              })
            }
          </FormControl>
          <p/>
          <ConversionSubmitButton
            videoId={videoId}
            title={snippet.title}
            author={snippet.channelTitle}
            language={selectedLanguage}
          />
        </FormGroup>
      </Form>
    )

    return (
      <Well>
        <Media>
          <Media.Left align="top">
            <a href={`https://www.youtube.com/watch?v=${videoId}`} target={'_blank'}>
              <img src={thumbnail.url} width={thumbnail.width} height={thumbnail.height} alt={snippet.title}/>
            </a>
            <p/>
            { supportedCaptions.length === 0 ? noCaptionsError : captionsForm }
          </Media.Left>
          <Media.Body>
            <Media.Heading>{snippet.channelTitle}: {snippet.title}</Media.Heading>
            <p>{snippet.description}</p>
          </Media.Body>
        </Media>
      </Well>
    )
  }
}

export default connect(({ video }) => ({
  captionsFetch: youtube.buildApiV3Request('GET', '/captions', {
    videoId: (typeof video.id === 'object' && video.id.videoId) || video.id,
    part: 'snippet'
  }),
}))(VideoQueryResult)
