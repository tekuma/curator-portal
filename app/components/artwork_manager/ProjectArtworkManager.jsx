//Libs
import React      from 'react';
import firebase   from 'firebase';
import Masonry    from 'react-masonry-component';

// Files
import Artwork    from './Artwork';
import Roles      from '../../constants/Roles';


/**
 * TODO
 */
export default class ProjectArtworkManager extends React.Component {
    state = {
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ProjectArtworkManager");
    }

    render() {
        if(this.props.projectArtworks.length == 0) {
            if (this.props.projects.length == 0) {
                return this.renderNoProject();
            } else {
                return this.renderEmptyProject();
            }
        } else {
            return this.renderArtworks();
        }
    }



    componentDidMount() {
        console.log("+++++ProjectArtworkManager");

    }

    componentWillReceiveProps(nextProps) {
    }


// ============= Flow Control ===============

    renderArtworks = () => {

        let styleManagerClosed = {
            width: window.innerWidth - 40,
            height: window.innerHeight - 60
        };

        let styleManagerOpen = {
            width: window.innerWidth * 0.7,  // Album Manager is 30% of Screen
            height: window.innerHeight - 60
        };

        let styleLargeScreen = {
            width: window.innerWidth - 440,
            height: window.innerHeight - 60
        };

        let styleSmallScreen = {
            width: window.innerWidth - 250,
            height: window.innerHeight - 60
        };

        let fixedWidth = {
            width: window.innerWidth,
            height: window.innerHeight - 60
        };

        let masonryOptions = {
            transitionDuration: 0
        };

        return (
            <div
                style={this.props.managerIsOpen ?
                            (window.innerWidth * 0.3 > 440) ?
                                styleLargeScreen :
                                (window.innerWidth * 0.3 > 250) ?
                                    styleManagerOpen :
                                    (window.innerWidth > 410) ?
                                        styleSmallScreen :
                                        fixedWidth
                                : styleManagerClosed}
                disableClick
                className       ="artworks"
                >
                <Masonry
                    className       ="artworks no-margin"
                    style           ={this.props.managerIsOpen ? (window.innerWidth * 0.3 > 250) ? null : styleSmallScreen : styleManagerClosed}
                    elementType={'div'}
                    options={masonryOptions}
                    disableImagesLoaded={false}
                    updateOnEachImageLoad={false}
               >

                {this.props.projectArtworks.map(result => {
                    return (
                        <Artwork
                            detailArtwork={this.props.detailArtwork}
                            toggleDetailBox={this.props.toggleDetailBox}
                            command = {this.props.command}
                            addArtworkToBuffer={this.props.addArtworkToBuffer}
                            removeArtworkFromBuffer={this.props.removeArtworkFromBuffer}
                            result={result} />
                    );
                })}
                </Masonry>
            </div>

        );
    };

    renderEmptyProject = () => {
        let styleManagerClosed = {
            width: window.innerWidth - 40,
            height: window.innerHeight - 60
        };

        let styleManagerOpen = {
            width: window.innerWidth * 0.7,  // Album Manager is 30% of Screen
            height: window.innerHeight - 60
        };

        let styleLargeScreen = {
            width: window.innerWidth - 440,
            height: window.innerHeight - 60
        };

        let styleSmallScreen = {
            width: window.innerWidth - 250,
            height: window.innerHeight - 60
        };

        let fixedWidth = {
            width: window.innerWidth,
            height: window.innerHeight - 60
        };

        return (
            <div
                style={this.props.managerIsOpen ?
                            (window.innerWidth * 0.3 > 440) ?
                                styleLargeScreen :
                                (window.innerWidth * 0.3 > 250) ?
                                    styleManagerOpen :
                                    (window.innerWidth > 410) ?
                                        styleSmallScreen :
                                        fixedWidth
                                : styleManagerClosed}
                className   ="empty-project-box"
                onClick      ={this.props.changeAppLayout.bind({}, Roles.SEARCH)}
                onTouchTap      ={this.props.changeAppLayout.bind({}, Roles.SEARCH)}>
                <img id="empty-project-search-icon" src="assets/images/icons/search-gradient.svg"/>
                <h3 className="empty-project-writing medium">Project Empty</h3>
                <h3 className="empty-project-writing small">Click to Search for Artworks</h3>
            </div>
        );
    }

    renderNoProject = () => {
        let styleManagerClosed = {
            width: window.innerWidth - 40,
            height: window.innerHeight - 60
        };

        let styleManagerOpen = {
            width: window.innerWidth * 0.7,  // Album Manager is 30% of Screen
            height: window.innerHeight - 60
        };

        let styleLargeScreen = {
            width: window.innerWidth - 440,
            height: window.innerHeight - 60
        };

        let styleSmallScreen = {
            width: window.innerWidth - 250,
            height: window.innerHeight - 60
        };

        let fixedWidth = {
            width: window.innerWidth,
            height: window.innerHeight - 60
        };

        return (
            <div
                style={this.props.managerIsOpen ?
                            (window.innerWidth * 0.3 > 440) ?
                                styleLargeScreen :
                                (window.innerWidth * 0.3 > 250) ?
                                    styleManagerOpen :
                                    (window.innerWidth > 410) ?
                                        styleSmallScreen :
                                        fixedWidth
                                : styleManagerClosed}
                className   ="empty-project-box"
                onClick={this.props.addNewProject}
                onTouchTap={this.props.addNewProject}>
                <img
                    className="first-project-icon"
                    src="assets/images/icons/plus-pink.svg" />
                <h2
                    className="empty-project-writing medium"
                    >Create First Project</h2>
            </div>
        );
    }
}
