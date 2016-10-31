// Dependencies
import React    from 'react';
import firebase from 'firebase';
// Components
import ArtworkManager from '../artwork_manager/ArtworkManager';
import CurationHeader from '../headers/CurationHeader';
import SearchManager  from './SearchManager';


export default class SearchMain extends React.Component {
    state = {
        results: ["thing1","thing2", "thing3"] //TODO remove
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
                    setQueryString={this.props.setQueryString}
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
}
