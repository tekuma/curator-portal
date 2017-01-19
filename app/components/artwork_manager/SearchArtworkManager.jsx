//Libs
import React      from 'react';
import firebase   from 'firebase';
import Masonry    from 'react-masonry-component';

// Files
import Artwork    from './Artwork';


/**
 * TODO
 */
export default class ArtworkManager extends React.Component {
    state = {
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ArtworkManager");
    }

    render() {
        return this.renderArtworks();
    }

    componentDidMount() {
        console.log("+++++ArtworkManager");
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

                {this.props.results.length > 0 ?
                     this.props.results.map(result => {
                         return (
                             <Artwork
                                 detailArtwork={this.props.detailArtwork}
                                 toggleMoreInfo={this.props.toggleMoreInfo}
                                 command={this.props.command}
                                 addArtworkToBuffer={this.props.addArtworkToBuffer}
                                 removeArtworkFromBuffer={this.props.removeArtworkFromBuffer}
                                 result={result} />
                         );
                     })
                     : "No artworks matched your search query."}
                </Masonry>
            </div>

        );
    };



}
