// Libs
import React      from 'react';
import firebase   from 'firebase';
import uuid       from 'node-uuid';
// Files
import ReviewItem from './ReviewItem';
import ArtworkImagePreview from './ArtworkImagePreview';
import ArtworkDescriptionPreview from './ArtworkDescriptionPreview';
import reviewTabs from '../../constants/reviewTabs';

// Global Variables
const pg_size = 5;
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
        currentTab              : reviewTabs.PENDING, // Will determine which screen user is in (pending, reviewed, held, declined)
        artworkDescriptionIsOpen: false,
        artworkPreviewIsOpen    : false,
        approvedItems           : [], // current page of approved items
        declinedItems           : [], // current page of decliend items
        reviewItems             : [], // current page of pending items
        heldItems               : [], // current page of held items
        reviewInfo              : {}  // details for pop-ups like description
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ReviewManager");
    }

    render() {
        if (this.state.currentTab == reviewTabs.PENDING) {
            return this.goToPending();
        } else if (this.state.currentTab == reviewTabs.APPROVED) {
            return this.goToApproved();
        } else if (this.state.currentTab == reviewTabs.HELD) {
            return this.goToHeld();
        } else {
            return this.goToDeclined();
        }
    }

    componentDidMount() {
        console.log("++++++ReviewManager");
        //NOTE: should these be cascaded?
        this.fetchSubmissions();
        setTimeout( ()=>{
            this.fetchApproved();
            setTimeout( ()=>{
                this.fetchDeclined();
                setTimeout( ()=>{
                    this.fetchHeld();
                }, 25);
            }, 25);
        }, 25);
    }

    componentWillReceiveProps(nextProps) {

    }

    componentWillUnmount() {
        firebase.database().ref("submissions").off();
        firebase.database().ref("approved").off();
        firebase.database().ref("declined").off();
    }
    // =========== Flow Control =============

