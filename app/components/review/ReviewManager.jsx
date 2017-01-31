// Libs
import React      from 'react';
import firebase   from 'firebase';
import uuid       from 'node-uuid';
// Files
import ReviewItem from './ReviewItem';
import ArtworkImagePreview from './ArtworkImagePreview';
import ArtworkDescriptionPreview from './ArtworkDescriptionPreview';

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
        artworkPreviewIsOpen: false,
        artworkDescriptionIsOpen: false,
        reviewInfo: {}
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

    componentWillReceiveProps(nextProps) {

    }
    // =========== Flow Control =============

    goToPending = () => {

        const reviewWrapperStyle = {
            height: window.innerHeight - 140 - 30,
            width: window.innerWidth - 40
        }

        const tableWidth = {
            width: window.innerWidth - 40 - 20
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
                <table
                    className="review-headings-wrapper"
                    style={reviewWrapperStyle}>
                    <thead className="review-headings">
                        <tr>
                            <th className="review-artwork-heading">Artwork</th>
                            <th className="review-details-heading">Details</th>
                            <th className="review-tags-heading">Tags</th>
                            <th className="review-description-heading">Description</th>
                            <th className="review-submitted-heading">Submitted</th>
                            <th className="review-status-heading">Status</th>
                            <th className="review-note-heading">Review Note</th>
                            <th className="review-button-heading"></th>
                        </tr>
                    </thead>

                </table>
                <div className="review-wrapper"
                    style={reviewWrapperStyle}>
                    <table
                        className="review-table"
                        style={tableWidth}>
                        <tbody>
                            {this.state.reviewItems.map(item => {
                                    return (
                                        <ReviewItem
                                            item={item}
                                            approveArtwork={this.approveArtwork}
                                            updateItem={this.updateItem}
                                            updateReviewInfo={this.updateReviewInfo}
                                            toggleArtworkPreview={this.toggleArtworkPreview}
                                            toggleDescriptionPreview={this.toggleDescriptionPreview}
                                         />
                                    );
                                })}
                        </tbody>
                	</table>
                </div>
                <ArtworkImagePreview
                    toggleArtworkPreview={this.toggleArtworkPreview}
                    artworkPreviewIsOpen={this.state.artworkPreviewIsOpen}
                    reviewInfo={this.state.reviewInfo}
                 />
                <ArtworkDescriptionPreview
                         toggleDescriptionPreview={this.toggleDescriptionPreview}
                         artworkDescriptionIsOpen={this.state.artworkDescriptionIsOpen}
                         reviewInfo={this.state.reviewInfo}
                      />
                <div
                    onClick     ={this.props.toggleNav}
                    onTouchTap  ={this.props.toggleNav}
                    className   ={this.props.navIsOpen ? "site-overlay open" : "site-overlay"} />
            </div>
        );
    }

    goToReviewed = () => {

        const reviewWrapperStyle = {
            height: window.innerHeight - 140 - 30,
            width: window.innerWidth - 40
        }

        const tableWidth = {
            width: window.innerWidth - 40 - 20
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
                <table
                    className="review-headings-wrapper"
                    style={reviewWrapperStyle}>
                    <thead className="review-headings">
                        <tr>
                            <th className="review-artwork-heading">Artwork</th>
                            <th className="review-details-heading">Details</th>
                            <th className="review-tags-heading">Tags</th>
                            <th className="review-description-heading">Description</th>
                            <th className="review-submitted-heading">Submitted</th>
                            <th className="review-status-heading">Status</th>
                            <th className="review-note-heading">Review Note</th>
                            <th className="review-button-heading"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <ReviewItem
                            item={this.state.reviewItems[0]}
                            approveArtwork={this.approveArtwork}
                            updateReviewInfo={this.updateReviewInfo}
                            updateItem={this.updateItem}
                            toggleArtworkPreview={this.toggleArtworkPreview}
                            toggleDescriptionPreview={this.toggleDescriptionPreview}
                         />
                    </tbody>
                </table>
                <div className="review-wrapper"
                    style={reviewWrapperStyle}>
                    <table
                        className="review-table"
                        style={tableWidth}>
                        <tbody>
                            {this.state.reviewItems.map(item => {
                                    return (
                                        <ReviewItem
                                            item={item}
                                            updateItem={this.updateItem()}
                                            toggleArtworkPreview={this.toggleArtworkPreview}
                                            toggleDescriptionPreview={this.toggleDescriptionPreview}
                                         />
                                    );
                                })}
                        </tbody>
                	</table>
                </div>
                <ArtworkImagePreview
                    toggleArtworkPreview={this.toggleArtworkPreview}
                    artworkPreviewIsOpen={this.state.artworkPreviewIsOpen}
                    reviewInfo={this.state.reviewInfo}
                 />
                <ArtworkDescriptionPreview
                         toggleDescriptionPreview={this.toggleDescriptionPreview}
                         artworkDescriptionIsOpen={this.state.artworkDescriptionIsOpen}
                         reviewInfo={this.state.reviewInfo}
                      />
                <div
                    onClick     ={this.props.toggleNav}
                    onTouchTap  ={this.props.toggleNav}
                    className   ={this.props.navIsOpen ? "site-overlay open" : "site-overlay"} />
            </div>
        );
    }

    // =========== Methods ==============


    updateReviewInfo = (artist_uid,artwork_uid,description) =>{
        let info = {
            artwork_uid:artwork_uid,
            artist_uid:artist_uid,
            description:description
        }
        this.setState({reviewInfo:info});
    }

    
    approveArtwork = (artwork,status,memo) =>{
        console.log(artwork);
        if (status == "Approved") {
            console.log("approved..",artwork,status,memo);
        }
    }

    /**
     * Fetches submissions from the `submissions` branch of the curator-tekuma
     * firebase database. NOTE FIXME set the .indexOn rule in the firebase
     * rules for better performance.
     * FIXME: Handle pagination. Do not just request every submission.
     */
    fetchSubmissions = () => {
        this.setState({reviewItems:[]});
        let submitRef = firebase.database().ref(`submissions`);
        submitRef.orderByChild('submitted').on("value", (snapshot)=>{
            let limit = 5; // pagination of some kind
            snapshot.forEach( (childSnap)=>{
                if (childSnap.key != 0) { //ignore the placeholder in DB
                    let submit = childSnap.val();
                    limit--
                    this.setState({reviewItems: this.state.reviewItems.concat([submit])});
                    if (limit == 0) return true;
                }
            });

        });
    }

    updateItem = (a,b) => {
        console.log(a,b);

    }

    toggleReviewScreen = () => {
        this.setState({
            pendingScreen: !this.state.pendingScreen
        });
    }

    toggleArtworkPreview = () => {
        this.setState({
            artworkPreviewIsOpen: !this.state.artworkPreviewIsOpen
        });
    }

    toggleDescriptionPreview = () => {
        this.setState({
            artworkDescriptionIsOpen: !this.state.artworkDescriptionIsOpen
        });
    }

}//END App
