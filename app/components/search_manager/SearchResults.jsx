import React from 'react';

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
        return (
            <section className="search-results"><div>
                <ul>{this.state.results.map(row =>
                    <li><span id="artist">{row.artist}</span>
                    <span id="title">{row.title}</span></li>)}
                </ul>
            </div></section>
        );
    }

    componentDidMount() {
        if (this.state.query.length === 0) {
            return;
        }
        console.log(">> Query String:", queryString);
        $.ajax({
            url: 'search?q='+String(this.props.queryString),
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({results: data.rows});
            }.bind(this)
        });
    }

    componentWillReceiveProps(updates){
        console.log("=========");
        console.log("Recieved query string in SearchResults ->", updates.queryString);
        //
        //TODO : Do AJAX request with query string in the WillReceiveProps method.
    }

}