//fix
    goToPending = () => {
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
                        className={(this.state.currentTab == reviewTabs.PENDING) ? "review-section-pending selected" : "review-section-pending"}
                        onClick={this.changeReviewScreen.bind({}, reviewTabs.PENDING)}>
                        <h2>Pending</h2>
                    </div>
                    <div
                        className={(this.state.currentTab == reviewTabs.APPROVED) ? "review-section-pending selected" : "review-section-pending"}
                        onClick={this.changeReviewScreen.bind({}, reviewTabs.APPROVED)}>
                        <h2>Approved</h2>
                    </div>
                    <div
                        className={(this.state.currentTab == reviewTabs.HELD) ? "review-section-pending selected" : "review-section-pending"}
                        onClick={this.changeReviewScreen.bind({}, reviewTabs.HELD)}>
                        <h2>Held</h2>
                    </div>
                    <div
                        className={(this.state.currentTab == reviewTabs.DECLINED) ? "review-section-pending selected" : "review-section-pending"}
                        onClick={this.changeReviewScreen.bind({}, reviewTabs.DECLINED)}>
                        <h2>Declined</h2>
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
                        onTouchTap={this.changePage.bind({},false)}
                        title="Previous">
                        <img src="assets/images/icons/pagination-left.svg" />
                    </div>
                    <div
                        className="pagination-arrow"
                        onClick={this.changePage.bind({},true)}
                        onTouchTap={this.changePage.bind({},true)}
                        title="Next">
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
                        className={(this.state.currentTab == reviewTabs.PENDING) ? "review-section-pending selected" : "review-section-pending"}
                        onClick={this.changeReviewScreen.bind({}, reviewTabs.PENDING)}>
                        <h2>Pending</h2>
                    </div>
                    <div
                        className={(this.state.currentTab == reviewTabs.APPROVED) ? "review-section-pending selected" : "review-section-pending"}
                        onClick={this.changeReviewScreen.bind({}, reviewTabs.APPROVED)}>
                        <h2>Approved</h2>
                    </div>
                    <div
                        className={(this.state.currentTab == reviewTabs.HELD) ? "review-section-pending selected" : "review-section-pending"}
                        onClick={this.changeReviewScreen.bind({}, reviewTabs.HELD)}>
                        <h2>Held</h2>
                    </div>
                    <div
                        className={(this.state.currentTab == reviewTabs.DECLINED) ? "review-section-pending selected" : "review-section-pending"}
                        onClick={this.changeReviewScreen.bind({}, reviewTabs.DECLINED)}>
                        <h2>Declined</h2>
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

    goToHeld = () => {
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
                        className={(this.state.currentTab == reviewTabs.PENDING) ? "review-section-pending selected" : "review-section-pending"}
                        onClick={this.changeReviewScreen.bind({}, reviewTabs.PENDING)}>
                        <h2>Pending</h2>
                    </div>
                    <div
                        className={(this.state.currentTab == reviewTabs.APPROVED) ? "review-section-pending selected" : "review-section-pending"}
                        onClick={this.changeReviewScreen.bind({}, reviewTabs.APPROVED)}>
                        <h2>Approved</h2>
                    </div>
                    <div
                        className={(this.state.currentTab == reviewTabs.HELD) ? "review-section-pending selected" : "review-section-pending"}
                        onClick={this.changeReviewScreen.bind({}, reviewTabs.HELD)}>
                        <h2>Held</h2>
                    </div>
                    <div
                        className={(this.state.currentTab == reviewTabs.DECLINED) ? "review-section-pending selected" : "review-section-pending"}
                        onClick={this.changeReviewScreen.bind({}, reviewTabs.DECLINED)}>
                        <h2>Declined</h2>
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
                            {this.state.heldItems.map(item => {
                                return (
                                    <ReviewItem
                                        item={item}
                                        mode={"Held"}
                                        updateItem={this.updateItem}
                                        updateReviewInfo={this.updateReviewInfo}
                                        saveReviewChanges={this.saveReviewChanges}
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

    goToDeclined = () => {
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
                        className={(this.state.currentTab == reviewTabs.PENDING) ? "review-section-pending selected" : "review-section-pending"}
                        onClick={this.changeReviewScreen.bind({}, reviewTabs.PENDING)}>
                        <h2>Pending</h2>
                    </div>
                    <div
                        className={(this.state.currentTab == reviewTabs.APPROVED) ? "review-section-pending selected" : "review-section-pending"}
                        onClick={this.changeReviewScreen.bind({}, reviewTabs.APPROVED)}>
                        <h2>Approved</h2>
                    </div>
                    <div
                        className={(this.state.currentTab == reviewTabs.HELD) ? "review-section-pending selected" : "review-section-pending"}
                        onClick={this.changeReviewScreen.bind({}, reviewTabs.HELD)}>
                        <h2>Held</h2>
                    </div>
                    <div
                        className={(this.state.currentTab == reviewTabs.DECLINED) ? "review-section-pending selected" : "review-section-pending"}
                        onClick={this.changeReviewScreen.bind({}, reviewTabs.DECLINED)}>
                        <h2>Declined</h2>
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
                            {this.state.declinedItems.map(item => {
                                return (
                                    <ReviewItem
                                        item={item}
                                        mode={"Declined"}
                                        updateItem={this.updateItem}
                                        updateReviewInfo={this.updateReviewInfo}
                                        saveReviewChanges={this.saveReviewChanges}
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
     * Handles deleting a review item.
     * @param  {String} id     [the artwork_uid]
     * @param  {String} branch [one of submissions, declined, approved ]
     */
    deleteItem = (id,branch) =>{
        if (branch == "held") {
            branch = "submissions"; // held items are still in submissions branch
        }
        if (branch == "submissions" || branch == "declined" || branch == "approved") {
            let ref = firebase.database().ref(`${branch}/${id}`);
            ref.set(null).then( ()=>{
                console.log(id," was deleted from ", branch);
            });
        } else {
            console.log(">> NOT A VALID BRANCH");
        }
    }

    /**
     * sets this.state.reviewInfo
     * @param  {String} artist_uid
     * @param  {String} artwork_uid
     * @param  {String} description
     */
    updateReviewInfo = (artist_uid,artwork_uid,description) => {
        let info = {
            artwork_uid:artwork_uid,
            description:description,
            artist_uid :artist_uid,
        }
        this.setState({reviewInfo:info});
    }

    //FIXME Replace '.set()' calls with atomic transactions!
    /**
     * This method first checks if the status has been changed to approve.
     * If so, it updates the status and moves the obj from the submissions
     * branch to the approved branch. Else, it updates the status/memo fields
     * on the submissions branch.
     * @param  {Object} artwork [artwork obj as in FB db]
     * @param  {String} status  ["Approve", "Pending", ..]
     * @param  {String} memo    []
     */
    saveReviewChanges = (artwork,status,memo) =>{
        if (!memo || status == "Pending") {
            let message;
            if (!memo && status == "Pending") {
                message = "Review failed. Write a review note to the artist explaining the artwork's review status and edit its review status."
            } else if (!memo) {
                message = "Review failed. Write a review note to the artist explaining the artwork's review status."
            } else {
                message = "Review failed. Edit the review status of the review item."
            }

            this.props.sendToSnackbar(message);
        } else if (status == "Approved") {
            let newApproval = false;
            artwork.status  = status; // "Approved"
            if (!artwork.approved) {
                artwork.approved = new Date().getTime();
                newApproval = true;
            }
            artwork.memo = memo;
            artwork.new_message = true;
            artwork.reviewer = this.props.user.public.display_name;
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

            let message = "";
            if (newApproval) {
                message = "Artwork has been approved and the artist has been notified.";
            } else {
                message = "Artwork status has been updated.";
            }
            this.props.sendToSnackbar(message);
        } else if (status == "Declined") {
            let newDecline = false;
            console.log(status,memo);
            artwork.status   = status;
            artwork.reviewer = this.props.user.public.display_name;
            if (!artwork.declined) {
                artwork.declined = new Date().getTime();
                newDecline = true;
            }

            let subRef = firebase.database().ref(`submissions/${artwork.artwork_uid}`);
            let decRef = firebase.database().ref(`declined/${artwork.artwork_uid}`);
            decRef.set(artwork).then(()=>{
                subRef.set(null).then(()=>{
                    console.log("Artwork: ",artwork.artwork_uid, " sent to declined.");
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

            let message = "";
            newDecline ? message = "Artwork has been declined and the artist has been notified." : message = "Artwork status has been updated." ;
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

    /**
     * [Handles getting the next/previous page of items.
     * @param  {Boolean} forward [True if next, false if previous]
     */
    changePage = (forward) => {
        let currentTab = this.state.currentTab;
        let list,first,last,db_ref,query;
        console.log(currentTab,forward);
        if (currentTab == reviewTabs.PENDING && !forward) { // pending previous
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
        } else if (currentTab == reviewTabs.APPROVED && !forward) { // approve previous
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
        } else if (currentTab == reviewTabs.PENDING && forward) {
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
        } else if (currentTab == reviewTabs.APPROVED && forward) {
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
     * Fetches first page of submissions from the `submissions` branch of the curator-tekuma
     * firebase database. Then, sorts based on the field "submitted" which is the number
     * of seconds between 1970 and when the item was submitted.
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

    /**
     * Fetches the first page of approved items from the approved branch of the
     * curator-tekuma firebase DB. Approved is sorted by the 'approved' field, which is
     * seconds between 1970 and when the status was set to approved.
     */
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

    /**
     * Retrieves the first page of items from the `declined` branch of the
     * curator-tekuma firebase db, and attaches listener.
     */
    fetchDeclined = () => {
        let appRef = firebase.database().ref(`declined`);
        appRef.orderByChild("declined").limitToFirst(pg_size).on("value", (snapshot)=>{
            snapshot.forEach( (childSnap)=>{
                if (childSnap.key != 0) {
                    let item = childSnap.val();
                    function isSame(elm) {
                        return elm.artwork_uid == item.artwork_uid
                    }
                    let index = this.state.declinedItems.findIndex(isSame);
                    let updated;
                    if (index != -1) { // already in array, do update
                        updated = this.state.declinedItems.concat([]); //dont mutate state
                        updated[index] = item;
                    } else { //
                        updated = this.state.declinedItems.concat([item]);
                    }
                    this.setState({declinedItems:updated});
                }
            });
        });
    }

    /**
     * Retrieves the subset of items in the `submissions` branch
     * which have status == Held.
     */
    fetchHeld = () => {
        let submitRef = firebase.database().ref(`submissions`);
        submitRef.orderByChild("status").equalTo("Held").on("value", (snapshot)=>{
            snapshot.forEach( (childSnap)=>{
                if (childSnap.key != 0) { //ignore the placeholder in DB
                    let submit = childSnap.val();
                    function isSame(elm) {
                        return elm.artwork_uid == submit.artwork_uid
                    }
                    let index = this.state.heldItems.findIndex(isSame);
                    let updated;
                    if (index != -1) { // already in array
                        updated = this.state.heldItems.concat([]); //dont mutate state
                        updated[index] = submit;
                    } else {
                        updated = this.state.heldItems.concat([submit]);
                    }
                    this.setState({heldItems:updated});
                }
            });
        });
    }


    updateItem = (a,b) => {
        // TODO what is this? is it needed?
    }


    /**
     * Change which tab is displayed
     * @param  {String} newTab [one of 'Pending', 'Approved',TODO]
     */
    changeReviewScreen = (newTab) => {
        this.setState({
            currentTab: newTab
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
