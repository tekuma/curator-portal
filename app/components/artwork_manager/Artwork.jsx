// Libs
import React    from 'react';
import firebase from 'firebase';
import {DragSource, DropTarget}  from 'react-dnd';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';



export default class Artwork extends React.Component {
    state = {
        selected: false
    }

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
            imageURL = "assets/images/artwork-substitute-mini.png";
        }
        if (this.props.result.title) {
            imageName = this.props.result.title;
        } else {
            imageName = "(no title)";
        }
        let imageUID = this.props.result.uid || "(unknown)";
        let artistUID = this.props.result.artist_uid || "(unknown)";;

        return (
            <article
                htmlFor={imageUID}
                className={ this.state.selected ? "artwork search selected": "artwork search"}>
                <div
                    onClick={this.toggleArtworkSelection}
                    className="artwork-image search">
                    <img src={imageURL} />
                </div>
                <div className="artwork-info review">
                <h3 className="artwork-name review"> {imageName} </h3>
                <h3 className="artwork-name review"> artwork UID: {imageUID} </h3>
                <h3 className="artwork-name review"> artist UID: {artistUID} </h3>
                </div>
            </article>
        );
    }

    componentDidMount() {
        console.log("+++++++Artwork");
    }

    componentWillReceiveProps(newProps) {
        if (newProps.command === "deselect") {
            this.setState({selected: false})
        } else if (newProps.command === "select") {
            this.setState({selected: true})
        }
    }
    // ========= Methods ===========



    toggleArtworkSelection = () => {

        // Add to addition or deletion buffer if originally false, else remove it addition/deletion buffer
        if (!this.state.selected) {
            this.props.addArtworkToBuffer(this.props.result);
        } else {
            this.props.removeArtworkFromBuffer(this.props.result);
        }

        this.setState({
            selected: !this.state.selected
        });
    }
}
