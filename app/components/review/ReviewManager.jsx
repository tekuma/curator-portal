// Libs
import React      from 'react';
import firebase   from 'firebase';
import uuid       from 'node-uuid';
// Files
import ReviewItem from './ReviewItem';
import ArtworkImagePreview from './ArtworkImagePreview';
import ArtworkDescriptionPreview from './ArtworkDescriptionPreview';

// Global Variables
const pg_size = 2;
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
        approvedItems:[],
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
            return this.goToApproved();
        }
    }

    componentDidMount() {
        console.log("++++++ReviewManager");
        this.fetchSubmissions();
        setTimeout( ()=>{//NOTE
            this.fetchApproved();
        }, 15);
    }

    componentWillReceiveProps(nextProps) {

    }

    componentWillUnmount() {
        firebase.database().ref("submissions").off();
        firebase.database().ref("approved").off();
    }
    // =========== Flow Control =============

    goToPending = () => {
        const reviewWrapperStyle = {
            height: window.innerHeight - 140 - 110, // 140px = Header and Review Tabs , 110px = Pagination Arrows
            width: window.innerWidth - 40
        };
        const tableWidth = {
            width: window.innerWidth - 40 - 20
        };

        const itemTableWidth = {
            width: window.innerWidth - 40 - 40
        };

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
                        <h2>Approved</h2>
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
                            {
                                this.state.reviewItems.map(item => {

                                    return (
                                        <ReviewItem
                                            mode={"Pending"}
                                            item={item}
                                            deleteItem={this.deleteItem}
                                            saveReviewChanges={this.saveReviewChanges}
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
                <div
                    className="pagination-wrapper">
                    <div
                        className="pagination-arrow"
                        onClick={this.changePage.bind({},false)}
                        onTouchTap={this.changePage.bind({},false)}>
                        <img src="assets/images/icons/pagination-left.svg" />
                    </div>
                    <div
                        className="pagination-arrow"
                        onClick={this.changePage.bind({},true)}
                        onTouchTap={this.changePage.bind({},true)}>
                        <img src="assets/images/icons/pagination-right.svg" />
                    </div>
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

    goToApproved = () => {
        const reviewWrapperStyle = {
            height: window.innerHeight - 140 - 110, // 140px = Header and Review Tabs , 110px = Pagination Arrows
            width : window.innerWidth - 40
        };
        const tableWidth = {
            width: window.innerWidth - 40 - 20
        };
        const itemTableWidth = {
            width: window.innerWidth - 40 - 40
        };

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
                        <h2>Approved</h2>
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
                            {this.state.approvedItems.map(item => {
                                return (
                                    <ReviewItem
                                        mode={"Approved"}
                                        item={item}
                                        saveReviewChanges={this.saveReviewChanges}
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
                <div
                    className="pagination-wrapper">
                    <div
                        className="pagination-arrow"
                        onClick={this.changePage.bind({},false)}
                        onTouchTap={this.changePage.bind({},false)}>
                        <img src="assets/images/icons/pagination-left.svg" />
                    </div>
                    <div
                        className="pagination-arrow"
                        onClick={this.changePage.bind({},true)}
                        onTouchTap={this.changePage.bind({},true)}>
                        <img src="assets/images/icons/pagination-right.svg" />
                    </div>
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
     * Detaches listeners from firebase database.
     */
    detachListeners = () => {
        firebase.database().ref("submissions").off();
        firebase.database().ref("approved").off();
    }

    deleteItem = (id,branch) =>{
        let subRef = firebase.database().ref(`submissions/${id}`);
        subRef.set(null).then( ()=>{
            console.log(id," was deleted.");
        });
    }

    /**
     * [updateReviewInfo description]
     * @param  {String} artist_uid  [description]
     * @param  {String} artwork_uid [description]
     * @param  {String} description [description]
     */
    updateReviewInfo = (artist_uid,artwork_uid,description) => {
        let info = {
            artwork_uid:artwork_uid,
            artist_uid:artist_uid,
            description:description
        }
        this.setState({reviewInfo:info});
    }

    /**
     * This method first checks if the status has been changed to approve.
     * If so, it updates the status and moves the obj from the submissions
     * branch to the approved branch. Else, it updates the status/memo fields
     * on the submissions branch.
     * @param  {Object} artwork [artwork obj as in FB db]
     * @param  {String} status  ["Approve", "In Review", ..]
     * @param  {String} memo    []
     */
    saveReviewChanges = (artwork,status,memo) =>{


        if (!memo || status == "In Review") {
            let message;
            if (!memo && status == "In Review") {
                message = "Review failed. Write a review note to the artist explaining the artwork's review status and edit its review status."
            } else if (!memo) {
                message = "Review failed. Write a review note to the artist explaining the artwork's review status."
            } else {
                message = "Review failed. Edit the review status of the review item."
            }

            this.props.sendToSnackbar(message);
        } else if (status == "Approved") {
            console.log(artwork.artwork_uid);
            artwork.status = status; // "Approved"
            artwork.approved = new Date().getTime();
            artwork.memo = memo;
            artwork.new_message = true;
            let subRef = firebase.database().ref(`submissions/${artwork.artwork_uid}`);
            let aprRef = firebase.database().ref(`approved/${artwork.artwork_uid}`);
            aprRef.set(artwork).then(()=>{ // add to approved branch
                subRef.set(null).then( ()=>{ //delete item
                    console.log("Artwork: ",artwork.artwork_uid, " sent to approved");
                });
            });
            //Remove this artwork from the pending screen
            for (var i = 0; i < this.state.reviewItems.length; i++) {
                let item = this.state.reviewItems[i];
                if (item.artwork_uid == artwork.artwork_uid) {
                    let updates = this.state.reviewItems.concat([]); //deepcopy
                    updates.splice(i,1);
                    this.setState({reviewItems:updates});
                    break;
                }
            }
            let message = "Artwork has been approved, and the artist has been notified."
            this.props.sendToSnackbar(message);
        } else if (artwork.status != status || artwork.memo != memo) {
            console.log("updating db...",artwork.artwork_uid);
            artwork.status = status;
            artwork.memo = memo;
            artwork.new_message = true;
            let path = `submissions/${artwork.artwork_uid}`;
            firebase.database().ref(path).set(artwork);
            console.log("updated");
            let message = "Artwork status has been updated."
            this.props.sendToSnackbar(message);
        }
    }

    changePage = (forward) => {
        let pending = this.state.pendingScreen;
        let list,first,last,db_ref,query;
        console.log(pending,forward);
        if (pending && !forward) { // pending previous
            list  = this.state.reviewItems.concat([]);//copy
            first = list[0].submitted;
            db_ref = firebase.database().ref(`submissions`);
            db_ref.off();
            query = db_ref.orderByChild("submitted").endAt(first).limitToLast(pg_size);
            this.setState({reviewItems:[]});
            query.on("value", (snapshot)=>{
                snapshot.forEach( (childSnap)=>{
                    if (childSnap.key != 0) { //ignore the placeholder in DB
                        let data = childSnap.val();
                        function isSame(elm) {
                            return elm.artwork_uid == data.artwork_uid
                        }
                        let index = this.state.reviewItems.findIndex(isSame);
                        let list;
                        if (index != -1) { // already in array
                            list  = this.state.reviewItems.concat([]);//copy
                            list[index] = data;
                        } else {
                            list  = this.state.reviewItems.concat([data]);//copy
                        }
                        console.log(list);
                        this.setState({reviewItems:list});
                    }
                });
            });
        } else if (!pending && !forward) { // approve previous
            list  = this.state.approvedItems.concat([]);//copy
            first = list[0].approved;
            db_ref = firebase.database().ref(`approved`);
            db_ref.off();
            query  = db_ref.orderByChild("approved").endAt(first).limitToLast(pg_size);
            this.setState({approvedItems:[]});
            query.on("value", (snapshot)=>{
                snapshot.forEach( (childSnap)=>{
                    if (childSnap.key != 0) { //ignore the placeholder in DB
                        let data = childSnap.val();
                        function isSame(elm) {
                            return elm.artwork_uid == data.artwork_uid
                        }
                        let index = this.state.approvedItems.findIndex(isSame);
                        let list;
                        if (index != -1) { // already in array
                            list  = this.state.approvedItems.concat([]);//copy
                            list[index] = data;
                        } else {
                            list  = this.state.approvedItems.concat([data]);//copy
                        }
                        console.log(list);
                        this.setState({approvedItems:list});
                    }
                });
            });
        } else if (pending && forward) {
            list = this.state.reviewItems.concat([]);//copy
            last = list[list.length -1].submitted;
            db_ref = firebase.database().ref(`submissions`);
            db_ref.off();
            query = db_ref.orderByChild("submitted").startAt(last).limitToFirst(pg_size);
            this.setState({reviewItems:[]});
            query.on("value", (snapshot)=>{
                snapshot.forEach( (childSnap)=>{
                    if (childSnap.key != 0) { //ignore the placeholder in DB
                        let data = childSnap.val();
                        function isSame(elm) {
                            return elm.artwork_uid == data.artwork_uid
                        }
                        let index = this.state.reviewItems.findIndex(isSame);
                        let list;
                        if (index != -1) { // already in array
                            list  = this.state.reviewItems.concat([]);//copy
                            list[index] = data;
                        } else {
                            list  = this.state.reviewItems.concat([data]);//copy
                        }
                        console.log(list);
                        this.setState({reviewItems:list});
                    }
                });
            });
        } else if (!pending && forward) {
            list = this.state.approvedItems.concat([]);//copy
            last = list[list.length -1].approved;
            db_ref = firebase.database().ref(`approved`);
            db_ref.off();
            query = db_ref.orderByChild("approved").startAt(last).limitToFirst(pg_size);
            this.setState({approvedItems:[]});
            query.on("value", (snapshot)=>{
                snapshot.forEach( (childSnap)=>{
                    if (childSnap.key != 0) { //ignore the placeholder in DB
                        let data = childSnap.val();
                        function isSame(elm) {
                            return elm.artwork_uid == data.artwork_uid
                        }
                        let index = this.state.approvedItems.findIndex(isSame);
                        let list;
                        if (index != -1) { // already in array
                            list  = this.state.approvedItems.concat([]);//copy
                            list[index] = data;
                        } else {
                            list  = this.state.approvedItems.concat([data]);//copy
                        }
                        console.log(list);
                        this.setState({approvedItems:list});
                    }
                });
            });
        }
    }

    /**
     * Fetches submissions from the `submissions` branch of the curator-tekuma
     * firebase database. NOTE FIXME set the .indexOn rule in the firebase
     * rules for better performance.
     */
    fetchSubmissions = () => {
        let submitRef = firebase.database().ref(`submissions`);
        //NOTE submitted is #(seconds since 1970) sorted ascendingly
        submitRef.orderByChild("submitted").limitToFirst(pg_size).on("value", (snapshot)=>{
            snapshot.forEach( (childSnap)=>{
                if (childSnap.key != 0) { //ignore the placeholder in DB
                    let submit = childSnap.val();
                    function isSame(elm) {
                        return elm.artwork_uid == submit.artwork_uid
                    }
                    let index = this.state.reviewItems.findIndex(isSame);
                    let updated;
                    if (index != -1) { // already in array
                        updated = this.state.reviewItems.concat([]); //dont mutate state
                        updated[index] = submit;
                    } else {
                        updated = this.state.reviewItems.concat([submit]);
                    }
                    this.setState({reviewItems:updated});
                }
            });
        });
    }

    fetchApproved = () => {
        let pagLimit = 10;
        let appRef = firebase.database().ref(`approved`);
        appRef.orderByChild("approved").limitToFirst(pagLimit).on("value", (snapshot)=>{
            snapshot.forEach( (childSnap)=>{
                if (childSnap.key != 0) {
                    let item = childSnap.val();
                    function isSame(elm) {
                        return elm.artwork_uid == item.artwork_uid
                    }
                    let index = this.state.approvedItems.findIndex(isSame);
                    let updated;
                    if (index != -1) { // already in array
                        updated = this.state.approvedItems.concat([]); //dont mutate state
                        updated[index] = item;
                    } else {
                        updated = this.state.approvedItems.concat([item]);
                    }
                    this.setState({approvedItems:updated});
                }
            });
        });
    }

    updateItem = (a,b) => {
        // what is this
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
