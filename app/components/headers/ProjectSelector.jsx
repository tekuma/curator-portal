//Libs
import React     from 'react';
import Select    from 'react-select';

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
                return {label: project, value: project}
            });

        return (
            <div>
                <div id="project-selector">
                    <Select
                        autofocus
                        options={options}
                        name="project-select"
                        placeholder="Select a project..."
                        value={this.props.currentProject}
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
