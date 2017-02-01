// Libs
import React                from 'react';
import uuid                 from 'node-uuid';
import Dialog               from 'material-ui/Dialog';
import getMuiTheme          from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider     from 'material-ui/styles/MuiThemeProvider';
import { WithContext as ReactTags } from 'react-tag-input';

// Files
import ConfirmButton        from '../confirm_dialog/ConfirmButton';

/**
 * TODO
 */
export default class ArtworkDetailBoxDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ArtworkDetailBoxDialog");
    }

    render() {
        const actions = [
              <ConfirmButton
                label={"Close"}
                className="upload-dialog-button"
                onClick={this.props.toggleDetailBox}
              />
        ];

        let tags        = [];
        for (var i = 0; i < this.props.artworkInfo.tags.length; i++) {
            let tag = this.props.artworkInfo.tags[i];
            tags.push({id:i, text:tag});
        }

        let colors = [];
        for (let colr of this.props.artworkInfo.colors) {
            colors.push({background:colr});
        }

        let image = this.props.artworkInfo.thumbnail_url;

        let previewImage = {
            backgroundImage: 'url(' + image + ')'
        }

        return (
            <div>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <Dialog
                        actions                     ={actions}
                        modal                       ={false}
                        open                        ={this.props.detailBoxIsOpen}
                        titleClassName              ="edit-artwork-title"
                        actionsContainerClassName   ="edit-artwork-actions"
                        bodyClassName               ="edit-artwork-body"
                        contentClassName            ="edit-artwork-content" >
                        <div className="artwork-detail-dialog">
                            <div className="artwork-preview">
                                <div className="artwork-image-wrapper">
                                    <div
                                        className="artwork-image"
                                        style={previewImage}>
                                    </div>
                                </div>
                            </div>
                            <div className="artwork-info-wrapper">
                                <div className="artwork-details">
                                    <div
                                        className="artwork-title">
                                        {this.props.artworkInfo.title}
                                    </div>
                                    <div
                                        className="artwork-artist">
                                        {this.props.artworkInfo.artist}
                                    </div>
                                    <div
                                        className="artwork-date">
                                        {this.props.artworkInfo.year}
                                    </div>
                                </div>
                                <div className="other-artwork-details">
                                    <h4 className="artwork-review-heading">
                                        Review Notes
                                    </h4>
                                    <div
                                        className="artwork-review">
                                        &#8220;{this.props.artworkInfo.review_note}&#8221;
                                        <div className="artwork-reviewer">{this.props.artworkInfo.reviewer}</div>
                                    </div>
                                    <h4 className="artwork-album-heading">
                                        Album
                                    </h4>
                                    <div
                                        className="artwork-album">
                                        {this.props.artworkInfo.album}
                                    </div>
                                    <h4 className="artwork-tags-heading">
                                        Tags
                                    </h4>
                                    <div className="artwork-tags">
                                        <ReactTags
                                            tags={tags}
                                            readOnly={true}
                                            />
                                    </div>
                                    <h4
                                        className="artwork-description-heading">
                                        Description
                                    </h4>
                                    <div
                                        className="artwork-description">
                                        {this.props.artworkInfo.description}
                                    </div>
                                    <h4
                                        className="artwork-colors-heading">
                                        Colors
                                    </h4>
                                    <div className="artwork-colors">
                                        {colors.map(color => {
                                            return (
                                                <div
                                                    key     ={uuid.v4()}
                                                    className="color-box"
                                                    style={color}>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Dialog>
                </MuiThemeProvider>
            </div>
        );
    }

    componentDidMount() {
        console.log("+++++ArtworkDetailBoxDialog");
    }

    componentWillReceiveProps(nextProps) {

    }
}
