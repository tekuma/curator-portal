// Libs
import React      from 'react';
import Firebase   from 'firebase';
// Files


/*  this.props.item  looks like

    -jd7Jd21ka: {
        artwork_uid:"-jd7Jd21ka",
        artist_uid :"sakUdjf2118SusQLXa",
        submitted  :"2016-11-26T20:33:35.393Z",
        status     :"Unseen",
        artist_name:"Pablo Picasso",
    }

 */

export default class ReviewManager extends React.Component {
    state = {
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ReviewItem");
    }

    render() {

    }

    componentDidMount() {
        console.log("++++++ReviewItem");

    }

    // =========== Methods ==============



}//END App
