// Libs
import React    from 'react';
import firebase from 'firebase';
import {DragSource, DropTarget} from 'react-dnd';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

// Files

export default class Artwork extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("------Artwork");
    }

    render() {
        let imageName = "0xDEADBEEF"; //TODO replace with results data from props
        let imageURL = "https://pbs.twimg.com/profile_images/784738313034948608/kf8ZaTnU.jpg";
        return (
            <article
                className="artwork">
                <div
                    className="artwork-image"

                    >
                    <img src={imageURL} />
                </div>
                <div className="artwork-info review">
                    <h3 className="artwork-name review"> {imageName} </h3>
                </div>
            </article>
        );
    }

    componentDidMount() {
        console.log("+++++++Artwork");
    }
}
