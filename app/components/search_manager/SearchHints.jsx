// Libs
import React              from 'react';

// Files

/**
 * a
 */
export default class SearchHints extends React.Component {
    state = {

    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----SearchHints");
    }

    render() {

        return(
            <div
                className="search-hints">
                <div className="hint">
                    <h3 className="hint-heading">Artist</h3>
                    <div
                        className={this.props.searchCategory.artist ? "hint-circle filled" : "hint-circle"} />
                </div>
                <div className="hint">
                    <h3 className="hint-heading">Tag</h3>
                    <div
                        className={this.props.searchCategory.tag ? "hint-circle filled" : "hint-circle"} />
                </div>
                <div className="hint">
                    <h3 className="hint-heading">Title</h3>
                    <div
                        className={this.props.searchCategory.title ? "hint-circle filled" : "hint-circle"} />
                </div>
                <div className="hint">
                    <h3 className="hint-heading">Time</h3>
                    <div
                        className={this.props.searchCategory.time ? "hint-circle filled" : "hint-circle"} />
                </div>
                <div className="hint">
                    <h3 className="hint-heading">Color</h3>
                    <div
                        className={this.props.searchCategory.color ? "hint-circle filled" : "hint-circle"} />
                </div>
            </div>
        );
    }

    componentDidMount() {
        console.log("++++++SearchHints");

    }

// ============= Methods ===============

}//END App
