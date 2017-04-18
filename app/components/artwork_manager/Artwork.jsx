// Libs
import React    from 'react';
import firebase from 'firebase';
import {DragSource, DropTarget}  from 'react-dnd';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

// Files
import Roles from '../../constants/Roles.js';


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
            //NOTE: RAISE IMAGE RESOLUTION HERE!
            imageURL = imageURL.replace("thumb128","thumb512");
        } else {
            imageURL = "assets/images/artwork-substitute.png";
        }
        if (this.props.result.title) {
            imageName = this.props.result.title;
        } else {
            imageName = "Untitled Artwork";
        }
        let imageUID = this.props.result.uid || "(unknown)";
        let artistUID = this.props.result.artist_uid || "(unknown)";;

        // Tooltips
        const addTooltip = (
            <Tooltip
                id="select-artwork-tooltip"
                className="tooltip">
                Add artwork to project
            </Tooltip>
        );

        const removeTooltip = (
            <Tooltip
                id="select-artwork-tooltip"
                className="tooltip">
                Remove artwork from project
            </Tooltip>
        );

        const infoTooltip = (
            <Tooltip
                id="select-artwork-tooltip"
                className="tooltip">
                See more info
            </Tooltip>
        );

        return (
            <article
                htmlFor={imageUID}
                className={ this.state.selected ? "artwork search selected": "artwork search"}>
                <div
                    onClick={this.handleClick}
                    onTap={this.handleClick}
                    className="artwork-image search">
                    <img src={imageURL} />
                    <div className="artwork-overlay">
                        <div className="artwork-overlay-info">
                            <h3 className="artwork-overlay-title">
                                    {!this.props.result.title || this.props.result.title == "" ?
                                        "Untitled Artwork"
                                        :
                                        this.props.result.title
                                    }
                                </h3>
                            <h4 className="artwork-overlay-artist">
                                {!this.props.result.description || this.props.result.description == "" ?
                                    "No description."
                                    :
                                    this.props.result.description.substring(0,27) + "..."
                                }
                            </h4>
                        </div>
                        <OverlayTrigger placement="right" overlay={infoTooltip} >
                            <figure className="overlay-info-project-button">
                                <p>i</p>
                            </figure>
                        </OverlayTrigger>
                        <OverlayTrigger placement="right" overlay={(this.props.role == Roles.SEARCH) ? addTooltip : removeTooltip} >
                            <aside
                                className="overlay-add-project-button"
                                >
                                <img src={this.props.role == Roles.SEARCH ? 'assets/images/icons/add-project-white.svg' : 'assets/images/icons/remove-project-white.svg'} />
                            </aside>
                        </OverlayTrigger>
                    </div>
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
    //

    /**
     * [handleClick description]
     * @param  {HTML_element} e [description]
     */
    handleClick = (e) => {
        console.log(e.target.tagName);
        if (e.target.tagName == "FIGURE" || e.target.tagName == "P") {
            console.log("Requesting info for:",this.props.result.uid);
            this.props.detailArtwork(this.props.result.uid);
            this.props.toggleDetailBox();
        } else if (e.target.tagName == "IMG" || e.target.tagName == "ASIDE") {
            if (this.props.role == Roles.SEARCH) {
                let message = "Artwork/s have been added to project";
                this.props.sendToSnackbar(message);

                if (!this.state.selected) {
                    this.props.addArtworkToBuffer(this.props.result);
                }

                setTimeout( ()=>{
                    this.props.addArtworksToProject();
                }, 50);
            } else {
                let message = "Artwork/s have been removed from project";
                this.props.sendToSnackbar(message);

                if (!this.state.selected) {
                    this.props.addArtworkToBuffer(this.props.result);
                }

                setTimeout( ()=>{
                    this.props.deleteArtworksFromProject();
                }, 50);
            }
        } else {
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
}
