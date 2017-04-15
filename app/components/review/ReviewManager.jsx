// Libs
import React      from 'react';
import firebase   from 'firebase';
import uuid       from 'node-uuid';
// Files
import ArtworkDescriptionPreview from './ArtworkDescriptionPreview';
import ArtworkImagePreview from './ArtworkImagePreview';
import reviewTabs from '../../constants/reviewTabs';
import ReviewItem from './ReviewItem';

// Global Variables
const pg_size = 8;

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
            return this.renderReviewItems("Pending");
        } else if (this.state.currentTab == reviewTabs.APPROVED) {
            return this.renderReviewItems("Approved");
        } else if (this.state.currentTab == reviewTabs.HELD) {
            return this.renderReviewItems("Held");
        } else {
            return this.renderReviewItems("Declined");
        }
    }

    componentDidMount() {
        console.log("++++++ReviewManager");
        //NOTE: Cascaded to spread out the load, prevent lag on load.
        this.fetchSubmissions();
        setTimeout( ()=>{
            this.fetchApproved();
            setTimeout( ()=>{
                this.fetchDeclined();
                setTimeout( ()=>{
                    this.fetchHeld();
                }, 100);
            }, 100);
        }, 100);
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUnmount() {
        firebase.database().ref("submissions").off();
        firebase.database().ref("approved").off();
        firebase.database().ref("declined").off();
        firebase.database().ref("held").off();
    }
    // =========== Render Control =============

    /**
     * @param  {String} catagory [One of "Approved", "Held", "Pending", "Declined"]
     * @return {JSX}
     */
    renderReviewItems = (catagory) => {
        let items = [];
        if (catagory === "Pending") {
            items = this.state.reviewItems;
        } else if (catagory === "Held") {
            items = this.state.heldItems;
        } else if (catagory === "Approved") {
            items = this.state.approvedItems;
        } else if (catagory === "Declined") {
            items = this.state.declinedItems;
        }
        console.log(catagory);

        const reviewWrapperStyle = {
            height: window.innerHeight - 140 - 78, // 140px = Header and Review Tabs ,91 = Pagination Arrows
            width : window.innerWidth - 40
        };
        const tableWidth = {
            width : window.innerWidth - 40 - 20
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
                            {items.map(item => {
                                return (
                                    <ReviewItem
                                        item={item}
                                        mode={catagory}
                                        deleteItem={this.deleteItem}
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
            ref.transaction((data)=>{
                return null;
            },(err,wasSuccessful,snapshot)=>{
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

    /**
     * Removes an artwork from the list of artworks in the reviewItems array in
     * state. This method uses concat([]) as a way to copy the state, as not to
     * directly mutate the state.
     * @param  {String} artwork_uid [uid of the artwork]
     */
    removeFromReviewItems = (artwork_uid) => {
        for (var i = 0; i < this.state.reviewItems.length; i++) {
            let item = this.state.reviewItems[i];
            if (item.artwork_uid == artwork_uid) {
                let updates = this.state.reviewItems.concat([]); //deepcopy
                updates.splice(i,1);
                this.setState({reviewItems:updates});
                break;
            }
        }
    }

    /**
     * This method handles syncing any changes in data from the review interface
     * to the firebase database.
     * RULES:
     * -items cannot be moved -> Pending, only from pending.
     * -items cannot be moved from Approved, Declined, or Held, only to.
     * -items moved to Held trigger the daemon to unlock the artwork in artist.tekuma.io
     * -When items are moved from pending -> approved || declined, remove that artwork
     *  from the held branch, even if it is not there as it has a known path.
     * @param  {Object} artwork [artwork obj as in FB db]
     * @param  {String} status  ["Approve", "Pending", ..]
     * @param  {String} memo    [The message field from the curator]
     */
    saveReviewChanges = (artwork,newStatus,memo) =>{
        console.log("saving changes to", artwork.artwork_uid);
        const subRef  = firebase.database().ref(`submissions/${artwork.artwork_uid}`);
        const aprRef  = firebase.database().ref(`approved/${artwork.artwork_uid}`);
        const decRef  = firebase.database().ref(`declined/${artwork.artwork_uid}`);
        const heldRef = firebase.database().ref(`held/${artwork.artwork_uid}`);
        const oldStatus = artwork.status;

        console.log("new",newStatus,"old",oldStatus,memo, artwork);
        if (!memo) {
            let message;
            if (!memo && newStatus == "Pending") {
                message = "Review failed. Write a review note to the artist explaining the artwork's review status and edit its review status.";
            } else {
                message = "Review failed. Write a review note to the artist explaining the artwork's review status.";
            }
            this.props.sendToSnackbar(message);
        } else if (newStatus == "Approved") {
            let newApproval = false;

            if (!artwork.approved) {
                artwork.approved = new Date().getTime();
                newApproval = true;
            }
            aprRef.transaction((data)=>{
                artwork.memo = memo;
                artwork.status = newStatus;
                artwork.reviewer = this.props.user.public.display_name;
                artwork.new_message = true;
                return artwork; // add artwork to approved branch
            },(err,wasSuccessful,snapshot)=>{
                subRef.transaction((data)=>{
                    return null; // delete artwork from submissions branch
                },(err,wasSuccessful,snapshot)=>{
                    console.log("Artwork: ",artwork.artwork_uid, " sent to approved");
                });
                heldRef.transaction((data)=>{ // even if it isn't
                    return null;  // remove artwork from held branch
                });
            });

            //Remove this artwork from the pending screen
            this.removeFromReviewItems(artwork.artwork_uid);

            let message = "";
            if (newApproval) {
                message = "Artwork has been approved and the artist has been notified.";
            } else {
                message = "Artwork status has been updated.";
            }
            this.props.sendToSnackbar(message);
        } else if (newStatus == "Declined") {
            let newDecline = false;
            if (!artwork.declined) {
                artwork.declined = new Date().getTime();
                newDecline = true;
            }

            decRef.transaction((data)=>{
                artwork.status = false;
                artwork.memo   = memo;
                artwork.reviewer = this.props.user.public.display_name;
                return artwork; // add artwork to declined branch
            },(err,wasSuccessful,snapshot)=>{
                subRef.transaction((data)=>{
                    return null; // delete artwork from submissions branch
                },(err,wasSuccessful,snapshot)=>{
                    console.log("Artwork: ",artwork.artwork_uid, " sent to declined");
                });
                heldRef.transaction((data)=>{
                    return null; // clean the held branch as well.
                });
            });

            //Remove this artwork from the pending screen
            this.removeFromReviewItems(artwork.artwork_uid);

            let message = "";
            newDecline ? message = "Artwork has been declined and the artist has been notified." : message = "Artwork status has been updated." ;
            this.props.sendToSnackbar(message);

        } else if (newStatus == "Held") {
            let message;
            if (oldStatus == "Held" && memo != null) { // an update
                // only thing that can be updated in Held is the memo.
                artwork.memo = memo;
                heldRef.transaction((data)=>{
                    return artwork;
                });
                message = "This message has been updated";
            } else { //initial move into held.
                artwork.reviewer = this.props.user.public.display_name;
                if (!artwork.held) {
                    artwork.held = new Date().getTime();
                }

                artwork.status   = newStatus;
                heldRef.transaction((data)=>{
                    return artwork; // add artwork to declined branch
                },(err,wasSuccessful,snapshot)=>{
                    subRef.transaction((data)=>{
                        return null; // delete artwork from submissions branch
                    },(err,wasSuccessful,snapshot)=>{
                        console.log("Artwork: ",artwork.artwork_uid, " sent to Held");
                    });
                });

                //splice out this artwork from the pending screen
                this.removeFromReviewItems(artwork.artwork_uid);

                message = "This artwork has been held. The corresponding artwork in the artist portal has been unlocked, so the artist can make changes";
            }
            this.props.sendToSnackbar(message);
        } else if (newStatus == "Pending" && oldStatus == "Pending"){ // update info
            if (artwork.status != status || artwork.memo != memo) {
                console.log("updating db...",artwork.artwork_uid);
                let subRef = firebase.database().ref(`submissions/${artwork.artwork_uid}`);
                subRef.transaction((data)=>{
                    data.new_message = true;
                    data.status = status;
                    data.memo = memo;
                    console.log("artwork updated.");
                    return data;
                },(err,wasSuccessful,snapshot)=>{
                    if (err) { console.log(err); }
                    if (wasSuccessful) {
                        this.props.sendToSnackbar("Artwork status has been updated.")
                    }
                });
            }
        } else {
            this.props.sendToSnackbar("Illegal operation. If you think this is in error, please log the operation you were attempting");
        }
    }

    /**
     * Handles getting the next/previous page of review items.
     * @param  {Boolean} forward [True if next, false if previous]
     */
    changePage = (forward) => {
        console.log(forward,this.state.currentTab);
        let currentTab = this.state.currentTab;
        let list,first,last,db_ref,query;
        if (forward) { // -->
            if (currentTab == reviewTabs.PENDING) {
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
            } else if (currentTab == reviewTabs.DECLINED) {
                list = this.state.declinedItems.concat([]);//copy
                last = list[list.length -1].declined;
                db_ref = firebase.database().ref(`declined`);
                db_ref.off();
                query = db_ref.orderByChild("declined").startAt(last).limitToFirst(pg_size);
                this.setState({declinedItems:[]});
                query.on("value", (snapshot)=>{
                    snapshot.forEach( (childSnap)=>{
                        if (childSnap.key != 0) { //ignore the placeholder in DB
                            let data = childSnap.val();
                            function isSame(elm) {
                                return elm.artwork_uid == data.artwork_uid
                            }
                            let index = this.state.declinedItems.findIndex(isSame);
                            let list;
                            if (index != -1) { // already in array
                                list  = this.state.declinedItems.concat([]);//copy
                                list[index] = data;
                            } else {
                                list  = this.state.declinedItems.concat([data]);//copy
                            }
                            this.setState({declinedItems:list});
                        }
                    });
                });
            } else if (currentTab == reviewTabs.APPROVED) {
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
                            this.setState({approvedItems:list});
                        }
                    });
                });
            }
        } else { // <--
            if (currentTab == reviewTabs.PENDING) {
                list   = this.state.reviewItems.concat([]);//copy
                first  = list[0].submitted;
                db_ref = firebase.database().ref(`submissions`);
                db_ref.off(); // turn off listener to last page
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
                            this.setState({reviewItems:list});
                        }
                    });
                });
            } else if (currentTab == reviewTabs.DECLINED) {
                list   = this.state.declinedItems.concat([]);//copy
                first  = list[0].declined;
                db_ref = firebase.database().ref(`declined`);
                db_ref.off();
                query  = db_ref.orderByChild("declined").endAt(first).limitToLast(pg_size);
                this.setState({declinedItems:[]});
                query.on("value", (snapshot)=>{
                    snapshot.forEach( (childSnap)=>{
                        if (childSnap.key != 0) { //ignore the placeholder in DB
                            let data = childSnap.val();
                            function isSame(elm) {
                                return elm.artwork_uid == data.artwork_uid
                            }
                            let index = this.state.declinedItems.findIndex(isSame);
                            let list;
                            if (index != -1) { // already in array
                                list  = this.state.declinedItems.concat([]);//copy
                                list[index] = data;
                            } else {
                                list  = this.state.declinedItems.concat([data]);//copy
                            }
                            this.setState({declinedItems:list});
                        }
                    });
                });
            } else if (currentTab == reviewTabs.APPROVED) {
                list   = this.state.approvedItems.concat([]);//copy
                first  = list[0].approved;
                db_ref = firebase.database().ref(`approved`);
                db_ref.off(); // turn off listener to old page
                query  = db_ref.orderByChild("approved").endAt(first).limitToLast(pg_size);
                this.setState({approvedItems:[]}); // clear last page out
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
                            this.setState({approvedItems:list});
                        }
                    });
                });
            }
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
        let appRef = firebase.database().ref(`approved`);
        appRef.orderByChild("approved").limitToFirst(pg_size).on("value", (snapshot)=>{
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
     * Retrieves first page of items from the held branch
     */
    fetchHeld = () => {
        let heldRef = firebase.database().ref(`held`);
        heldRef.orderByChild("held").limitToFirst(pg_size).on("value", (snapshot)=>{
            snapshot.forEach( (childSnap)=>{
                if (childSnap.key != 0) { //ignore the placeholder in DB
                    let submit = childSnap.val();
                    function isSame(elm) {
                        return elm.artwork_uid == submit.artwork_uid;
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

}
