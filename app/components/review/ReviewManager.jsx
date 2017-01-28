// Libs
import React      from 'react';
import Firebase   from 'firebase';
import uuid       from 'node-uuid';
// Files
import ReviewItem from './ReviewItem';
import { WithContext as ReactTags } from 'react-tag-input';

/*  a Submission object looks like:
    -jd7Jd21ka: {
        artwork_uid:"-jd7Jd21ka",
        artist_uid :"sakUdjf2118SusQLXa",
        submitted  :"2016-11-26T20:33:35.393Z",
        status     :"Unseen",
        artist_name:"Pablo Picasso",
        memo: ""

    }
 */

export default class ReviewManager extends React.Component {
    state = {
        pendingScreen: true,        // Will determine which screen user is in (pending or reviewed)
        reviewItems: [],
        status_types: ["In Review", "Approved", "Held","Rejected"]
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ReviewManager");
    }

    render() {
        if (this.state.pendingScreen) {
            return this.goToPending();
        } else {
            return this.goToReviewed();
        }
    }

    componentDidMount() {
        console.log("++++++ReviewManager");
        this.fetchSubmissions();
    }

    // =========== Flow Control =============

    goToPending = () => {

        const reviewWrapperStyle = {
            height: window.innerHeight - 140 - 30,
            width: window.innerWidth - 40
        }

        const tableWidth = {
            width: window.innerWidth - 40 - 40
        }

        const itemTableWidth = {
            width: window.innerWidth - 40 - 40
        }

        let tags = [
            {id: 1, text: "#art"},
            {id: 2, text: "#impasto"},
            {id: 3, text: "#night"},
            {id: 4, text: "#stars"},
            {id: 5, text: "#blue"},
            {id: 6, text: "#sky"},
            {id: 7, text: "#tree"}
        ];

        let artworkImage = {
            backgroundImage: 'url(assets/starry.jpg)'
        }

        return (
            <div>
                <div className="review-sections">
                    <div
                        className="review-section-pending selected"
                        onClick={this.toggleReviewScreen}>
                        <h2>Pending</h2>
                    </div>
                    <div
                        className="review-section-reviewed"
                        onClick={this.toggleReviewScreen}>
                        <h2>Reviewed</h2>
                    </div>
                </div>
                <div className="review-wrapper"
                    style={reviewWrapperStyle}>
                    <table
                        className="review-table"
                        style={tableWidth}>
                		<thead className="review-headings">
                			<tr>
                                <th>Artwork</th>
                				<th>Details</th>
                				<th>Tags</th>
                				<th>Description</th>
                				<th>Submitted</th>
                				<th>Status</th>
                				<th>Review Note</th>
                				<th></th>
                			</tr>
                		</thead>
                        <tbody>
                            <tr className="review-item">
                                <td
                                    className="review-item-artwork">
                                    <div
                                        className="review-item-artwork-image"
                                        style={{backgroundImage: 'url(assets/images/artwork-substitute.png)'}} />
                                </td>
                                <td className="review-item-details">
                                    <h3 className="review-item-title">Starry Night</h3>
                                    <h3 className="review-item-artist">Van Gogh</h3>
                                    <h3 className="review-item-year">1888</h3>
                                </td>
                                <td className="review-item-tags">
                                    <div className="review-item-tags-wrapper">
                                        <ReactTags
                                            tags={tags}
                                            readOnly={true}
                                            />
                                    </div>
                                </td>
                                <td className="review-item-description">
                                    <div
                                        className="review-item-description-button">
                                        Click<sup className="pink"> | </sup>Hover
                                    </div>
                                </td>
                                <td className="review-item-submitted">
                                    <h3>Mar 26, 2017</h3>
                                </td>
                                <td className="review-item-status">
                                    <select
                                        className   ="edit-artwork-select"
                                        ref         ="editAlbum"
                                        value="In Review">
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
                                        placeholder ="Write a short note back to the artist explaining their artwork's status..."
                                        value       ={""}
                                        maxLength   ="1500" />
                                </td>
                                <td className="review-item-review">
                                    <div
                                        className="review-item-review-button">
                                        Review
                                    </div>
                                </td>
                            </tr>
                            <tr className="review-item">
                                <td
                                    className="review-item-artwork">
                                    <div
                                        className="review-item-artwork-image"
                                        style={{backgroundImage: 'url(assets/images/artwork-substitute.png)'}} />
                                </td>
                                <td className="review-item-details">
                                    <h3 className="review-item-title">Starry Night</h3>
                                    <h3 className="review-item-artist">Van Gogh</h3>
                                    <h3 className="review-item-year">1888</h3>
                                </td>
                                <td className="review-item-tags">
                                    <div className="review-item-tags-wrapper">
                                        <ReactTags
                                            tags={tags}
                                            readOnly={true}
                                            />
                                    </div>
                                </td>
                                <td className="review-item-description">
                                    <div
                                        className="review-item-description-button">
                                        Click<sup className="pink"> | </sup>Hover
                                    </div>
                                </td>
                                <td className="review-item-submitted">
                                    <h3>Mar 26, 2017</h3>
                                </td>
                                <td className="review-item-status">
                                    <select
                                        className   ="edit-artwork-select"
                                        ref         ="editAlbum"
                                        value="In Review">
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
                                        placeholder ="Write a short note back to the artist explaining their artwork's status..."
                                        value       ={""}
                                        maxLength   ="1500" />
                                </td>
                                <td className="review-item-review">
                                    <div
                                        className="review-item-review-button">
                                        Review
                                    </div>
                                </td>
                            </tr>
                            <tr className="review-item">
                                <td
                                    className="review-item-artwork">
                                    <div
                                        className="review-item-artwork-image"
                                        style={{backgroundImage: 'url(assets/images/artwork-substitute.png)'}} />
                                </td>
                                <td className="review-item-details">
                                    <h3 className="review-item-title">Starry Night</h3>
                                    <h3 className="review-item-artist">Van Gogh</h3>
                                    <h3 className="review-item-year">1888</h3>
                                </td>
                                <td className="review-item-tags">
                                    <div className="review-item-tags-wrapper">
                                        <ReactTags
                                            tags={tags}
                                            readOnly={true}
                                            />
                                    </div>
                                </td>
                                <td className="review-item-description">
                                    <div
                                        className="review-item-description-button">
                                        Click<sup className="pink"> | </sup>Hover
                                    </div>
                                </td>
                                <td className="review-item-submitted">
                                    <h3>Mar 26, 2017</h3>
                                </td>
                                <td className="review-item-status">
                                    <select
                                        className   ="edit-artwork-select"
                                        ref         ="editAlbum"
                                        value="In Review">
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
                                        placeholder ="Write a short note back to the artist explaining their artwork's status..."
                                        value       ={""}
                                        maxLength   ="1500" />
                                </td>
                                <td className="review-item-review">
                                    <div
                                        className="review-item-review-button">
                                        Review
                                    </div>
                                </td>
                            </tr>
                            <tr className="review-item">
                                <td
                                    className="review-item-artwork">
                                    <div
                                        className="review-item-artwork-image"
                                        style={{backgroundImage: 'url(assets/images/artwork-substitute.png)'}} />
                                </td>
                                <td className="review-item-details">
                                    <h3 className="review-item-title">Starry Night</h3>
                                    <h3 className="review-item-artist">Van Gogh</h3>
                                    <h3 className="review-item-year">1888</h3>
                                </td>
                                <td className="review-item-tags">
                                    <div className="review-item-tags-wrapper">
                                        <ReactTags
                                            tags={tags}
                                            readOnly={true}
                                            />
                                    </div>
                                </td>
                                <td className="review-item-description">
                                    <div
                                        className="review-item-description-button">
                                        Click<sup className="pink"> | </sup>Hover
                                    </div>
                                </td>
                                <td className="review-item-submitted">
                                    <h3>Mar 26, 2017</h3>
                                </td>
                                <td className="review-item-status">
                                    <select
                                        className   ="edit-artwork-select"
                                        ref         ="editAlbum"
                                        value="In Review">
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
                                        placeholder ="Write a short note back to the artist explaining their artwork's status..."
                                        value       ={""}
                                        maxLength   ="1500" />
                                </td>
                                <td className="review-item-review">
                                    <div
                                        className="review-item-review-button">
                                        Review
                                    </div>
                                </td>
                            </tr>
                            <tr className="review-item">
                                <td
                                    className="review-item-artwork">
                                    <div
                                        className="review-item-artwork-image"
                                        style={{backgroundImage: 'url(assets/images/artwork-substitute.png)'}} />
                                </td>
                                <td className="review-item-details">
                                    <h3 className="review-item-title">Starry Night</h3>
                                    <h3 className="review-item-artist">Van Gogh</h3>
                                    <h3 className="review-item-year">1888</h3>
                                </td>
                                <td className="review-item-tags">
                                    <div className="review-item-tags-wrapper">
                                        <ReactTags
                                            tags={tags}
                                            readOnly={true}
                                            />
                                    </div>
                                </td>
                                <td className="review-item-description">
                                    <div
                                        className="review-item-description-button">
                                        Click<sup className="pink"> | </sup>Hover
                                    </div>
                                </td>
                                <td className="review-item-submitted">
                                    <h3>Mar 26, 2017</h3>
                                </td>
                                <td className="review-item-status">
                                    <select
                                        className   ="edit-artwork-select"
                                        ref         ="editAlbum"
                                        value="In Review">
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
                                        placeholder ="Write a short note back to the artist explaining their artwork's status..."
                                        value       ={""}
                                        maxLength   ="1500" />
                                </td>
                                <td className="review-item-review">
                                    <div
                                        className="review-item-review-button">
                                        Review
                                    </div>
                                </td>
                            </tr>
                            <tr className="review-item">
                                <td
                                    className="review-item-artwork">
                                    <div
                                        className="review-item-artwork-image"
                                        style={{backgroundImage: 'url(assets/images/artwork-substitute.png)'}} />
                                </td>
                                <td className="review-item-details">
                                    <h3 className="review-item-title">Starry Night</h3>
                                    <h3 className="review-item-artist">Van Gogh</h3>
                                    <h3 className="review-item-year">1888</h3>
                                </td>
                                <td className="review-item-tags">
                                    <div className="review-item-tags-wrapper">
                                        <ReactTags
                                            tags={tags}
                                            readOnly={true}
                                            />
                                    </div>
                                </td>
                                <td className="review-item-description">
                                    <div
                                        className="review-item-description-button">
                                        Click<sup className="pink"> | </sup>Hover
                                    </div>
                                </td>
                                <td className="review-item-submitted">
                                    <h3>Mar 26, 2017</h3>
                                </td>
                                <td className="review-item-status">
                                    <select
                                        className   ="edit-artwork-select"
                                        ref         ="editAlbum"
                                        value="In Review">
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
                                        placeholder ="Write a short note back to the artist explaining their artwork's status..."
                                        value       ={""}
                                        maxLength   ="1500" />
                                </td>
                                <td className="review-item-review">
                                    <div
                                        className="review-item-review-button">
                                        Review
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                	</table>
                </div>
                <div
                    className="review-item-wrapper">
                    {this.state.reviewItems.map(item => {
                        return (
                            <ReviewItem
                                item={item}
                                writeMemo={this.writeMemo}
                                updateSubmissionStatus={this.updateSubmissionStatus}
                             />
                        );
                    })}
                </div>
                <div
                    onClick     ={this.props.toggleNav}
                    onTouchTap  ={this.props.toggleNav}
                    className   ={this.props.navIsOpen ? "site-overlay open" : "site-overlay"} />
            </div>
        );
    }

