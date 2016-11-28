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
        console.log(options);

        let display;

        if (this.props.currentProject.length === 0) {
            display = "";
        } else {
            display = this.props.currentProject[0];
            console.log("display ->", display, this.props.currentProject);
        }


        if (this.props.role == Roles.SEARCH) {

            const selectorContainerWidth = {
                width: window.innerWidth * 0.2 + 36
            }
            const selectorWidth = {
                width: window.innerWidth * 0.2 + 36 ,
                display: "inline-block"
            }

            return (
                <div>
                    <div
                        id="project-selector"
                        style={selectorContainerWidth}>

                        <Select
                            className="project-select"
                            style={selectorWidth}
                            options={options}
                            name="project-select"
                            placeholder="Select a project..."
                            value={display}
                            onChange={this.props.changeProject}
                            clearable="true"
                        />
                    </div>
                </div>
            );


        } else {  // in MANAGE
            const selectorContainerWidth = {
                width: window.innerWidth * 0.2 + 36
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
                <div>
                    <div
                        id="project-selector"
                        style={selectorContainerWidth}>
                        <OverlayTrigger
                            placement   ="bottom"
                            overlay     ={this.props.role == Roles.SEARCH ? null : addProjectTooltip}
                            >

                            <div
                                className="add-project-button"
                                onClick={this.handleAddProject}
                                onTouchTap={this.handleAddProject}
                                >
                                <img src='assets/images/icons/plus-white.svg' />
                            </div>
                        </OverlayTrigger>
                        <Select
                            className="project-select"
                            style={selectorWidth}
                            options={options}
                            name="project-select"
                            placeholder="Select a project..."
                            value={display}
                            onChange={this.props.changeProject}
                            clearable="true"
                        />
                    </div>
                </div>
            );
        }


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
