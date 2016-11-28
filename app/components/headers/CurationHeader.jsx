// Libs
import React     from 'react';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';
// Files
import ProjectSelector from './ProjectSelector';
import Roles           from '../../constants/Roles';

/**
 * CurationHeader is omnipresent in the portal once the user is authenticated.
 */
export default class PostAuthHeader extends React.Component {
    state = {
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----CurationHeader");
    }

    render() {

        const addArtworkTooltip = (
            <Tooltip
                id="add-artwork-tooltip"
                className="tooltip">
                Add Selected Artworks to Project
            </Tooltip>
        );

        const removeArtworkTooltip = (
            <Tooltip
                id="remove-artwork-tooltip"
                className="tooltip">
                Remove Selected Artworks from Project
            </Tooltip>
        );

        return (
            <div>
                <header className="black">
                	<div  className="tekuma-logo" >
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
                  <div className="project-selector">
                      <ProjectSelector
                          currentProject={this.props.currentProject}
                          changeProject={this.props.changeProject}
                          projects={this.props.projects}
                      />
                  </div>

                    <div className="header-icons">
                        <OverlayTrigger placement="bottom" overlay={this.props.role == Roles.SEARCH ? addArtworkTooltip : removeArtworkTooltip}>
                             <div
                                 className="header-icon"
                                 onClick={this.handleProjectAdditionsOrDeletions}
                                 onTouchTap={this.handleProjectAdditionsOrDeletions}
                                >
                                 <img src={this.props.role == Roles.SEARCH ? 'assets/images/icons/plus-pink.svg' : 'assets/images/icons/minus-pink.svg'} />
                             </div>
                        </OverlayTrigger>


                    </div>

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

    /**
     *
     * @return {[type]} [description]
     */
    handleProjectAdditionsOrDeletions = () => {
        if (this.props.role == Roles.SEARCH) {
            this.props.addArtworksToProject();
        } else {
            this.props.deleteArtworksFromProject();
        }
    }

}
