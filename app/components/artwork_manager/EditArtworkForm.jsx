// Libs
import React from 'react';
import uuid from 'node-uuid';
import { WithContext as ReactTags } from 'react-tag-input';

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
        if (this.props.value.found) {
            var artwork_details = this.props.value;
        } else {
            var artwork_details = {
                found: false,
                artist: null,
                title: null,
                album: null,
                year: null,
                tags: { labels: [], w3c_rgb_colors: [] },
                thumbnail512_url: ""
            };
        }
        let tags        = [];
        for (var i = 0; i < artwork_details.tags.labels.length; i++) {
            let tag = artwork_details.tags.labels[i];
            tags.push({id:i, text:tag});
        }
        let suggestions = this.state.suggestions;


        let errorStyle = {
            border: '1px solid #ec167c'
        };

        let colors = [];
        for (let colr of artwork_details.tags.w3c_rgb_colors) {
            let color_string = '#';
            for (let j = 0; j < 3; j++) {
                let cbyte = Number(colr[j]).toString(16);
                if (cbyte.length < 2) {
                    cbyte = '0'+cbyte;
                }
                color_string += cbyte;
            }
            colors.push({background: color_string});
        }

        let image = artwork_details.thumbnail512_url;

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
                                        {artwork_details.title}
                                    </label>

                                </li>
                                <li>
                                    <label htmlFor="artwork-artist">
                                        Artist <span className="pink">*</span>
                                    </label>
                                    <label>
                                        {artwork_details.artist}
                                    </label>
                                </li>
                                <li
                                    id="li-album"
                                    className="controls-album">
                                    <label htmlFor="edit-artwork-album">
                                        Album
                                    </label>
                                    <label>
                                        {artwork_details.album}
                                    </label>
                                </li>
                                <li>
                                    <label htmlFor="artwork-year">
                                        Year <span className="pink">*</span>
                                    </label>
                                    <label>
                                        {artwork_details.year}
                                    </label>
                                </li>
                                <li>
                                    <label htmlFor="artwork-tags">
                                        Tags
                                    </label>
                                    <ReactTags
                                        tags={tags}
                                        readOnly={true}
                                        suggestions={suggestions}
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
                                        value       = {artwork_details.description || ""}
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
        if (this.props.value.found) {
            var artwork_details = this.props.value;
        } else {
            var artwork_details = {
                found: false,
                tags: { labels: [], w3c_rgb_colors: [] }
            };
        }
        if (artwork_details.tags.labels) {
            let allTags  = artwork_details.tags.labels;
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

handleTags = (data) => {
    //pass
}


}

EditArtworkForm.propTypes = {
    value: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired
};
