import React    from 'react';
import firebase from 'firebase';

import ArtworkManager from '../artwork_manager/ArtworkManager';

export default class SearchResults extends React.Component {
    state = {
        results: ["thing1","thing2"] //TODO remove 
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----SearchResults");
    }

    render() {
        return (
            <ArtworkManager
                results = {this.state.results}
                managerIsOpen={this.props.managerIsOpen}
            />
        );
    }

    /*
    <section className="search-results"><div>
        <ul>{this.state.results.map(row =>
            <li><span id="artist">{row.artist}</span>
            <span id="title">{row.title}</span></li>)}
        </ul>
    </div></section>
     */

    componentDidMount() {
        console.log("+++++SearchResults");
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
