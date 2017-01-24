// Libs
import React                        from 'react';
import firebase                     from 'firebase';
import uuid                         from 'node-uuid';
import {Tooltip, OverlayTrigger}    from 'react-bootstrap';
import update                       from 'react-addons-update';

// Files
import ManageAccordion              from './ManageAccordion';
import ManageProjectName            from './ManageProjectName';
import ManageToggler                from './ManageToggler';
import Select                       from 'react-select';

/**
 * TODO
 */
export default class ProjectManager extends React.Component {
    state = {
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ProjectManager");
    }

    render() {
        if(this.props.managerIsOpen) {
            return this.openedManager();
        } else {
            return this.closedManager();
        }
    }

    componentDidMount() {
        console.log("+++++ProjectManager");
    }

    componentWillReceiveProps(nextProps) {

    }

// ============= Flow Control ===============

    openedManager = () => {

        // Tooltips
        const addAlbumTooltip = (
            <Tooltip
                id="add-album-tooltip"
                className="tooltip">
                Create new album
            </Tooltip>
        );

        // Dynamic CSS
        const containerWidth = {
            height: window.innerHeight - 60, // Minus 60px for Header
            width: window.innerWidth * 0.4 - 40,
            maxWidth: "400px"
        }

        const managerFunctionHeight = {
            height: window.innerHeight - 60 - 60 - 60 // Minus 60px for Header, Project Name, and SelectButtons
        }

        let options = [{label: "Bob", value: "Bob"}];

        return (
            <section
                style={{
                height: window.innerHeight - 60,
                right: 0
                }}
                className="search-manager">
                <ManageToggler
                    background      ={"#323232"}
                    height          ={window.innerHeight - 60}
                    managerIsOpen   ={this.props.managerIsOpen}
                    toggleManager   ={this.props.toggleManager}/>
                <div
                    style={containerWidth}
                    className="project-manager-container">
                    <ManageProjectName
                        renameCurrentProject={this.props.renameCurrentProject}
                        currentProject={this.props.currentProject}

                        />
                    <div
                        style={managerFunctionHeight}
                        className="manager-function-wrapper">
                        <div className="manager-function">
                            <h3 className="manager-heading">
                                Download
                            </h3>
                            <div className="manager-function-box download center">
                                <p>CSV</p>
                            </div>
                            <div className="manager-function-box download center">
                                <p>Raw Images</p>
                            </div>
                            <div className="manager-function-box download center">
                                <p>Print Files</p>
                            </div>
                        </div>
                        <div className="manager-function">
                            <h3 className="manager-heading">
                                Collaborators
                            </h3>
                            <div className="manager-function-box center">
                                <div className="collaborator-box">
                                    <article
                                        key={uuid.v4()}
                                        className="collaborator-thumb self">
                                        <p className="collaborator-name">
                                            Afika Nyati
                                        </p>
                                        <div className="delete-collaborator">
                                            <img src="assets/images/icons/delete-white.svg" />
                                        </div>
                                    </article>
                                    <article
                                        key={uuid.v4()}
                                        className="collaborator-thumb">
                                        <p className="collaborator-name">
                                            Stephen White
                                        </p>
                                        <div className="delete-collaborator">
                                            <img src="assets/images/icons/delete-white.svg" />
                                        </div>
                                    </article>
                                    <article
                                        key={uuid.v4()}
                                        className="collaborator-thumb">
                                        <p className="collaborator-name">
                                            Scott Livingston
                                        </p>
                                        <div className="delete-collaborator">
                                            <img src="assets/images/icons/delete-white.svg" />
                                        </div>
                                    </article>
                                </div>
                                <p>Add Collaborator</p>
                                <Select
                                    className="add-collaborator-selector"
                                    ref="searchArtist"
                                    inputProps={{id: 'search-artist'}}
                                    autofocus
                                    options={options}
                                    simpleValue
                                    clearable={false}
                                    name="artist-search"
                                    value={"Hello"}
                                    placeholder="Name..."
                                    />
                                <div
                                    className="collaborator-add-button"
                                    title="Add Collaborator">
                                    <p>+</p>
                                </div>
                            </div>
                        </div>
                        <div className="manager-function">
                            <h3 className="manager-heading">
                                Notes
                            </h3>
                            <div className="manager-function-box center">
                            <p>View Notes</p>
                            </div>
                        </div>
                        <div className="manager-function">
                            <div className="function-seperator"></div>
                            <div
                                className="manager-function-box delete center"
                                onClick={this.props.deleteCurrentProject}
                                onTouchTap={this.props.deleteCurrentProject}>
                                <p>Delete Project</p>
                            </div>
                        </div>
                    </div>
                    <div className="manage-tools">
                        <div
                            onClick={this.props.selectAllArt}
                            onTouchTap={this.props.selectAllArt}
                            className="manage-tool right-border">
                            <h4 className="manage-tool-writing">
                                Select All
                            </h4>
                        </div>

                        <div
                            onClick={this.props.deselectAllArt}
                            onTouchTap={this.props.deselectAllArt}                            className="manage-tool">
                            <h4 className="manage-tool-writing">
                                Deselect All
                            </h4>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    closedManager = () => {

        const containerWidth = {
            height: window.innerHeight - 60,
            width: window.innerWidth * 0.4 - 40,
            maxWidth: "400px"
        }

        let managerWidth = 200; // Magic Number to Instantiate

        if (document.getElementsByClassName('search-manager')[0]) {
            managerWidth = document.getElementsByClassName('search-manager')[0].offsetWidth;
        }

        return (
            <section
                style={{
                height: window.innerHeight - 60,
                right: -1 * managerWidth + 40
                }}
                className="search-manager">
                <ManageToggler
                    background      ={"#323232"}
                    height          ={window.innerHeight - 60}
                    managerIsOpen   ={this.props.managerIsOpen}
                    toggleManager   ={this.props.toggleManager}/>
                <div
                    style={containerWidth}
                    className="search-manager-container">
                </div>
            </section>
        );
    }

// ============= Methods ===============




    /**
     * TODO
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    toggleAccordion = (item) => {
        let accordion   = this.state.accordion;
        accordion[item] = !accordion[item];
        this.setState({
            accordion: accordion
        });
    }

    /**
     * [toggleAllAccordion description]
     * @return {[type]} [description]
     */
    toggleAllAccordion = () => {
        let allAccordion = this.state.allAccordion;

        let accordion   = {
            general : !allAccordion,
            artist  : !allAccordion,
            tag     : !allAccordion,
            title   : !allAccordion,
            time    : !allAccordion,
            color   : !allAccordion,
        };

        this.setState({
            accordion: accordion,
            allAccordion: !allAccordion
        });
    }
}
