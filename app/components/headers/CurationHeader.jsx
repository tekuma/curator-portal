// Libs
import React     from 'react';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';
// Files
import ProjectSelector from './ProjectSelector';
import Roles           from '../../constants/Roles';

/**
 * CurationHeader is omnipresent in the portal once the user is authenticated.
 */
export default class CurationHeader extends React.Component {
    state = {
        display_tools: false,
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

        const manageTooltip = (
            <Tooltip
                id="manage-tooltip"
                className="tooltip">
                Manage Projects
            </Tooltip>
        );

        const searchTooltip = (
            <Tooltip
                id="manage-tooltip"
                className="tooltip">
                Search the Tekuma Art DB
            </Tooltip>
        );

        return (
            <div>
                <header className={this.state.display_tools ? "light": "dark"}>
                	<div
                        className="tekuma-logo"
                        onClick={this.props.changeAppLayout.bind({}, Roles.MANAGE)}
                        onTouchTap={this.props.changeAppLayout.bind({}, Roles.MANAGE)} >
                        <svg version="1.0" id="tekuma-logo-image-small" x="0px" y="0px" viewBox="0 0 1000 1000">
                            <g>
                                <g>

                                    <line x1="56.8"  y1="57.4"  x2="56.8" y2="943.8"/>
                                    <line x1="56.8"  y1="57.4"  x2="943.2" y2="57.4"/>
                                    <line x1="56.8" y1="943.8"  x2="943.2" y2="943.8"/>
                                    <line x1="943.2" y1="57.4"  x2="943.2" y2="943.8"/>

                                    <line x1="322.7"  y1="323.3" x2="677.3" y2="323.3" />
                                    <line x1="322.7"  y1="323.3" x2="322.7" y2="677.9"/>
                                    <line x1="322.7"  y1="677.9" x2="677.3" y2="677.9"/>
                                    <line x1="677.3"  y1="323.3" x2="677.3" y2="677.9"/>

                                    <line x1="677.3" y1="323.3" x2="943.2" y2="57.4"/>
                                    <line x1="322.7" y1="323.3" x2="56.8" y2="57.4"/>
                                    <line x1="322.7" y1="677.9" x2="56.8" y2="943.8"/>
                                    <line x1="677.3" y1="677.9" x2="943.2" y2="943.8"/>
                                </g>
                            </g>
                        </svg>
                	</div>
                {this.state.display_tools ?
                    <div className="select-tools">
                    <div className="project-selector">
                        <ProjectSelector
                            addNewProject={this.props.addNewProject}
                            role={this.props.role}
                            currentProject={this.props.currentProject}
                            changeProject={this.props.changeProject}
                            projects={this.props.projects}
                        />
                    </div>
                    <div className="header-icons tools" >
                        <OverlayTrigger placement="bottom" overlay={this.props.role == Roles.SEARCH ? addArtworkTooltip : removeArtworkTooltip}>
                             <div
                                 className="header-icon curator add-remove"
                                 onClick={this.handleProjectAdditionsOrDeletions}
                                 onTouchTap={this.handleProjectAdditionsOrDeletions}
                                >
                                 <img src={this.props.role == Roles.SEARCH ? 'assets/images/icons/plus-pink.svg' : 'assets/images/icons/minus-pink.svg'} />
                             </div>
                        </OverlayTrigger>
                    </div>
                    </div>

                    :
                    <div></div>
                }


                    <div className="header-icons">
                        {this.props.role == Roles.SEARCH || this.props.role == Roles.REVIEW || this.props.role == Roles.PROFILE ?
                            <OverlayTrigger placement="bottom" overlay={manageTooltip}>
                                 <div
                                     className="header-icon curator manage"
                                     onClick={this.props.changeAppLayout.bind({}, Roles.MANAGE)}
                                     onTouchTap={this.props.changeAppLayout.bind({}, Roles.MANAGE)}
                                    >
                                     <img src="assets/images/icons/manage.svg" />
                                 </div>
                            </OverlayTrigger>
                            :
                            <OverlayTrigger placement="bottom" overlay={searchTooltip}>
                                 <div
                                     className="header-icon curator search"
                                     onClick={this.props.changeAppLayout.bind({}, Roles.SEARCH)}
                                     onTouchTap={this.props.changeAppLayout.bind({}, Roles.SEARCH)}
                                    >
                                     <img src="assets/images/icons/search.svg" />
                                 </div>
                            </OverlayTrigger>
                        }
                    </div>
        	</header>
            </div>
        );
    }


    componentDidMount() {
        console.log("+++++CurationHeader");
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.artworkBuffer){
            if (nextProps.artworkBuffer.length > 0) {
                this.setState({display_tools:true});
            } else {
                this.setState({display_tools:false});
            }
        }
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
