//Libs
import React     from 'react';
import Select    from 'react-select';
import Creatable from 'react-select';

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

        if (this.props.currentProject.length === 0) {
            display = "";
        } else {
            display = this.props.currentProject[0]; // FIXME not working
        }

        const selectorContainerWidth = {
            width: window.innerWidth * 0.2 + 36
        }

        const selectorWidth = {
            width: window.innerWidth * 0.2 + "!important",
            display: "inline-block"
        }

        return (
            <div>
                <div
                    id="project-selector"
                    style={selectorContainerWidth}>
                    <div className="add-project-button">
                        <img src='assets/images/icons/plus-white.svg' />
                    </div>
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

    componentDidMount() {
        console.log("+++++ProjectSelector");
    }

    componentWillReceiveProps(nextProps) {
        //Pass
    }

    // ------------ METHODS -------------

}
