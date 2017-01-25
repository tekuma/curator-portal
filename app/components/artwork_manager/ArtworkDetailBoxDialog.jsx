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

        let oldArtwork  = this.props.artworkInfo;
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
                        <div className="artwork-edit-dialog">
                            <div className="artwork-preview-colors">
                                <div className="artwork-preview-wrapper">
                                    <div
                                        className="artwork-preview"
                                        style={previewImage}>
                                    </div>
                                </div>
                            </div>
                            <div className="artwork-form-wrapper">
                                <form className="artwork-form" >
                                    <fieldset>
                                        <ul>
                                            <li>
                                                <label htmlFor="artwork-title">
                                                    Title <span className="pink">*</span>
                                                </label>
                                                <label>
                                                    {this.props.artworkInfo.title}
                                                </label>

                                            </li>
                                            <li>
                                                <label htmlFor="artwork-artist">
                                                    Artist <span className="pink">*</span>
                                                </label>
                                                <label>
                                                    {this.props.artworkInfo.artist}
                                                </label>
                                            </li>
                                            <li
                                                id="li-album"
                                                className="controls-album">
                                                <label htmlFor="edit-artwork-album">
                                                    Album
                                                </label>
                                                <label>
                                                    {this.props.artworkInfo.album}
                                                </label>
                                            </li>
                                            <li>
                                                <label htmlFor="artwork-year">
                                                    Year <span className="pink">*</span>
                                                </label>
                                                <label>
                                                    {this.props.artworkInfo.year}
                                                </label>
                                            </li>
                                            <li>
                                                <label htmlFor="artwork-tags">
                                                    Tags
                                                </label>
                                                <ReactTags
                                                    tags={tags}
                                                    readOnly={true}
                                                    handleAddition={this.handleTags}
                                                    handleDelete={this.handleTags}
                                                    />
                                            </li>
                                            <li>
                                                <label
                                                    htmlFor="artwork-description">
                                                    Description
                                                </label>
                                                <textarea
                                                    id          ="artwork-description"
                                                    placeholder ="Give this artwork a short description..."
                                                    value       ={this.props.artworkInfo.description}
                                                    maxLength   ="1500"/>
                                            </li>
                                            <li>
                                                <div className="artwork-colors">
                                                        <label className="color-heading center">
                                                            Color
                                                        </label>
                                                        <div className="color-circle-wrapper">
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
                                            </li>


                                        </ul>
                                    </fieldset>
                                </form>
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
