//Libs
import React      from 'react';
import firebase   from 'firebase';
import Masonry    from 'react-masonry-component';

// Files
import Artwork    from './Artwork';


/**
 * NEW MESSAGE
 */
export default class ArtworkManager extends React.Component {
    state = {
        max_results: 20
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ArtworkManager");
    }

    render() {
        if(this.props.results.length == 0) {
            return this.renderEmptySearch();
        } else {
            return this.renderArtworks();
        }
    }

    componentDidMount() {
        console.log("+++++ArtworkManager");
    }

    componentWillReceiveProps(nextProps) {
    }


// ============= Flow Control ===============

    renderArtworks = () => {

        console.log(this.state.max_results);
        let styleManagerClosed = {
            width: window.innerWidth - 40,
            height: window.innerHeight - 60
        };

        let styleManagerOpen = {
            width: window.innerWidth * 0.6,  // Album Manager is 30% of Screen
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
                            (window.innerWidth * 0.4 > 440) ?
                                styleLargeScreen :
                                (window.innerWidth * 0.4 > 250) ?
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

                {this.props.results.length > 0 ?
                    this.props.results.map((result,i) => {
                        if (i < this.state.max_results) {
                            return (
                                <Artwork
                                    detailArtwork={this.props.detailArtwork}
                                    toggleDetailBox={this.props.toggleDetailBox}
                                    command={this.props.command}
                                    addArtworkToBuffer={this.props.addArtworkToBuffer}
                                    removeArtworkFromBuffer={this.props.removeArtworkFromBuffer}
                                    result={result}
                                    deleteArtworksFromProject={this.props.deleteArtworksFromProject}
                                    addArtworksToProject={this.props.addArtworksToProject}
                                    sendToSnackbar={this.props.sendToSnackbar}
                                    role={this.props.role} />
                            );
                        }  else if (i == this.state.max_results) {
                            return(
                            <div
                                className ="review-item-review-button"
                                onClick={this.increaseSearchResults}>
                                <h4>More..</h4>
                            </div>
                        );
                        }
                    })
                    : "No artworks matched your search query :( "}
                </Masonry>

            </div>

        );
    };

    increaseSearchResults = () =>{
        let old_max = this.state.max_results + 20;
        this.setState({max_results:old_max});
    }

    renderEmptySearch = () => {
        let styleManagerClosed = {
            width: window.innerWidth - 40,
            height: window.innerHeight - 60
        };

        let styleManagerOpen = {
            width: window.innerWidth * 0.6,  // Album Manager is 30% of Screen
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
                            (window.innerWidth * 0.4 > 440) ?
                                styleLargeScreen :
                                (window.innerWidth * 0.4 > 250) ?
                                    styleManagerOpen :
                                    (window.innerWidth > 410) ?
                                        styleSmallScreen :
                                        fixedWidth
                                : styleManagerClosed}
                className   ="empty-search-box">
                {this.props.noResults ?
                    <img id="empty-search-arrow-icon" className="no-results" src="assets/images/icons/sad-gradient.svg"/>
                    :
                    <img id="empty-search-arrow-icon" src="assets/images/icons/arrow-right-gradient.svg"/>
                }
                <h3 className="empty-search-writing medium">
                    {this.props.noResults ?
                        "No artworks matched your search query."
                        :
                        "Search for Artworks"
                    }
                </h3>
            </div>
        );
    }
}
