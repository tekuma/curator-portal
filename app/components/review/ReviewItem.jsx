// Libs
import React      from 'react';
import Firebase   from 'firebase';
import {WithContext as ReactTags} from 'react-tag-input';
import uuid       from 'node-uuid';
// Files


/*  this.props.item  looks like



 */

export default class ReviewItem extends React.Component {

    state = {
        status_types: ["In Review", "Approved", "Held","Rejected"]
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ReviewItem");
    }

    render() {
        let submitted = new Date(this.props.item.submitted).toUTCString();

        return(
            <tr className="review-item">
                <td
                    className="review-item-artwork">
                    <div
                        className="review-item-artwork-image"
                        style={{backgroundImage: this.props.item.imageURL}}
                        onClick={this.props.toggleArtworkPreview}
                        onTouchTap={this.props.toggleArtworkPreview}
                         />
                </td>
                <td className="review-item-details">
                    <h3 className="review-item-title">{this.props.item.artwork_name}</h3>
                    <h3 className="review-item-artist">{this.props.item.artist_name}</h3>
                    <h3 className="review-item-year">{this.props.item.year}</h3>
                </td>
                <td className="review-item-tags">
                    <div className="review-item-tags-wrapper">
                        <ReactTags
                            tags={this.props.item.tags}
                            readOnly={true}
                            />
                    </div>
                </td>
                <td className="review-item-description">
                    <div
                        onClick={this.props.toggleDescriptionPreview}
                        onTouchTap={this.props.toggleDescriptionPreview}
                        className="review-item-description-button">
                        Click
                    </div>
                </td>
                <td className="review-item-submitted">
                    <h3>{submitted}</h3>
                </td>
                <td className="review-item-status">
                    <select
                        className   ="edit-artwork-select"
                        ref         ="reviewStatus"
                        defualtValue={this.props.item.status}>
                        {this.state.status_types.map(type => {
                                return (
                                    <option
                                        key     ={uuid.v4()}
                                        value   ={type}>
                                        {type}
                                    </option>
                                );
                            })}
                    </select>
                </td>
                <td className="review-item-note">
                    <textarea
                        ref="description"
                        placeholder ="Write a short note back to the artist explaining their artwork's status..."
                        defaultValue ={this.props.item.memo}
                        maxLength ="1500"
                         />
                </td>
                <td className="review-item-review">
                    <div
                        className="review-item-review-button">
                        Review
                    </div>
                </td>
            </tr>
        );
    }

    componentDidMount() {
        console.log("++++++ReviewItem");

    }

    // =========== Methods ==============



}//END App
