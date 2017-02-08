//Libs
import React       from 'react';
import Select      from 'react-select';
import {Creatable} from 'react-select';
import {Tooltip, OverlayTrigger}    from 'react-bootstrap';
//Files
import Roles       from '../../constants/Roles';


/**
 * This component handles selecting which project to add artworks too.
 */
export default class ProjectSelector extends React.Component {
    state = {

    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ProjectSelector");
    }

    render() {
        let options = this.props.projects.map( (project)=>{
                return {label: project[0], value: project[0], id:project[1]}
            });

        let display;

        if (!this.props.currentProject) {
            display = "";
        } else {
            display = this.props.currentProject[0];
        }


        const selectorContainerWidth = {
            width   : window.innerWidth * 0.4 - 40 - 60 - 20 // 40px = toggler, 60px = edit button, 20px = padding
        }

        const selectorWidth = {
            width: window.innerWidth * 0.2 + "!important",
            display: "inline-block"
        }

        const addProjectTooltip = (
            <Tooltip
                id="add-project-tooltip"
                className="tooltip">
                Add Project
            </Tooltip>
        );
        return (
            <div
                className="project-selector-container">
                <div
                    className="project-selector"
                    style={selectorContainerWidth}>
                    <Select
                        style={selectorWidth}
                        options={options}
                        name="project-select"
                        placeholder="Select a project..."
                        value={display}
                        onChange={this.props.changeProject}
                        clearable="true"
                    />
                </div>
                <div
                    className="project-edit-button-container"
                    onClick     ={this.props.addNewProject}
                    onTouchTap  ={this.props.addNewProject}
                    >
                  <OverlayTrigger
                      placement   ="bottom"
                      overlay     ={addProjectTooltip}>
                      <img
                          className   ="project-edit-button"
                          src         ='assets/images/icons/plus-white.svg'
                      />
                  </OverlayTrigger>
                </div>
            </div>
        );

    }

    componentDidMount() {
        console.log("+++++ProjectSelector");
    }

    componentWillReceiveProps(nextProps) {
        //Pass
    }

    // ------------ METHODS -------------
    handleAddProject = () => {
        this.props.addNewProject();
    }
}
