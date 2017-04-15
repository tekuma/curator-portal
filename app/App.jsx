/*
 *  Root of curator.tekuma.io: Web framework build on
 *  Firebase+ReactJS, written in JS ES6 compiled with babelJS,
 *  Bundled with webpack and NPM.
 *  written for Tekuma Inc, by
 *  Stephen White, Afika Nyati, and Scott Livingston.
 */

// Libs
import React                from 'react';
import firebase             from 'firebase';
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
  storageBucket    : "curator-uploads",
  messagingSenderId: "319359735831"
};
firebase.initializeApp(config);

// Files
import PreAuth  from './components/auth/PreAuth';
import PostAuth from './components/auth/PostAuth';


/**
 * Root of App.
 * NOTE: default signifies that this is the only class exported from this file.
 */
export default class App extends React.Component {
    state = {
        loggedIn: false,
        errors: []
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----App");
    }

    render() {
        if (this.state.loggedIn) {
            return(
                <PostAuth
                    createNewProject={this.createNewProject}/>
            );
        } else {
            return(
                <PreAuth
                    authenticateWithPassword={this.authenticateWithPassword}
                    errors={this.state.errors} />
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
            this.checkReturningUser(thisUser); // *
        }).catch((error) => {
            console.log(error);
            this.setState({
                errors: [error.message]
            });
        });
    }

    /**
     * This method checks if a user's data structure has been initiated in the
     * Firebase Database. If not, it is created; else, does nothing.
     * @param  {Object} user firebase user object
     * @return {Boolean}      if a returning user
     */
    checkReturningUser = (user) => {
        const uid = firebase.auth().currentUser.uid;
        const path = `users`;
        let allUIDs = firebase.database().ref(path).once('value', (snapshot)=>{
            if (!snapshot.hasChild(uid)) {
                this.createNewUser(user);
                return false;
            } else {
                this.logLogin(user.uid);
                return true;
            }

        })
    }

    logLogin = (uid)=>{
        let path = `users/${uid}/last_login`;
        firebase.database().ref(path).set(new Date().toISOString());
    }

    /**
     * Initializes the user in the Firebase Database datastructure
     * @param  {[type]} user [description]
     */
    createNewUser = (user) => {
        let child = {
            first_login : new Date().toISOString(),
            email       : user.email,
            uid         : user.uid,
            public      : {
                display_name: "Unset",
                social_media   : {
                    facebook    : "",
                    twitter     : "",
                    instagram   : "",
                    pinterest   : "",
                    behance     : ""
                },
                bio             : "",
                location        : "",
                portfolio       : "",
                display_name    : "Untitled Curator",
                avatar          : ""

            },
            private     : {
                legal_name: ""
            }
        };
        const userPath = `users/${user.uid}`;
        firebase.database().ref(userPath).set(child);
    }

    /**
     * Create a new project in the database
     * @return {String} [the project ID]
     */
    createNewProject = () => {
        let projectsRef = firebase.database().ref('projects');
        let projectRef  = projectsRef.push();
        let projectID   =  projectRef.key;
        let project = {
            id     : projectID,
            name   : "Untitled Project",
            curator: firebase.auth().currentUser.uid,
            created: new Date().toISOString()
        };


        projectRef.set(project, ()=>{
            console.log(`>>Project: ${projectID} created.`);
        });
        return projectID;
    }

    /**
     * Helper method to force a re-rending of this component
     */
    rerender = () => {
        this.setState({});
    }



}//END App
