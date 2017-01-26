// Dependencies
import React    from 'react';
import firebase from 'firebase';
// Components
import ProjectArtworkManager from '../artwork_manager/ProjectArtworkManager';
import ProjectManager from './ProjectManager';
import CurationHeader from '../headers/CurationHeader';
import confirm    from '../confirm_dialog/ConfirmFunction';
import ArtworkDetailBoxDialog   from '../artwork_manager/ArtworkDetailBoxDialog';


export default class ManagerMain extends React.Component {
    state = {
        command        : "", // for sending actions down to Artworks
        detailBoxIsOpen: false, // whether popup is open or not
        artworkInfo   : {  // TODO: remove placeholder info
            description  : "Much art. Very nice.",
            title        : "Starry Night",
            artist       : "Vincent Van Gogh",
            album        : "Impressionism",
            year         : 1888,
            tags         : ["#art", "impressionistic", "#impasto", "#europe", "#stars", "#tree", "#night"],
            colors       : ["#00ff00", "#ff00ff","#333300","#88a7ae","#dead19"],
            thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg"
        }
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
                      changeAppLayout={this.props.changeAppLayout}
                      projects={this.props.projects}
                      addNewProject={this.props.addNewProject}
                      detailArtwork={this.detailArtwork}
                      toggleDetailBox={this.toggleDetailBox}
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
                      projects={this.props.projects}
                      addNewProject={this.props.addNewProject}
                      onDelete={this.deleteProject}
                   />
                   <ArtworkDetailBoxDialog
                       toggleDetailBox={this.toggleDetailBox}
                       detailBoxIsOpen={this.state.detailBoxIsOpen}
                       artworkInfo={this.state.artworkInfo}
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

    deleteProject = (e) => {
        e.stopPropagation();

        confirm('Are you sure you want to delete this project?').then(
            () => {
                // Proceed Callback
                this.props.deleteCurrentProject();
            },
            () => {
                // Cancel Callback
                return;
            }
        );
    }

    detailArtwork = (uid) => {
        firebase.auth().currentUser.getToken(true).then( (idToken)=>{
            payload.auth = idToken;
            $.ajax({
                url: 'detail',
                data: payload,
                dataType: 'json',
                cache: false,
                success: this.updateInfoArtwork
            });
        });
    }

    toggleDetailBox = () => {
        this.setState({
            detailBoxIsOpen: !this.state.detailBoxIsOpen
        })
    }
}
