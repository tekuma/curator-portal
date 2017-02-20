// Libs
import React          from 'react';
import firebase       from 'firebase';
import uuid           from 'node-uuid';
// Files
import DisplayNameTag from './DisplayNameTag';
import LogoutButton   from './LogoutButton';
import NavItems       from './NavItems';
import Roles          from '../../constants/Roles';


export default class HiddenNav extends React.Component {
    navItems = [
        {
            id   : uuid.v4(),
            item : 'Manage',
            icon : 'assets/images/icons/manage.svg',
            href : Roles.MANAGE,
            title: 'Manage Projects'
        },
        {
            id   : uuid.v4(),
            item : 'Search',
            icon : 'assets/images/icons/search.svg',
            href : Roles.SEARCH,
            title: 'Search the Tekuma art DB'
        },
        {
            id   : uuid.v4(),
            item : 'Review',
            icon : 'assets/images/icons/review.svg',
            href : Roles.REVIEW,
            title: 'Review Artist Submissions'
        },
        {
            id   : uuid.v4(),
            item : 'Profile',
            icon : 'assets/images/icons/profile.svg',
            href : Roles.PROFILE,
            title: 'Edit Personal Information'
        }
    ];

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----HiddenNav");
    }

    render() {
        const navItems = this.navItems;
        let avatar ='assets/images/default-avatar.png';

        if (this.props.user && this.props.user.public &&this.props.user.public.avatar) {
            avatar = this.props.user.public.avatar;
        }

        let avatarStyle = {
            backgroundImage: 'url(' + avatar + ')'
        }
        let displayName = "Curator Name";
        if (this.props.user.public) {
            displayName = this.props.user.public.display_name;
        }

        // if (this.props.user.info && this.props.user.info.display_name) {
        //     displayName = this.props.user.info.display_name; // This is here because of the initial split second an account isn't created
        // }


        return (
            <nav className="navigation">
                <div
                    className="avatar"
                    style={avatarStyle}>
	    		</div>
                <DisplayNameTag
                    displayName={displayName}
                    navIsOpen={this.props.navIsOpen} />
                <NavItems
                    navItems={this.navItems}
                    changeAppLayout={this.props.changeAppLayout} />
                <LogoutButton
                    signOutUser={this.signOutUser} />
            </nav>
        );
    }

    componentDidMount() {
        console.log("+++++HiddenNav");
    }

    componentWillReceiveProps(nextProps) {
        //pass
    }

    // ========== Methods ===========

    /**
     * Signs the user out from firebase auth().
     * Listener in Render() will detect change.
     */
    signOutUser = () => {
        //FIXME stop listening for user data for curator
        // const  userPath = `public/onboarders/${this.props.thisUID}`;
        // const userPrivatePath = `_private/onboarders/${this.props.thisUID}`;
        // firebase.database().ref(userPath).off();
        // firebase.database().ref(userPrivatePath).off();

        firebase.auth().signOut().then( () => {
          console.log("User signed out");
          this.setState({
              loggedIn  : false,
              loaded    : false
          });
        }, (error) => {
          console.error(error);
          this.setState({
              errors: this.state.errors.concat(error.message)
          });
        });
    }



}

// ============= PropTypes ==============

HiddenNav.propTypes = {
    // user: React.PropTypes.object.isRequired,
    navIsOpen: React.PropTypes.bool.isRequired,
    changeAppLayout: React.PropTypes.func.isRequired
};
