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
        collabBuffer:"",
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ProjectManager");
    }

    render() {
        return this.manager();
    }

    componentDidMount() {
        console.log("+++++ProjectManager");
    }

    componentWillReceiveProps(nextProps) {

    }

// ============= Flow Control ===============

    manager = () => {

        // Dynamic CSS
        const containerWidth = {
            height: window.innerHeight - 60, // Minus 60px for Header
            width: window.innerWidth * 0.4 - 40,
            maxWidth: "400px"
        }

        const managerFunctionHeight = {
            height: window.innerHeight - 60 - 60 - 60 // Minus 60px for Header, Project Name, and SelectButtons
        }

        const openManager = {
            height: window.innerHeight - 60,
            right: 0
        }

        let managerWidth = 200; // Magic Number to Instantiate

        if (document.getElementsByClassName('search-manager')[0]) {
            managerWidth = document.getElementsByClassName('search-manager')[0].offsetWidth;
        }

        const closedManager = {
            height: window.innerHeight - 60,
            right: -1 * managerWidth + 40
        }

        const hide = {
            display: "none"
        }

        const show = {
            display: "inline-block"
        }

        let options = [];
        let ownerName = "";
        if (this.props.users) {
            this.props.users.map( (user)=>{
                //NOTE: this is for dynamic usage of the curator's name.
                // We dont store it in the project, so we must find it.
                if (user[0]=== this.props.projectDetails.curator){
                    ownerName = user[1];
                }
                options.push({label:user[1], value:user[0], user:user});
            });
        }

        //NOTE: collaborators have their id AND name stored in the project.
        //If a collaborator changes their display_name , it will not be reflected here.

        let collaborators = [];
        if (this.props.projectDetails.collaborators) {
            collaborators = this.props.projectDetails.collaborators;
        }

        //NOTE: in the Collaborator tool, the current user is shown in black, and
        //all other collaborators in grey.  collaborator-thumb self

        return (
            <section
                style={this.props.managerIsOpen ? openManager: closedManager}
                className="search-manager">
                <ManageToggler
                    background      ={"#323232"}
                    height          ={window.innerHeight - 60}
                    managerIsOpen   ={this.props.managerIsOpen}
                    toggleManager   ={this.props.toggleManager}/>
                <div
                    style={containerWidth}
                    className="project-manager-container">
                    {this.props.projects.length == 0 ?
                        <div></div>
                        :
                        <ManageProjectName
                            renameCurrentProject={this.props.renameCurrentProject}
                            currentProject={this.props.currentProject}
                            />
                    }
                    <div
                        style={managerFunctionHeight}
                        className={this.props.projects.length == 0 ? "manager-function-wrapper centering" : "manager-function-wrapper"}>
                        <div
                            className="manager-function"
                            style={this.props.projects.length == 0 ? show : hide}
                            onClick={this.props.addNewProject}
                            onTouchTap={this.props.addNewProject}
                            >
                            <div className="manager-function-box center">
                                <div className="first-project-button">
                                    <img
                                        className="first-project-icon"
                                        src="assets/images/icons/plus-pink.svg" />
                                    <h2
                                        className="first-project-writing"
                                        >Create First Project</h2>
                                </div>
                            </div>
                        </div>
                        <div
                            className="manager-function"
                            style={this.props.projects.length == 0 ? hide : show}>
                            <h3 className="manager-heading">
                                Download
                            </h3>
                            <div className="manager-function-box download center"
                                 onClick={this.handleCSV}
                                 onTouchTap={this.handleCSV}>
                                <p>CSV</p>
                            </div>
                            <div className="manager-function-box download center"
                                 onClick={this.handleRaw}
                                 onTouchTap={this.handleRaw}>
                                <p>Raw Images</p>
                            </div>
                            <div className="manager-function-box download center"
                                 onClick={this.handlePrintfile}
                                 onTouchTap={this.handlePrintfile}>
                                <p>Print Files</p>
                            </div>
                        </div>
                        <div
                            className="manager-function"
                            style={this.props.projects.length == 0 ? hide : show}>
                            <h3 className="manager-heading">
                                Collaborators
                            </h3>
                            <div className="manager-function-box center collaborators">
                                <div className="collaborator-box">
                                    <article
                                        key={this.props.projectDetails.curator}
                                        className={this.props.projectDetails.curator==firebase.auth().currentUser.uid
                                             ? "collaborator-thumb self" : "collaborator-thumb"}>
                                        <p className="collaborator-name">
                                            {ownerName} <span>(creator)</span>
                                        </p>

                                    </article>
                                    {collaborators.map( user => {
                                        let self2 = user[0] === firebase.auth().currentUser.uid;
                                        return(
                                            <article
                                                key={user[0]}
                                                className={self2 ? "collaborator-thumb self" : "collaborator-thumb"}>
                                                <p className="collaborator-name">
                                                    {user[1]}
                                                </p>
                                                <div className="delete-collaborator"
                                                     onTouchTap={this.deleteCollaborator.bind({}, user)}
                                                     onClick={this.deleteCollaborator.bind({}, user)}>
                                                    <img src="assets/images/icons/delete-white.svg" />
                                                </div>
                                            </article>
                                        );
                                    })}


                                </div>
                                <p>Add Collaborator</p>
                                <Select
                                    className="add-collaborator-selector"
                                    ref="searchArtist"
                                    inputProps={{id: 'search-artist'}}
                                    autofocus
                                    onChange={this.collaboratorChange}
                                    options={options}
                                    clearable={false}
                                    name="artist-search"
                                    value={this.state.collabBuffer[0]}
                                    placeholder="Name..."
                                    />
                                <div
                                    onClick={this.addCollaborator}
                                    onTouchTap={this.addCollaborator}
                                    className="collaborator-add-button"
                                    title="Add Collaborator">
                                    <p>+</p>
                                </div>
                            </div>
                        </div>
                        <div
                            className="manager-function"
                            style={this.props.projects.length == 0 ? hide : show}>
                            <h3 className="manager-heading">
                                Notes
                            </h3>
                            <div
                                className="manager-function-box center"
                                onClick={this.props.toggleManageNotes}
                                onTouchTap={this.props.toggleManageNotes}>
                            <p>Manage Notes</p>
                            </div>
                        </div>
                        <div
                            className="manager-function"
                            style={this.props.projects.length == 0 ? hide : show}>
                            <div className="function-seperator"></div>
                            <div
                                className="manager-function-box delete center"
                                onClick={this.props.onDelete}
                                onTouchTap={this.props.onDelete}>
                                <p>Delete Project</p>
                            </div>
                        </div>
                    </div>
                    <div className="manage-tools">
                        <div
                            onClick={this.props.selectAllArt}
                            onTouchTap={this.props.selectAllArt}
                            className="manage-tool right-border"
                            title="Select All Artworks">
                            <h4 className="manage-tool-writing">
                                Select All
                            </h4>
                        </div>

                        <div
                            onClick={this.props.deselectAllArt}
                            onTouchTap={this.props.deselectAllArt}
                            className="manage-tool"
                            title="Deselect All Artworks">
                            <h4 className="manage-tool-writing">
                                Deselect All
                            </h4>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

// ============= Methods ===============

    /**
     * This method deletes a collaborator from a project.
     * - Remove user from /project branch
     * - Remove project from /user branch
     * @param  {Array} user [uid,name]
     */
    deleteCollaborator = (user) => {
        let project_id = this.props.currentProject[1];
        let projPath = `projects/${project_id}/collaborators`;
        firebase.database().ref(projPath).transaction((data)=>{
            function isNotUser(value){

                return value[0] != user[0]
            }
            let newdata = data.filter(isNotUser);
            return newdata;
        });

        let userPath = `users/${user[0]}/projects`;
        firebase.database().ref(userPath).transaction((data)=>{
            function isNotProject(value){
                return value != project_id
            }
            let newData = data.filter(isNotProject);
            return newData;
        });
    }

    collaboratorChange = (data) => {
        this.setState({collabBuffer:data.user});
    }

    /**
     * Adds user from this.state.collabBuffer to the
     * current project.
     * - in project branch
     * - in user branch
     */
    addCollaborator = () => {
        if (this.state.collabBuffer != "") {
            // console.log(this.props.currentProject[1]);
            let project_id = this.props.currentProject[1];
            let projPath = `projects/${project_id}/collaborators`;
            firebase.database().ref(projPath).transaction((data)=>{
                if (!data){
                    data = [];
                }
                data.push(this.state.collabBuffer);
                return data;
            });
            let userPath = `users/${this.state.collabBuffer[0]}/projects`;
            firebase.database().ref(userPath).transaction((data)=>{
                data.push(project_id);
                return data;
            });
        }
    }

    handleCSV = () => {
        console.log("Requested CSV for ->", this.props.artworkBuffer);
        //do ajax call here
    }

    handleRaw = () => {
        console.log("Requested Raw Files->",this.props.artworkBuffer);

    }
    handlePrintfile = () => {
        console.log("Requested Printfiles->",this.props.artworkBuffer);
    }

    /**
     * TODO
     * @param  {[type]} item [description]
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
