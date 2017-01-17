// Libs
import React      from 'react';
import Firebase   from 'firebase';
// Files
import ReviewItem from './ReviewItem';

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
        reviewItems: []
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ReviewManager");
    }

    render() {
        return (
            <ul
                className=""
                style="" >
                {this.state.reviewItems.map(item => {
                    return (
                        <ReviewItem
                            item={item}
                            writeMemo={this.writeMemo}
                            updateSubmissionStatus={this.updateSubmissionStatus}
                         />
                    );
                })}

            </ul>
        );
    }

    componentDidMount() {
        console.log("++++++ReviewManager");
        this.fetchSubmissions();
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
        if (status === "Accepted" || status === "Rejected" || status === "Held") {

        }
    }

}//END App
