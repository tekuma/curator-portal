import React from 'react';

export default class SearchResults extends React.Component {
    state = {results: []}

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $.ajax({
            url: 'search?q=beef',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({results: data.rows});
            }.bind(this)
        });
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
}
