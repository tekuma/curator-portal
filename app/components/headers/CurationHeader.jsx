// Libs
import React     from 'react';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';
// Files
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

        const closeTooltip = (
            <Tooltip
                id="manage-tooltip"
                className="tooltip">
                Close Artwork Info
            </Tooltip>
        );

        const hide = {
            display: "none"
        }

        const show = {
            display: "block"
        }

        return (
            <div>
                <header className={this.state.display_tools ? "light": "dark"}>
                	<div
                        className="tekuma-logo"
                        style={this.props.detailBoxIsOpen ? hide : show}
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
                    <div className="header-icons tools" >
                        <OverlayTrigger placement="bottom" overlay={this.props.role == Roles.SEARCH ? addArtworkTooltip : removeArtworkTooltip}>
                             <div
                                 className="header-icon curator add-remove"
                                 onClick={this.handleProjectAdditionsOrDeletions}
                                 onTouchTap={this.handleProjectAdditionsOrDeletions}
                                >
                                 <img src={this.props.role == Roles.SEARCH ? 'assets/images/icons/add-project-white.svg' : 'assets/images/icons/remove-project-white.svg'} />
                             </div>
                        </OverlayTrigger>
                    </div>
                    </div>

                    :
                    null
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
                            this.props.detailBoxIsOpen ?
                                <OverlayTrigger placement="bottom" overlay={closeTooltip}>
                                     <div
                                         className="header-icon curator"
                                         onClick={this.props.toggleDetailBox}
                                         onTouchTap={this.props.toggleDetailBox}
                                        >
                                         <img src="assets/images/icons/cross-white.svg" />
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
            let message = "Artwork/s have been added to project";
            this.props.sendToSnackbar(message);
            this.props.addArtworksToProject();

        } else {
            let message = "Artwork/s have been removed from project";
            this.props.sendToSnackbar(message);
            this.props.deleteArtworksFromProject();
        }
    }

}
