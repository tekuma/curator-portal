// Dependencies
import React    from 'react';
import firebase from 'firebase';
// Components
import ProjectArtworkManager from '../artwork_manager/ProjectArtworkManager';
import ProjectManager from './ProjectManager';
import CurationHeader from '../headers/CurationHeader';


export default class ManagerMain extends React.Component {
    state = {
        command        : "" // for sending actions down to Artworks
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ManagerMain");
    }

    render() {
        return(
            <div>
                <ProjectArtworkManager
                      command={this.state.command}
                      projectArtworks={this.props.projectArtworks}
                      managerIsOpen={this.props.managerIsOpen}
                      addArtworkToBuffer={this.props.addArtworkToBuffer}
                      removeArtworkFromBuffer={this.props.removeArtworkFromBuffer}
                  />
                  <ProjectManager
                      selectAllArt={this.selectAllArt}
                      deselectAllArt={this.deselectAllArt}
                      deleteCurrentProject={this.props.deleteCurrentProject}
                      renameCurrentProject={this.props.renameCurrentProject}
                      currentProject={this.props.currentProject}
                      managerIsOpen={this.props.managerIsOpen}
                      toggleManager={this.props.toggleManager}
                      changeProject={this.props.changeProject}
                      doQuery={this.doQuery}
                   />
                  <div
                      onClick     ={this.props.toggleNav}
                      onTouchTap  ={this.props.toggleNav}
                      className   ={this.props.navIsOpen ? "site-overlay open" : "site-overlay"} />
            </div>
        );
    }

    componentDidMount() {
        console.log("+++++ManagerMain");
    }

    componentWillReceiveProps(nextProps){

    }

    // =============== Methods =====================

    /**
    * This method sets the state.command to be "select",
    * just for an instant. This is then sent down the tree to
    * Artwork.jsx, where it can mutate the state of artwork.
     */
    selectAllArt = () => {
        this.setState({command:"select"});
        setTimeout( ()=>{
            this.setState({command:""});
        }, 50);
        this.props.fillBuffer();
    }
    deselectAllArt = () => {
        this.setState({command:"deselect"});
        setTimeout( ()=>{
            this.setState({command:""});
        }, 50);
        this.props.emptyBuffer();
    }
}
