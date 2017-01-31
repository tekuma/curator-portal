// Libs
import React      from 'react';
import Firebase   from 'firebase';
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
        reviewItems: [
            {
                imageURL: 'url(assets/images/artwork-substitute.png',
                artwork_name: 'Starry Night',
                artist_name: 'Vincent Van Gogh',
                year: '1888',
                tags: [
                    {id: 1, text: '#art'},
                    {id: 2, text: '#impasto'},
                    {id: 3, text: '#night'},
                    {id: 4, text: '#stars'},
                    {id: 5, text: '#blue'},
                    {id: 6, text: '#sky'},
                    {id: 7, text: '#tree'}
                    ],
                description: 'Swirls of wind, bright sky filled with yellow stars, remniscent of candles light in an abandoned room.',
                submitted: '2016-11-26T20:33:35.393Z',
                status: 'In Review',
                memo:''
            }
        ],
        artworkPreviewIsOpen: false,
        artworkDescriptionIsOpen: false,
        reviewInfo: {
            imageURL: 'assets/images/artwork-substitute.png',
            artwork_name: 'Starry Night',
            artist_name: 'Vincent Van Gogh',
            year: '1888',
            tags: [
                {id: 1, text: '#art'},
                {id: 2, text: '#impasto'},
                {id: 3, text: '#night'},
                {id: 4, text: '#stars'},
                {id: 5, text: '#blue'},
                {id: 6, text: '#sky'},
                {id: 7, text: '#tree'}
                ],
            description: 'Swirls of wind, bright sky filled with yellow stars, remniscent of candles light in an abandoned room.',
            submitted: '2016-11-26T20:33:35.393Z',
            status: 'In Review',
            memo:''
        }

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
                    <tbody>
                        <ReviewItem
                            item={this.state.reviewItems[0]}
                            updateItem={this.updateItem()}
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
                            updateItem={this.updateItem()}
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

    updateItem = () => {

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
