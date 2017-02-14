// Libs
import React                from 'react';
import uuid                 from 'node-uuid';
import { WithContext as ReactTags } from 'react-tag-input';

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

        if (this.props.artworkInfo.found) {
            var artwork_details = this.props.artworkInfo;
        } else {
            var artwork_details = {
                found: false,
                artist: null,
                title: null,
                album: null,
                year: null,
                reviewer: null,
                memo: null,
                tags: { labels: [], w3c_rgb_colors: [] },
                thumbnail512_url: ""
            };
        }

        let tags        = [];
        for (var i = 0; i < artwork_details.tags.labels.length; i++) {
            let tag = artwork_details.tags.labels[i];
            tags.push({id:i, text:tag});
        }

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

        let image = "assets/images/artwork-substitute.png";

        if (artwork_details.thumbnail512_url){
            imageURL = artwork_details.thumbnail512_url;
        }

        let previewImage = {
            backgroundImage: 'url(' + image + ')'
        }

        const dialogHeight = {
            height: (window.innerHeight - 60) * 0.97
        }

        return (
            <div
                className={this.props.detailBoxIsOpen ? "artwork-detail-dialog open" : "artwork-detail-dialog"}
                onClick={this.props.toggleDetailBox}
                onTouchTap={this.props.toggleDetailBox}
                style={dialogHeight}>
                <div className="artwork-preview">
                    <div
                        className="artwork-image"
                        style={previewImage}>
                    </div>
                </div>
                <div className="artwork-info-wrapper">
                    <div className="artwork-details">
                        <div
                            className="artwork-title">
                            {!artwork_details.title || artwork_details.title == "" ?
                                "Untitled Artwork"
                                :
                                artwork_details.title
                            }
                        </div>
                        <div
                            className="artwork-artist">
                            {!artwork_details.artist || artwork_details.artist == "" ?
                                "Untitled Artist"
                                :
                                artwork_details.artist
                            }
                        </div>
                        <div
                            className="artwork-year">
                            {!artwork_details.year || artwork_details.year == "" ?
                                "No year specified"
                                :
                                artwork_details.year
                            }
                        </div>
                    </div>
                    <div className="other-artwork-details">
                        {!artwork_details.memo || artwork_details.memo == "" ?
                            null
                            :
                            <div>
                                <h4 className="artwork-review-heading">
                                    Review Notes
                                </h4>
                                <div
                                    className="artwork-review">
                                    &#8220;{artwork_details.memo}&#8221;
                                    <div className="artwork-reviewer">{artwork_details.reviewer}</div>
                                </div>
                            </div>
                        }
                        {!artwork_details.album || artwork_details.album == "" ?
                            null
                            :
                            <div>
                                <h4 className="artwork-album-heading">
                                    Album
                                </h4>
                                <div
                                    className="artwork-album">
                                    {artwork_details.album}
                                </div>
                            </div>
                        }
                        {tags.length == 0 ?
                            null
                            :
                            <div>
                                <h4 className="artwork-tags-heading">
                                    Tags
                                </h4>
                                <div className="artwork-tags">
                                    <ReactTags
                                        tags={tags}
                                        readOnly={true}
                                        />
                                </div>
                            </div>
                        }
                        {!artwork_details.description || artwork_details.description == "" ?
                            null
                            :
                            <div>
                                <h4
                                    className="artwork-description-heading">
                                    Description
                                </h4>
                                <div
                                    className="artwork-description">
                                    {artwork_details.description || ""}
                                </div>
                            </div>
                        }
                        {colors.length == 0 ?
                            null
                            :
                            <div>
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
                        }

                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        console.log("+++++ArtworkDetailBoxDialog");
    }

    componentWillReceiveProps(nextProps) {

    }
}
