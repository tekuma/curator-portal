// Libs
import React from 'react';
import {Tooltip, OverlayTrigger}    from 'react-bootstrap';

// Files

/**
 * ManageProjectName:
 */
export default class ManageProjectName extends React.Component {
    state = {
        editing: false
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
        }
        return this.renderName();
    }



    componentDidMount() {
        console.log("++++++ManageProjectName");

    }
    // ============= Render Flow ===============

    renderEdit = () => {
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
        let thisProject;
        if (this.props.currentProject.length == 0) {
            thisProject = "<select a project>";
        } else {
            thisProject = this.props.currentProject[0];
        }

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
                        defaultValue={thisProject}
                        onBlur={this.finishEdit}
                        onKeyPress={this.checkEnter}
                        placeholder="Enter Project Name..." />
                </div>
                <div className="project-edit-button-container">
                  <OverlayTrigger
                      placement   ="bottom"
                      overlay     ={editTooltip}>
                      <img
                          className   ="project-edit-button"
                          src         ='assets/images/icons/edit-white.svg'
                          onClick     ={this.finishEdit}
                          onTouchTap  ={this.finishEdit}
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
        let thisProject;
        if (this.props.currentProject.length == 0) {
            thisProject = "<~ ~>";
        } else {
            thisProject = this.props.currentProject[0];
        }

        return(
            <div
                className="project-name-container">
                <div
                    className="project-name-writing"
                    style={styleProjectName}>
                    <h3 className="project-name">
                        {thisProject}
                    </h3>
                </div>
                <div className="project-edit-button-container">
                  <OverlayTrigger
                      placement   ="bottom"
                      overlay     ={editTooltip}>
                      <img
                          className   ="project-edit-button"
                          src         ='assets/images/icons/edit-white.svg'
                          onClick     ={this.edit}
                          onTouchTap  ={this.edit}
                      />
                  </OverlayTrigger>
                </div>
            </div>
        );
    }

    // ============= Methods ===============

    edit = (e) => {
            // Avoid bubbling to click that opens up album view
            e.stopPropagation();

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
        let newName = document.getElementsByName("project-name-input")[0].value;
        this.props.renameCurrentProject(newName);
        // Exit edit mode.
        this.setState({
            editing: false
        });
    }

}//END App
