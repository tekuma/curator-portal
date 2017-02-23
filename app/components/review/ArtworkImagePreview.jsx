// Libs
import React                from 'react';
import uuid                 from 'node-uuid';
import Dialog               from 'material-ui/Dialog';
import getMuiTheme          from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider     from 'material-ui/styles/MuiThemeProvider';

// Files
import ConfirmButton        from '../confirm_dialog/ConfirmButton';

/**
 * TODO
 */
export default class ArtworkImagePreview extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ArtworkImagePreview");
    }

    render() {
        const actions = [
              <ConfirmButton
                label={"Close"}
                className="upload-dialog-button"
                onClick={this.props.toggleArtworkPreview}
              />
        ];

        let thumbnail_url = "url('assets/images/artwork-substitute.png')";
        let fullsize_url  = 'assets/images/artwork-substitute.png';
        if (this.props.reviewInfo.artist_uid && this.props.reviewInfo.artwork_uid) {
            fullsize_url = `https://storage.cloud.google.com/art-uploads/portal/${this.props.reviewInfo.artist_uid}/uploads/${this.props.reviewInfo.artwork_uid}`
            thumbnail_url = `url(https://storage.googleapis.com/art-uploads/portal/${this.props.reviewInfo.artist_uid}/thumb512/${this.props.reviewInfo.artwork_uid})`;
        }
        let previewImage = {
            backgroundImage: thumbnail_url
        }

        return (
            <div>

                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <Dialog
                        actions                     ={actions}
                        modal                       ={false}
                        open                        ={this.props.artworkPreviewIsOpen}
                        titleClassName              ="review-artwork-title"
                        actionsContainerClassName   ="review-artwork-actions"
                        bodyClassName               ="review-artwork-body"
                        contentClassName            ="review-artwork-content" >
                        <div className="review-artwork-dialog">
                            <a
                                className="review-artwork-preview"
                                href={fullsize_url}
                                target="_blank"
                                title="Click to open fullsize artwork">
                                <div
                                    className="artwork-image"
                                    style={previewImage}>
                                </div>
                            </a>
                        </div>
                    </Dialog>
                </MuiThemeProvider>

            </div>

        );
    }

    componentDidMount() {
        console.log("+++++ArtworkImagePreview");
    }

    componentWillReceiveProps(nextProps) {

    }
}
