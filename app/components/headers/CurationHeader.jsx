// Libs
import React     from 'react';
import SearchBar from './SearchBar';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

// Files
import Views from '../../constants/Views';

/**
 * TODO
 */
export default class PostAuthHeader extends React.Component {
    state = {
        searchTerm: ""
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----CurationHeader");
    }

    render() {
        const searchTooltip = (
            <Tooltip
                id="search-tooltip"
                className="tooltip">
                Search artworks
            </Tooltip>
        );

        return (
            <div>
                <header className="black">
                	<div
                        className="tekuma-logo"
                  >
                      <svg version="1.0" id="tekuma-logo-image-small" x="0px" y="0px" viewBox="0 0 1000 1000">
                        <g>
                            <g>
                                <rect x="56.8" y="57.4" width="886.3" height="886.3"/>
                                <rect x="322.7" y="323.3" width="354.5" height="354.5"/>
                                <line x1="677.3" y1="323.3" x2="943.2" y2="57.4"/>
                                <line x1="322.7" y1="323.3" x2="56.8" y2="57.4"/>
                                <line x1="322.7" y1="677.9" x2="56.8" y2="943.8"/>
                                <line x1="677.3" y1="677.9" x2="943.2" y2="943.8"/>
                            </g>
                        </g>
                      </svg>
                	</div>
                    <SearchBar
                        setSearchTerm={this.setSearchTerm} />
                    <OverlayTrigger placement="bottom" overlay={searchTooltip}>
                	       <div className="header-icons search">
                                <div
                                    onClick={this.search}>
                                    <img
                                        onClick={this.search}
                                        id="search-icon"
                                        src="assets/images/icons/search.svg" />
                                </div>
            	           </div>
                    </OverlayTrigger>
            	</header>
            </div>
        );
    }

    componentDidMount() {
        console.log("+++++CurationHeader");
    }

    componentWillReceiveProps(nextProps) {
        //Pass
    }

    // ------------ METHODS -------------

    setSearchTerm = (searchTerm) => {
        this.setState({
            searchTerm: searchTerm
        });
        console.log("Here is the Search Term: ", this.state.searchTerm);
    }
}
