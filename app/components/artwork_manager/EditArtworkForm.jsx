// Libs
import React from 'react';
import uuid from 'node-uuid';
import { WithOutContext as ReactTags } from 'react-tag-input';

/**
 * TODO
 */
export default class EditArtworkForm extends React.Component {

    state = {
        tags: [],
        suggestions: []
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----EditArtworkForm");
    }

    render() {
        let oldArtwork  = this.props.value;
        let tags        = this.state.tags;
        let suggestions = this.state.suggestions;


        let errorStyle = {
            border: '1px solid #ec167c'
        };

        let colors = [];

        if (this.props.value.colors) {
            for (let i = 0; i < Object.keys(this.props.value.colors).length; i++) {
                let color = this.props.value.colors[i].hex;
                colors.push({
                    background: color
                });
            }
        }

        let image = "";

        let previewImage = {
            backgroundImage: 'url(' + image + ')'
        }

        return (
            <div className="artwork-edit-dialog">
                <div className="artwork-preview-colors">
                    <div className="artwork-preview-wrapper">
                        <div
                            className="artwork-preview"
                            style={previewImage}>
                        </div>
                    </div>
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
                                        {this.props.value.title}
                                    </label>

                                </li>
                                <li>
                                    <label htmlFor="artwork-artist">
                                        Artist <span className="pink">*</span>
                                    </label>
                                    <label>
                                        {this.props.value.artist}
                                    </label>
                                </li>
                                <li
                                    id="li-album"
                                    className="controls-album">
                                    <label htmlFor="edit-artwork-album">
                                        Album
                                    </label>
                                    <label>
                                        {this.props.value.album}
                                    </label>
                                </li>
                                <li>
                                    <label htmlFor="artwork-year">
                                        Year <span className="pink">*</span>
                                    </label>
                                    <label>
                                        {this.props.value.year}
                                    </label>
                                </li>
                                <li>
                                    <label htmlFor="artwork-tags">
                                        Tags
                                    </label>
                                    <ReactTags
                                        tags={tags}
                                        readOnly={true}
                                        suggestions={suggestions}/>
                                </li>
                                <li>
                                    <label
                                        htmlFor="artwork-description">
                                        Description
                                    </label>
                                    <textarea
                                        id          ="artwork-description"
                                        placeholder ="Give this artwork a short description..."
                                        value       ={this.props.value.description}
                                        maxLength   ="1500"/>
                                </li>

                            </ul>
                        </fieldset>
                    </form>
                </div>
            </div>

        );
    }

    componentDidMount() {
        console.log("+++++EditArtworkForm");

        // Get Tags
        if (this.props.value.tags) {
            let allTags  = this.props.value.tags;
            let tagKeys  = Object.keys(allTags);
            let tags = [];

            for (let i = 0; i < tagKeys.length; i++) {
                tags.push(allTags[i]);
            }

            //Set tags to state
            this.setState({
                tags : tags
            });
        }

        // Get suggestions
        let suggestions = [];
        // let artworks = this.props.user.artworks;
        //
        // for (let artwork in artworks) {
        //     let artworkTags = artworks[artwork]["tags"];
        //
        //     if (artworkTags) {
        //         for (let i = 0; i < Object.keys(artworkTags).length; i++) {
        //             let text = artworkTags[i].text;
        //             if (suggestions.indexOf(text) == -1) {
        //                 suggestions.push(text);
        //             }
        //         }
        //     }
        // }

        this.setState({
            suggestions : suggestions
        });
    }

    componentWillReceiveProps(nextProps) {
        //pass
    }

// ============= Methods ===============



}

EditArtworkForm.propTypes = {
    value: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired
};
