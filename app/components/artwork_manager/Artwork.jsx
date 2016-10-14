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
        let imageURL  = "https://res.cloudinary.com/tekuma-io/image/fetch/f_auto,w_550/https://firebasestorage.googleapis.com/v0/b/art-uploads/o/portal%252FcacxZwqfArVzrUXD5tn1t24OlJJ2%252Fuploads%252F-KNiwWVqgSGDmyd1Prgw%3Falt%3Dmedia%26token%3D11370312-1f3b-4ced-981e-dad98fa26e36"
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
