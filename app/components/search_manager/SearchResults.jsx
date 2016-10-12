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
    }

    componentWillReceiveProps(updates){
        console.log("=========");
        if (updates.queryString.length === 0) {
            return;
        }

        console.log(">> Query String:", updates.queryString);
        $.ajax({
            url: 'search?q='+String(updates.queryString),
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({results: data.rows});
            }.bind(this)
        });
    }

}
