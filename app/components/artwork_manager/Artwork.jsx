// Libs
import React    from 'react';
import firebase from 'firebase';
import {DragSource, DropTarget}  from 'react-dnd';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';



export default class Artwork extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("------Artwork");
    }

    render() {
        let imageName;
        let imageURL;
        if (this.props.result.thumbnail_url){
            imageURL = this.props.result.thumbnail_url;
        } else {
            imageURL = "https://pbs.twimg.com/profile_images/789881245631033345/HyA1_ENe.jpg";
        }
        if (this.props.result.title) {
            imageName = this.props.result.title;
        } else {
            imageName = "0xDEADBEEF";
        }

        return (
            <article
                className="artwork">
                <div className="artwork-image">
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
