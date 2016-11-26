// Libs
import React                        from 'react';
import firebase                     from 'firebase';
import uuid                         from 'node-uuid';
import {Tooltip, OverlayTrigger}    from 'react-bootstrap';
import update                       from 'react-addons-update';

// Files
import ManageAccordion              from './ManageAccordion';
import ManageHints                  from './ManageHints';
import ManageToggler                from './ManageToggler';

/**
 * TODO
 */
export default class ProjectManager extends React.Component {
    state = {
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ProjectManager");
    }

    render() {
        if(this.props.managerIsOpen) {
            return this.openedManager();
        } else {
            return this.closedManager();
        }
    }

    componentDidMount() {
        console.log("+++++ProjectManager");
    }

    componentWillReceiveProps(nextProps) {

    }

// ============= Flow Control ===============

    openedManager = () => {
        const addAlbumTooltip = (
            <Tooltip
                id="add-album-tooltip"
                className="tooltip">
                Create new album
            </Tooltip>
        );

        let containerWidth = {
            height: window.innerHeight - 60,
            width: window.innerWidth * 0.4 - 40,
            maxWidth: "400px"
        }

        return (
            <section
                style={{
                height: window.innerHeight - 60,
                right: 0
                }}
                className="search-manager">
                <ManageToggler
                    background      ={"#323232"}
                    height          ={window.innerHeight - 60}
                    managerIsOpen   ={this.props.managerIsOpen}
                    toggleManager   ={this.props.toggleManager}/>
                <div
                    style={containerWidth}
                    className="search-manager-container">
                    <ManageHints />
                    <div className="search-tools">
                        <div
                            onClick={this.toggleAllAccordion}
                            className="search-tool right-border">
                            <img src="assets/images/icons/open-accordion.svg" />
                            <h4 className="search-tool-writing">
                                Open
                            </h4>
                        </div>
                        <div
                            onClick={this.clearAllSearch}
                            className="search-tool">
                            <img src="assets/images/icons/cross.svg" />
                            <h4 className="search-tool-writing">
                                Clear
                            </h4>
                        </div>
                    </div>
                    <div className="search-button">
                        <h3>SEARCH</h3>
                    </div>
                </div>
            </section>
        );
    };

    closedManager = () => {

        let containerWidth = {
            height: window.innerHeight - 60,
            width: window.innerWidth * 0.4 - 40,
            maxWidth: "400px"
        }

        let managerWidth = 200; // Magic Number to Instantiate

        if (document.getElementsByClassName('search-manager')[0]) {
            managerWidth = document.getElementsByClassName('search-manager')[0].offsetWidth;
        }

        return (
            <section
                style={{
                height: window.innerHeight - 60,
                right: -1 * managerWidth + 40
                }}
                className="search-manager">
                <ManageToggler
                    background      ={"#323232"}
                    height          ={window.innerHeight - 60}
                    managerIsOpen   ={this.props.managerIsOpen}
                    toggleManager   ={this.props.toggleManager}/>
                <div
                    style={containerWidth}
                    className="search-manager-container">
                    <ManageHints  />
                    <div className="search-tools">
                        <div
                            onClick={this.toggleAllAccordion}
                            className="search-tool right-border">
                            <img src="assets/images/icons/open-accordion.svg" />
                            <h4 className="search-tool-writing">
                                Open
                            </h4>
                        </div>
                        <div
                            onClick={this.clearAllSearch}
                            className="search-tool">
                            <img src="assets/images/icons/cross.svg" />
                            <h4 className="search-tool-writing">
                                Clear
                            </h4>
                        </div>
                    </div>
                    <div className="search-button">
                        <h3>SEARCH</h3>
                    </div>
                </div>
            </section>
        );
    }

// ============= Methods ===============

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

    /**
     * [toggleAllAccordion description]
     * @return {[type]} [description]
     */
    toggleAllAccordion = () => {
        let allAccordion = this.state.allAccordion;

        let accordion   = {
            general : !allAccordion,
            artist  : !allAccordion,
            tag     : !allAccordion,
            title   : !allAccordion,
            time    : !allAccordion,
            color   : !allAccordion,
        };

        this.setState({
            accordion: accordion,
            allAccordion: !allAccordion
        });
    }
}
