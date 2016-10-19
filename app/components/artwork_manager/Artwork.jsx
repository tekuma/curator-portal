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
        console.log(this.props.result.thumbnail_url);
        return (
            <article
                className="artwork">
                <div
                    className="artwork-image"

                    >
                    <img src={this.props.result.thumbnail_url} />
                </div>
                <div className="artwork-info review">
                    <h3 className="artwork-name review"> {this.props.result.title} </h3>
                </div>
            </article>
        );
    }

    componentDidMount() {
        console.log("+++++++Artwork");
    }
}
