// Libs
import React            from 'react';
import Dropzone         from 'react-dropzone';
import getMuiTheme      from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar         from 'material-ui/Snackbar';
import {Tooltip, OverlayTrigger}    from 'react-bootstrap';


export default class SearchAccordion extends React.Component {
    state = {
        accordion: {
            artist      : false,
            tag         : false,
            title       : false,
            time        : false,
            color       : false
        },
        allAccordion    : false
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

        return(
            <div
                style={wrapperHeight}
                className="search-accordion-wrapper">
                <article
                    className="search-accordion">
                    <div
                        className={this.state.accordion.artist ? "accordion-item open" : "accordion-item"}
                        onClick={this.toggleAccordion.bind({},"artist")}>
                        <h2 className="accordion-item-heading search">Artist</h2>
                    </div>
                    <div
                        id="display-name-content"
                        className={this.state.accordion.artist ? "accordion-content open" : "accordion-content"}>

                    </div>
                    <div
                        className={this.state.accordion.tag ? "accordion-item open" : "accordion-item"}
                        onClick={this.toggleAccordion.bind({},"tag")}>
                        <h2 className="accordion-item-heading search">Tag</h2>
                    </div>
                    <div
                        id="avatar-content"
                        className={this.state.accordion.tag ? "accordion-content open" : "accordion-content"}>

                    </div>
                    <div
                        className={this.state.accordion.title ? "accordion-item open" : "accordion-item"}
                        onClick={this.toggleAccordion.bind({},"title")}>
                        <h2 className="accordion-item-heading search">Title</h2>
                    </div>
                    <div
                        id="bio-content"
                        className={this.state.accordion.title ? "accordion-content open" : "accordion-content"}>
                    </div>
                    <div
                        className={this.state.accordion.time ? "accordion-item open" : "accordion-item"}
                        onClick={this.toggleAccordion.bind({},"time")}>
                        <h2 className="accordion-item-heading search">Time</h2>
                    </div>
                    <div
                        id="location-content"
                        className={this.state.accordion.time? "accordion-content open" : "accordion-content"}>
                    </div>
                    <div
                        className={this.state.accordion.color ? "accordion-item open no-border-bottom" : "accordion-item no-border-bottom"}
                        onClick={this.toggleAccordion.bind({},"color")}>
                        <h2 className="accordion-item-heading search">Color</h2>
                    </div>
                    <div
                        id="portfolio-content"
                        className={this.state.accordion.color ? "accordion-content open" : "accordion-content"}>

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

    /**
     * TODO
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    toggleAccordion = (item) => {
        let accordion   = this.state.accordion;
        accordion[item] = !accordion[item];
        this.setState({
            accordion: accordion
        });
    }

    toggleAllAccordion = () => {
        let allAccordion = this.state.allAccordion;

        let accordion   = {
            display_name: !allAccordion,
            avatar      : !allAccordion,
            bio         : !allAccordion,
            location    : !allAccordion,
            portfolio   : !allAccordion,
            social_media: !allAccordion
        };

        this.setState({
            accordion: accordion,
            allAccordion: !allAccordion
        });
    }
}
