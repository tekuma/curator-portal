/*
 *  Root of Artist.tekuma.io: Web framework build on
 *  Firebase+ReactJS, written in JS ES6 compiled with babelJS,
 *  Bundled with webpack and NPM.
 *  written for Tekuma Inc, summer 2016 by:
 *  Stephen White and Afika Nyati
 */

// Libs
import React                from 'react';
import firebase             from 'firebase';
import Snackbar             from 'material-ui/Snackbar';
import getMuiTheme          from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider     from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from "react-tap-event-plugin";

injectTapEventPlugin({
  shouldRejectClick: function (lastTouchEventTimestamp, clickEventTimestamp) {
    return true;
  }
}); // Initializing to enable Touch Tap events. It is global


// Initialize Firebase
var config = {
  apiKey           : "AIzaSyDPLbeNTIctAEKu14VFeQuun8wz6ZbdTWU",
  authDomain       : "curator-tekuma.firebaseapp.com",
  databaseURL      : "https://curator-tekuma.firebaseio.com",
  storageBucket    : "curator-tekuma.appspot.com",
  messagingSenderId: "319359735831"
};
firebase.initializeApp(config);

// Files
import PreAuth  from './components/auth/PreAuth';
import PostAuth from './components/auth/PostAuth';


/**
 * a
 */
export default class App extends React.Component {
    state = {
        loggedIn: false
    };

    paths = {
        projects : `projects/`,
        paths    : `users/`
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----App");
    }

    render() {
        console.log(this.state.loggedIn);
        if (this.state.loggedIn) {
            return(
                <PostAuth />
            );
        } else {
            return(
                <PreAuth
                    authenticateWithPassword={this.authenticateWithPassword} />
            );
        }
    }

    componentDidMount() {
        console.log("++++++App");
        window.addEventListener("resize", this.rerender);

        //LISTENER: listen for auth state changes
        firebase.auth().onAuthStateChanged( (currentUser)=>{
            if (currentUser) {
                this.setState({loggedIn: true});
            } else {
                this.setState({loggedIn: false});
            }
        });

    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.rerender);
    }

// ============= Methods ===============

    /**
     * Sign a user in via email/password
     * @param  {Object} data - object containing login info
     */
    authenticateWithPassword = (data) => {
        firebase.auth().signInWithEmailAndPassword(data.email, data.password)
        .then( (thisUser) => {
            console.log(">Password Auth successful for:", thisUser.displayName);
            this.checkReturningUser(thisUser);
        }).catch( (error) => {
            console.error(error);
            this.setState({
                errors: this.state.errors.concat(error.message)
            });
        });
    }

    /**
     * [checkReturningUser description]
     * @param  {[type]} user [description]
     * @return {[type]}      [description]
     */
    checkReturningUser = (user) => {
        let uid = firebase.auth().currentUser.uid;
        let allUIDs = firebase.database().ref(this.paths.users).once('value', (snapshot)=>{
            if (!snapshot.hasChild(uid)) {
                this.createNewUser(user);
            }
        })
    }

    /**
     * TODO
     * @param  {[type]} user [description]
     * @return {[type]}      [description]
     */
    createNewUser = (user) => {
        // Create an initial projec
        let projectID =  this.createNewProject();
        console.log(">>>> ID", projectID);
        let projects = [projectID];
        let child = {
            email       : user.email,
            display_name: user.displayName,
            uid         : user.uid,
            projects    : projects
        };
        let uid = user.uid;
        const userPath = `users/${uid}`;
        firebase.database().ref(userPath).set(child);
    }

    /**
     * Create a new project in the database
     * @return {String} [the project ID]
     */
    createNewProject = () => {
        let projectsRef = firebase.database().ref(this.paths.projects);
        let projectRef  = projectsRef.push();
        let projectID   =  projectRef.key;
        let project = {
            id     : projectID,
            name   : "New Project",
            curator: firebase.auth().currentUser.uid,
            created: new Date().toISOString()
        };


        projectRef.set(project, ()=>{
            console.log(`>>Project: ${projectID} created.`);
        });
        return projectID;
    }

    rerender = () => {
        this.setState({});
    }



}//END App
