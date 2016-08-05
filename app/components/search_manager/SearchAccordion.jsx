// Libs
import React                        from 'react';
import Dropzone                     from 'react-dropzone';
import getMuiTheme                  from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider             from 'material-ui/styles/MuiThemeProvider';
import Snackbar                     from 'material-ui/Snackbar';
import {Tooltip, OverlayTrigger}    from 'react-bootstrap';
import Select                       from 'react-select';
import { WithContext as ReactTags } from 'react-tag-input';


export default class SearchAccordion extends React.Component {
    state = {
        artistNames: [
            "Afika Nyati",
            "Stephen White",
            "Kun Qian",
            "Naomi Hérbert",
            "Marwan Aboudib",
            "Li Qin",
            "Jia Rao",
            "Ge Linda Wang",
            "Clio Berta"
        ],
        clearable: true,
        artistValue: "",
        tags: [],
        suggestions: ["happy","sad", "sane", "elephant", "sunset"]

    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----SearchHints");
    }

    render() {
        let wrapperHeight = {
            height: window.innerHeight - 240
        }

        let options = this.state.artistNames.map(function(artist){
                return {label: artist, value: artist}
            });

        return(
            <div
                style={wrapperHeight}
                className="search-accordion-wrapper">
                <article
                    className="search-accordion">
                    <div
                        className={this.props.accordion.artist ? "accordion-item open" : "accordion-item"}
                        onClick={this.props.toggleAccordion.bind({},"artist")}>
                        <h2 className="accordion-item-heading search">Artist</h2>
                    </div>
                    <div
                        id="search-artist-content"
                        className={this.props.accordion.artist ? "accordion-content open" : "accordion-content"}>
                        <Select
                            ref="searchArtist"
                            autofocus
                            options={options}
                            simpleValue
                            clearable={this.state.clearable}
                            name="artist-search"
                            value={this.state.artistValue}
                            placeholder="Search by Artist Name..."
                            onChange={this.artistChange}
                            />
                    </div>
                    <div
                        className={this.props.accordion.tag ? "accordion-item open" : "accordion-item"}
                        onClick={this.props.toggleAccordion.bind({},"tag")}>
                        <h2 className="accordion-item-heading search">Tag</h2>
                    </div>
                    <div
                        id="search-tag-content"
                        className={this.props.accordion.tag ? "accordion-content open" : "accordion-content"}>
                        <ReactTags
                            tags={this.state.tags}
                            suggestions={this.state.suggestions}
                            handleDelete={this.handleDelete}
                            handleAddition={this.handleAddition}
                            handleDrag={this.handleDrag} />
                    </div>
                    <div
                        className={this.props.accordion.title ? "accordion-item open" : "accordion-item"}
                        onClick={this.props.toggleAccordion.bind({},"title")}>
                        <h2 className="accordion-item-heading search">Title</h2>
                    </div>
                    <div
                        id="search-title-content"
                        className={this.props.accordion.title ? "accordion-content open" : "accordion-content"}>
                        <input
                        type="text"
                        id="search-title"
                        onChange={this.setUnsaved}
                        ref="title"
                        placeholder="Search by Artwork Title..."
                        required=""
                        autoCapitalize="off"
                        autoComplete="off"
                        autoCorrect="off" />
                    </div>
                    <div
                        className={this.props.accordion.time ? "accordion-item open" : "accordion-item"}
                        onClick={this.props.toggleAccordion.bind({},"time")}>
                        <h2 className="accordion-item-heading search">Time</h2>
                    </div>
                    <div
                        id="search-time-content"
                        className={this.props.accordion.time? "accordion-content open" : "accordion-content"}>
                    </div>
                    <div
                        className={this.props.accordion.color ? "accordion-item open no-border-bottom" : "accordion-item no-border-bottom"}
                        onClick={this.props.toggleAccordion.bind({},"color")}>
                        <h2 className="accordion-item-heading search">Color</h2>
                    </div>
                    <div
                        id="search-color-content"
                        className={this.props.accordion.color ? "accordion-content open" : "accordion-content"}>

                    </div>
                </article>
            </div>
        );
    }

    componentDidMount() {
        console.log("+++++SearchHints");

    }

    componentWillReceiveProps(nextProps) {
        //pass
    }

    // -------- METHODS ------------
    artistChange = (artist) => {
        this.setState({
            artistValue: artist
        });

        if (artist) {
            this.props.toggleSearchCategory("artist", true);
        } else {
            this.props.toggleSearchCategory("artist", false);
        }
    }

    handleDelete = (i) => {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    }

    handleAddition = (tag) => {
        let tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });

        this.setState({tags: tags});
    }

    handleDrag = (tag, currPos, newPos) => {
        let tags = this.state.tags;

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: tags });
    }
}
