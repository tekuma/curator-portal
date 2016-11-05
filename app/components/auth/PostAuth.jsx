// Libs
import React                from 'react';
import Snackbar             from 'material-ui/Snackbar';
import getMuiTheme          from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider     from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from "react-tap-event-plugin";
// Files
import CurationHeader from '../headers/CurationHeader';
import ArtworkManager from '../artwork_manager/ArtworkManager';
import Artwork        from '../artwork_manager/Artwork';
import SearchManager  from '../search_manager/SearchManager';
import SearchMain     from '../search_manager/SearchMain';
import HamburgerIcon  from '../headers/HamburgerIcon';
import HiddenNav      from '../nav/HiddenNav';


/**
 * Component Rendered following successful log in.
 */
export default class PostAuth extends React.Component {
    state = {
        managerIsOpen: true,
        navIsOpen    : false,
        user         : {},

    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----PostAuth");
    }

    render() {
        return(
            <div>
                <HiddenNav
                    navIsOpen={this.state.navIsOpen}
                    changeAppLayout={this.changeAppLayout} />
                <HamburgerIcon
                    toggleNav={this.toggleNav}
                    navIsOpen={this.state.navIsOpen} />
                <SearchMain
                    navIsOpen={this.state.navIsOpen}
                    managerIsOpen={this.state.managerIsOpen}
                    toggleManager={this.toggleManager}  />
            </div>
        );
    }

    componentDidMount() {
        console.log("++++++PostAuth");
        window.addEventListener("resize", this.rerender);

    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.rerender);
    }

// ============= Methods ===============

    /**
     * Helper method to force a re-rendering of this component
     */
    rerender = () => {
        this.setState({});
    }

    /**
     * This method is used by the Hamburger Icon component to
     * toggle the boolean value of this.state.navIsOpen
     * to change the state of the Hidden Navigation component
     * from open to closed.
     */
    toggleNav = () => {
        this.setState({
            navIsOpen: !this.state.navIsOpen,
            managerIsOpen: true
        });
    };

    /**
     * This method is used by the HiddenNav component and PostAuthHeader component
     * to switch the the layout currently being displayed in the Root App Layout component
     * by changing this.state.currentAppLayout.
     * The value can be: Views.UPLOAD, Views.ARTWORKS, and Views.PROFILE
     * @param  {[A field of the Views object]} view [View to be displayed]
     */
    changeAppLayout = (view) => {
        if(this.state.navIsOpen) {
            this.setState({
                navIsOpen: false,
                managerIsOpen: true
            });
        } else {
            this.setState({
                managerIsOpen: true
            });
        }
    }


    /**
     * This method is used by the Search Manager Toggler element
     * to toggle the boolean value of this.state.managerIsOpen
     * to change the state of the the Album Manager component
     * from open to closed.
     */
    toggleManager = () => {
        this.setState({
            managerIsOpen: !this.state.managerIsOpen
        });
    };

}
