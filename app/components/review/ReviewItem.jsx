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
        status_types: ["In Review", "Approved", "Held","Rejected"],
        status:""
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ReviewItem");
    }

    render() {
        let submitted = new Date(this.props.item.submitted).toUTCString();
        let thumbnail_url = "url('assets/images/artwork-substitute.png')";
        if (this.props.item.artist_uid && this.props.item.artwork_uid) {
            thumbnail_url = `url(https://storage.googleapis.com/art-uploads/portal/${this.props.item.artist_uid}/thumb128/${this.props.item.artwork_uid})`;
        }
        return(
            <tr className="review-item">
                <td
                    className="review-item-artwork">
                    <div
                        className="review-item-artwork-image"
                        style={{backgroundImage: thumbnail_url}}
                        onClick={this.handleArtworkPreview}
                        onTouchTap={this.handleArtworkPreview}
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
                        onClick={this.handleDescriptionPreview}
                        onTouchTap={this.handleDescriptionPreview}
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
                        ref         ="review_status"
                        value={this.state.status}
                        onChange ={this.handleSelect}
                        >
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
                        ref="memo"
                        placeholder ="Write a short note back to the artist explaining their artwork's status..."
                        defaultValue ={this.props.item.memo}
                        maxLength ="1500"
                         />
                </td>
                <td className="review-item-review">

                    {this.props.mode === "Pending" ?
                        <div>
                        <div
                            className="review-item-review-button"
                            onClick={this.handleReviewButton}>
                            Update
                        </div>
                        <div
                            className="review-item-review-button"
                            onClick={this.handleDelete}>
                            Delete
                        </div>
                        </div>
                    :
                <div></div> }
                </td>
            </tr>
        );
    }

    componentDidMount() {
        console.log("++++++ReviewItem");
        console.log(this.props.item.status);
        this.setState({
            status:this.props.item.status
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.item.status) {
            this.setState({
                status:nextProps.item.status
            })
        }
    }

    // =========== Methods ==============


    handleDelete = (e) =>{
        let id = this.props.item.artwork_uid;
        this.props.deleteItem(id);
    }

    handleSelect = (e) => {
        let status = this.refs.review_status.value;
        console.log("status->",status);
        this.setState({status:status});
    }

    handleReviewButton = () => {
        let status = this.refs.review_status.value;
        let memo   = this.refs.memo.value;
        this.props.saveReviewChanges(this.props.item,status,memo);
        this.setState({
            status:status
        })
    }

    handleArtworkPreview = () => {
        this.props.updateReviewInfo(this.props.item.artist_uid,this.props.item.artwork_uid,null)
        this.props.toggleArtworkPreview();
    }

    handleDescriptionPreview = () => {
        let descr = "this artwork has no given description :( ";
        if (this.props.item.description) {
            descr = this.props.item.description;
        }
        this.props.updateReviewInfo(null,null,descr);
        this.props.toggleDescriptionPreview();
    }


}//END App
