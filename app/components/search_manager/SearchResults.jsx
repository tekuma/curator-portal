import React from 'react';
import firebase from 'firebase';

import CurationHeader from '../headers/CurationHeader';
import HamburgerIcon  from '../headers/HamburgerIcon';

export default class SearchResults extends React.Component {
    state = {
        results: []
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    render() {
        return(
            <div className={this.props.navIsOpen ? "main-wrapper open" : "main-wrapper"}>
                <CurationHeader
                    setQueryString={this.props.setQueryString}
                />
                <div
                    onClick     ={this.toggleNav}
                    onTouchTap  ={this.toggleNav}
                    className   ={this.props.navIsOpen ? "site-overlay open" : "site-overlay"} />
            </div>
        );

    }

    componentDidMount() {
    }

    componentWillReceiveProps(updates){
        console.log("=========");
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
