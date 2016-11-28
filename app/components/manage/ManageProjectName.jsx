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
                        defaultValue={"Bobby"}
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

        return(
            <div
                className="project-name-container">
                <div
                    className="project-name-writing"
                    style={styleProjectName}>
                    <h3 className="project-name">
                        {"Bobby"}
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

    componentDidMount() {
        console.log("++++++ManageProjectName");

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

finishEdit = () => {
    let newName = document.getElementsByName("project-name-input")[0].value;

    if (this.props.onEdit) {
        // Exit edit mode.
        this.setState({
            editing: false
        });
        this.props.onEdit(value);
    }
}

}//END App
