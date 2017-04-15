// Libs
import React            from 'react';
import firebase         from 'firebase';

// Files
import confirm          from '../confirm_dialog/ConfirmFunction';
import PublicEdit       from './PublicEdit.jsx';
import PrivateEdit      from './PrivateEdit.jsx';

/**
 * TODO
 */
export default class EditProfile extends React.Component {
    state = {
        editingPublic: true,
        saved: true
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----EditProfile");
    }

    render() {
        if (this.state.editingPublic) {
            return this.goToPublicEdit();
        } else {
            return this.goToPrivateEdit();
        }
    }

    componentDidMount() {
        console.log("++++++EditProfile");
    }

    componentWillReceiveProps(nextProps) {
        //pass
    }

    // ============== METHODS ======================

    /**
     * Flow control method to go to public profile editing page
     * @return {JSX}
     */
    goToPrivateEdit = () => {
        if (!this.props.user.private) {
            this.props.user.private = {};
        }
        return (
            <PrivateEdit
                user = {this.props.user}
                editPrivateUserInfo     ={this.editPrivateUserInfo}
                editingPublic           ={this.state.editingPublic}
                editPublic              ={this.editPublic}
                editPrivate             ={this.editPrivate}
                setSaved                ={this.setSaved}
                setUnsaved              ={this.setUnsaved} />
        );
    }

    /**
     * Flow control method to render public profile editing page
     * @return {JSX} [description]
     */
    goToPublicEdit = () => {
        if (!this.props.user.public) {
            this.props.user.public = {}
        }
        return (
            <PublicEdit
                user = {this.props.user}
                editPublicUserInfo={this.editPublicUserInfo}
                editingPublic       ={this.state.editingPublic}
                editPublic          ={this.editPublic}
                editPrivate         ={this.editPrivate}
                setSaved            ={this.setSaved}
                setUnsaved          ={this.setUnsaved}
                 />
        );
    }

    // ============ Methods ============

    /**
     * Handles syncing the collected data with the firebase DB.
     * @param  {Object} data [has possible fields:bio,location,display_name,portfolio,social_media]
     */
    editPublicUserInfo = (data) => {
        let uid = firebase.auth().currentUser.uid;
        let path = `users/${uid}/public`;


        if (data.hasOwnProperty('avatar')) { // image + text update
            let filePath = `portal/${uid}/avatars/${data.avatar.name}`;
            let avatarRef = firebase.storage().ref(filePath);
            avatarRef.put(data.avatar).on( firebase.storage.TaskEvent.STATE_CHANGED,
                (snapshot)=>{}, //on change
                (err)=>{console.log(err);},// err
                ()=>{  // on complete
                    console.log(">> New Avatar Uploaded successfully");
                    avatarRef.getDownloadURL().then( (avatarURL)=>{
                        data.avatar = avatarURL;
                        firebase.database().ref(path).update(data)
                        .then( ()=>{
                            let message = "Your profile information has been updated";
                            this.props.sendToSnackbar(message);
                            console.log(message);
                        });
                    });
                });
        } else {
            firebase.database().ref(path).update(data)
            .then( ()=>{
                let message = "Your profile information has been updated";
                this.props.sendToSnackbar(message);
                console.log(message);
            });
        }
    }

    /**
     * [editPrivateUserInfo description]
     * @param  {JSON} data [possible fields: legal_name, email, email_password, password,
     *  current_password, paypal, dob, gender_pronoun]
     */
    editPrivateUserInfo = (data) => {
        let uid  = firebase.auth().currentUser.uid;
        const path = `users/${uid}/private`;
        const thisUser = firebase.auth().currentUser;

        if (data.password && data.current_password) {
            let thisCredential = firebase.auth.EmailAuthProvider.credential(thisUser.email, data.current_password);
            thisUser.reauthenticate(thisCredential).then( ()=>{
                thisUser.updatePassword(data.password).then(() => {
                    let message = "Your password has been successfully updated";
                    this.props.sendToSnackbar(message);
                    console.log(message);
                }).catch((error) => {
                    this.props.sendToSnackbar(error);
                });
            });
        }
        if (data.dob || data.legal_name || data.paypal || data.gender_pronoun) {
            //node is the JSON of the specified node in the DB tree
            firebase.database().ref(path).transaction((node)=>{
                if (data.dob){
                    node.dob = data.dob;
                }
                if (data.legal_name){
                    node.legal_name = data.legal_name;
                }
                if (data.paypal) {
                    node.paypal = data.paypal;
                }
                if (data.gender_pronoun){
                    node.gender_pronoun = data.gender_pronoun;
                }
                return node;
            }).then(()=>{
                let message = "Your profile information has been updated";
                this.props.sendToSnackbar(message);
                console.log(message);
            });
        }
    }

    setSaved = () => {
        this.setState({
            saved: true
        });
    }

    setUnsaved = () => {
        this.setState({
            saved: false
        });
    }

    /**
     * Mutator Method to change layout in state
     * @param  {[type]} layout [TODO]
     */
    editPublic = () => {
        if (!this.state.saved) {
            confirm('Are you sure you want to change tabs without saving?').then( () => {
                    this.setState({
                        editingPublic: true,
                        saved: true
                    });
                }, () => {
                    // they clicked 'no'
                    return;
                }
            );
        } else {
            this.setState({
                editingPublic: true,
                saved: this.state.saved
            });
        }
    }

    /**
     * Mutator Method to change layout in state
     * @param  {[type]} layout [TODO]
     */
    editPrivate = () => {
        if (!this.state.saved) {
            confirm('Are you sure you want to change tabs without saving?').then( () => {
                    this.setState({
                        editingPublic: false,
                        saved: true
                    });
                }, () => {
                    // they clicked 'no'
                    return;
                }
            );
        } else {
            this.setState({
                editingPublic: false,
                saved: this.state.saved
            });
        }
    }

}
