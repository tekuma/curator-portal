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
                return {label: project[0], value: project[1]}
            });

        let display;

        if (this.props.currentProject.length === 0) {
            display = "";
        } else {
            display = this.props.currentProject[0]; // FIXME not working
        }
        // console.log(display);

        return (
            <div>
                <div id="project-selector">
                    <Select
                        autofocus
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
