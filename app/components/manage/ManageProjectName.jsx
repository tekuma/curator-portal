// Libs
import React from 'react';
import {Tooltip, OverlayTrigger}    from 'react-bootstrap';

// Files

/**
 * ManageProjectName:
 */
export default class ManageProjectName extends React.Component {
    state = {
        editing: false,
        currentProject:""
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ManageProjectName");
    }

    render() {
        if(this.state.editing) {
            return this.renderEdit();
        } else {
            return this.renderName();
        }
    }



    componentDidMount() {
        console.log("++++++ManageProjectName");
        if (this.props.currentProject.length == 0) {
            this.setState({currentProject: "No Project Selected", editing: false});
        } else {
            this.setState({currentProject: this.props.currentProject[0], editing: false});
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.currentProject.length == 0) {
            this.setState({currentProject: "No Project Selected", editing: false});
        } else {
            this.setState({currentProject: nextProps.currentProject[0], editing: false});
        }
    }
    // ============= Render Flow ===============

    renderEdit = () => {
        const editTooltip = (
            <Tooltip
                id="edit-artwork-tooltip"
                className="tooltip">
                Save Project Name
            </Tooltip>
        );

        let styleProjectName = {
            width   : window.innerWidth * 0.4 - 40 - 60 - 20, // 40px = toggler, 60px = edit button, 20px = padding
            maxWidth: "320px"
        };

        return(
            <div
                className="project-name-container">
                <div className="project-name-writing">
                    <input type="text"
                        className="edit-project-name"
                        style={styleProjectName}
                        ref={
                            (e) => e ? e.selectionStart = 5 : null // Length of Project name
                        }
                        autoFocus={true}
                        name="project-name-input"
                        defaultValue={this.state.currentProject}
                        onBlur={this.finishEdit}
                        onKeyPress={this.checkEnter}
                        placeholder="Enter Project Name..." />
                </div>
                <div
                    className="project-edit-button-container"
                    onClick     ={this.finishEdit}
                    onTouchTap  ={this.finishEdit}>
                  <OverlayTrigger
                      placement   ="bottom"
                      overlay     ={editTooltip}>
                      <img
                          className   ="project-edit-button"
                          src         ='assets/images/icons/edit-white.svg'
                      />
                  </OverlayTrigger>
                </div>
            </div>
        );
    }

    renderName = () => {
        const editTooltip = (
            <Tooltip
                id="edit-artwork-tooltip"
                className="tooltip">
                Edit Project Name
            </Tooltip>
        );

        let styleProjectName = {
            width   : window.innerWidth * 0.4 - 40 - 60 - 20, // 40px = toggler, 60px = edit button, 20px = padding
            maxWidth: "320px"
        };

        return(
            <div
                className="project-name-container">
                <div
                    className="project-name-writing"
                    style={styleProjectName}>
                    <h3 className="project-name">
                        {this.state.currentProject}
                    </h3>
                </div>
                <div
                    className="project-edit-button-container"
                    onClick     ={this.edit}
                    onTouchTap  ={this.edit}
                    >
                  <OverlayTrigger
                      placement   ="bottom"
                      overlay     ={editTooltip}>
                      <img
                          className   ="project-edit-button"
                          src         ='assets/images/icons/edit-white.svg'
                      />
                  </OverlayTrigger>
                </div>
            </div>
        );
    }

    // ============= Methods ===============

    edit = (e) => {

            // Enter edit mode.
            this.setState({
                editing: true
            });
        };

    checkEnter = (e) => {
        // The user hit *enter*, let's finish up.
        if(e.key === 'Enter') {
            this.finishEdit(e);
        }
    };

    finishEdit = (e) => {
        e.stopPropagation();
        // Exit edit mode.

        let newName = document.getElementsByName("project-name-input")[0].value;

        if (newName != this.state.currentProject) {
            this.props.renameCurrentProject(newName);
        }

        this.setState({
            editing: false
        });
    }

}//END App