    goToReviewed = () => {
        return (
            <div>
                <div className="review-sections">
                    <div
                        className="review-section-pending"
                        onClick={this.toggleReviewScreen}>
                        <h2>Pending</h2>
                    </div>
                    <div
                        className="review-section-reviewed selected"
                        onClick={this.toggleReviewScreen}>
                        <h2>Reviewed</h2>
                    </div>
                </div>
                {this.state.reviewItems.map(item => {
                    return (
                        <ReviewItem
                            item={item}
                            writeMemo={this.writeMemo}
                            updateSubmissionStatus={this.updateSubmissionStatus}
                         />
                    );
                })}
                <div
                    onClick     ={this.props.toggleNav}
                    onTouchTap  ={this.props.toggleNav}
                    className   ={this.props.navIsOpen ? "site-overlay open" : "site-overlay"} />
            </div>
        );
    }

    // =========== Methods ==============

    /**
     * Fetches submissions from the `submissions` branch of the curator-tekuma
     * firebase database. NOTE FIXME set the .indexOn rule in the firebase
     * rules for better performance.
     */
    fetchSubmissions = () => {
        let submitRef = firebase.database().ref(`submissions`);
        submitRef.orderByChild('submitted').on("value", (snapshot)=>{
            let data = snapshot.val();
            console.log("Submit:",data.submitted);
        });
    }

    writeMemo = () => {

    }

    updateSubmissionStatus = (status) => {
        if (status === "Accepted" || status === "Deferred" || status === "Held") {

        }
    }

    toggleReviewScreen = () => {
        this.setState({
            pendingScreen: !this.state.pendingScreen
        });
    }

}//END App
