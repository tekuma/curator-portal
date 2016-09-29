import React from 'react';

/**
 * TODO
 * @param  {[type]} {searchOpen   [description]
 * @param  {[type]} toggleSearch} [description]
 * @return {[type]}               [description]
 */
export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----SearchBar");
    }

    render() {

        return (
            <div>
                <div id="search-bar">
                    <form action="search">
                        <input
                            ref="searchTerm"
                            className="search-input"
                            placeholder="Search by artist, title, tag ..."
                            type="search" name="q" id="search"
                            autoFocus={true} />
                    </form>
                </div>
            </div>
        );
    }

    componentDidMount() {
        console.log("+++++SearchBar");
    }

    componentWillReceiveProps(nextProps) {
        //Pass
    }

    // ------------ METHODS -------------
    search = () => {
        let searchTerm = this.refs.searchTerm.value;
        this.props.setSearchTerm(searchTerm);
    }
}
