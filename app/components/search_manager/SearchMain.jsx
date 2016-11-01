// Dependencies
import React    from 'react';
import firebase from 'firebase';
// Components
import ArtworkManager from '../artwork_manager/ArtworkManager';
import CurationHeader from '../headers/CurationHeader';
import SearchManager  from './SearchManager';


export default class SearchMain extends React.Component {
    state = {
        results       : ["thing1","thing2", "thing3"],          //TODO replace with firebase calls
        projects      : ["New Project", "84 Winter St", "GRT"], //TODO
        currentProject: ""

    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----SearchMain");
    }

    render() {
        return(
            <div className={this.props.navIsOpen ? "main-wrapper open" : "main-wrapper"}>
                <CurationHeader
                    currentProject={this.state.currentProject}
                    changeProject={this.changeProject}
                    projects={this.state.projects}
                />
                <ArtworkManager
                    results = {this.state.results}
                    managerIsOpen={this.props.managerIsOpen}
                />
                <SearchManager
                    managerIsOpen={this.props.managerIsOpen}
                    toggleManager={this.props.toggleManager}
                 />
                <div
                    onClick     ={this.toggleNav}
                    onTouchTap  ={this.toggleNav}
                    className   ={this.props.navIsOpen ? "site-overlay open" : "site-overlay"} />
            </div>
        );

    }


    componentDidMount() {
        console.log("+++++SearchMain");
    }

    componentWillReceiveProps(updates){
        if (updates.queryString.length === 0) {
            return;
        }

        var updateResultsList = (function(data) {
            this.setState({results: data.rows});
        }.bind(this));

        firebase.auth().currentUser.getToken(true).then(function(idToken) {
            console.log(">> Query String:", updates.queryString);
            $.ajax({
                url: ('search?q='
                      +String.replace(updates.queryString, '&', ' and ')
                      +'&auth='+String(idToken)),
                dataType: 'json',
                cache: false,
                success: updateResultsList
            });
        }).catch(function(err) {});
    }

    // =============== Methods =====================

    /**
     * Updates the value of this.state.currentProject
     * @param  {String} newName [name of new current project]
     */
    changeProject = (newName) => {
        this.setState({currentProject:newName});
        console.log("Updated project to ->", newName);
    }

}
