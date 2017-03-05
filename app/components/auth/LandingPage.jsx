// Libs
import React            from 'react';
import uuid             from 'node-uuid';
import Snackbar         from 'material-ui/Snackbar';
import getMuiTheme      from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

/**
 * TODO
 */
export default class LandingPage extends React.Component {
    state = {
        errors          : [],    // Used to store Auth errors from Firebase and Registration errors
        errorType       : {},                   // Used to keep track of the type of error encountered to highlight relevant input field
        currentError    : ""                    // Used to store the current error to be displayed in the snackbar
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log('-----LandingPage');
    }

    render() {
        let errorStyle = {
            border: '2px solid #ec167c'
        };

        return (
            <div>
                <div className="main-wrapper login">
                    <div className="login-layout">
                        <article className="signup-wrapper">
                            <div className="artist-logo-wrapper">
                              <svg version="1.0" id="Group_copy_8_xA0_Image_1_" x="0px" y="0px" viewBox="0 0 1000 1000" style={{"enableBackground":"new 0 0 1000 1000"}}>
                              <g className="drawing">
                                <g>
                                  <line id="top-3" className="st0" x1="10" y1="10" x2="990" y2="10"/>
                                  <line id="right-3" className="st0" x1="990" y1="10" x2="990" y2="990"/>
                                  <line id="bottom-3" className="st0" x1="990" y1="990" x2="10" y2="990"/>
                                  <line id="left-3" className="st0" x1="10" y1="990" x2="10" y2="10"/>

                                  <g className="inner-3">
                                    <line className="st0" x1="500" y1="500" x2="990" y2="10"/>
                                    <line className="st0" x1="500" y1="500" x2="10" y2="10"/>
                                    <line className="st0" x1="500" y1="500" x2="10" y2="990"/>
                                    <line className="st0" x1="500" y1="500" x2="990" y2="990"/>
                                  </g>
                                    <rect className="smallbox3" x="323" y="323" width="354" height="354"/>
                                </g>
                              </g>
                              </svg>

                            </div>
                            <form className="signup-form page-1">
                                <h2 className="separator"><span>   Curator    </span></h2>
                                <div className="top-form">
                                    <ul>
                                        <li id="email-landing">
                                            <input
                                                type        ="email"
                                                id          ="login-email"
                                                style       ={this.state.errorType.email ? errorStyle : null}
                                                ref         ="email"
                                                placeholder ="Email"
                                                required    ="true"
                                                maxLength   ="100" />
                                        </li>

                                        <li>
                                            <input
                                                type         ="password"
                                                id           ="login-password"
                                                ref          ="password"
                                                style        ={this.state.errorType.password ? errorStyle : null}
                                                placeholder  ="Password"
                                                required     ="true"
                                                maxLength    ="100"
                                                autoComplete ="off" />
                                        </li>
                                    </ul>
                                </div>
                                <div className="bottom-form">
                                    <button
                                        className="login-button"
                                        type="submit"
                                        onClick={this.onLogin}>
                                        <h3>Login</h3>
                                    </button>
                                </div>
                            </form>
                        </article>
                    </div>
                </div>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <Snackbar
                        className="snackbar-error"
                        open={this.state.errors.length > 0}
                        message={this.state.currentError}
                        autoHideDuration={4000} />
                </MuiThemeProvider>
            </div>
        );
    }

    componentDidMount() {
        console.log('+++++LandingPage');
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: this.state.errors.concat(nextProps.errors),
                currentError: nextProps.errors[0]
            });
        }
    }

// ============= Methods ===============

    /**
     * Used to log in a user
     * @param  {HTML element} e [The element that has been pressed]
     */
    onLogin = (e) => {
        e.preventDefault();
        // Clear errors from any previous form submission
        this.state.errors = [];
        this.state.errorType = {};
        this.state.currentError = "";

        let data = {};
        let email = this.refs.email.value;
        let password = this.refs.password.value;

        if(email.length == 0) {
            this.state.errors.push("Please enter an email address.");
            let errorType = this.state.errorType;
            errorType.email = true;
            this.setState({
                errorType: errorType
            });
        } else if(!/.+@.+\..+/.test(email)) {
            this.state.errors.push("The email address you supplied is invalid.");
            let errorType = this.state.errorType;
            errorType.email = true;
            this.setState({
                errorType: errorType
            });
        }

        if(password.length == 0) {
            this.state.errors.push("Please enter your password.");
            let errorType = this.state.errorType;
            errorType.password = true;
            this.setState({
                errorType: errorType
            });
        }

        if(this.state.errors.length == 0) {
            data.email = email;
            data.password = password;
            this.props.authenticateWithPassword(data);
        }

        for(let i = 0; i < this.state.errors.length; i++) {
            setTimeout(() => {
                this.setState({
                    currentError: this.state.errors[i]
                });
            }, 3000 * i);

            setTimeout(() => {
                this.setState({
                    currentError: "",
                    errors: []
                });
            }, 3000 * i + 4000);
        }
    }
}
