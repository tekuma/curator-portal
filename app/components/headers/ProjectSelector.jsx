//Libs
import React     from 'react';
import Select    from 'react-select';

/**
 * This component handles selecting which project to add artworks too.
 */
export default class ProjectSelector extends React.Component {
    state : {
        projectNames: ["Project1", "project 2"]
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ProjectSelector");
    }

    render() {

        let options = this.state.projectNames.map(function(project){
                return {label: project, value: project}
            });

        return (
            <div>
                <div id="search-bar">
                    <Select
                                ref="searchArtist"
                                autofocus
                                options={options}
                                simpleValue
                                clearable={true}
                                name="artist-search"

                                placeholder="Select a project..."

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


    doSearch = (e) => {
        this.props.setQueryString(this.refs.searchTerm.value)
    }

    search = () => {
        let searchTerm = this.refs.searchTerm.value;
        this.props.setSearchTerm(searchTerm);
    }
}
