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
                    <h3 className="hint-heading">
                        {window.innerWidth > 955 ?
                            "General"
                            :
                            window.innerWidth > 870 ?
                                "Gen."
                                :
                                "G"
                        }
                        </h3>
                    <div
                        className={this.props.searchCategories.general ? "hint-circle filled" : "hint-circle"} />
                </div>
                <div className="hint">
                    <h3 className="hint-heading">
                        {window.innerWidth > 870 ?
                            "Artist"
                            :
                            "A"
                        }
                    </h3>
                    <div
                        className={this.props.searchCategories.artist ? "hint-circle filled" : "hint-circle"} />
                </div>
                <div className="hint">
                    <h3 className="hint-heading">
                        {window.innerWidth > 870 ?
                            "Tag"
                            :
                            "Ta"
                        }
                    </h3>
                    <div
                        className={this.props.searchCategories.tag ? "hint-circle filled" : "hint-circle"} />
                </div>
                <div className="hint">
                    <h3 className="hint-heading">
                        {window.innerWidth > 870 ?
                            "Title"
                            :
                            "Titl"
                        }
                    </h3>
                    <div
                        className={this.props.searchCategories.title ? "hint-circle filled" : "hint-circle"} />
                </div>
                <div className="hint">
                    <h3 className="hint-heading">
                        {window.innerWidth > 870 ?
                            "Time"
                            :
                            "Tim"
                        }
                    </h3>
                    <div
                        className={this.props.searchCategories.time ? "hint-circle filled" : "hint-circle"} />
                </div>
                <div className="hint">
                    <h3 className="hint-heading">
                        {window.innerWidth > 870 ?
                            "Color"
                            :
                            "C"
                        }
                    </h3>
                    <div
                        className={this.props.searchCategories.color ? "hint-circle filled" : "hint-circle"} />
                </div>
            </div>
        );
    }

    componentDidMount() {
        console.log("++++++SearchHints");

    }

// ============= Methods ===============

}//END App
