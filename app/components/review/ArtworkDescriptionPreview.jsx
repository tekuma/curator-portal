// Libs
import React                from 'react';
import uuid                 from 'node-uuid';
import Dialog               from 'material-ui/Dialog';
import getMuiTheme          from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider     from 'material-ui/styles/MuiThemeProvider';

// Files
import ConfirmButton        from '../confirm_dialog/ConfirmButton';

/**
 * TODO
 */
export default class ArtworkDescriptionPreview extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ArtworkDescriptionPreview");
    }

    render() {
        const actions = [
              <ConfirmButton
                label={"Close"}
                className="upload-dialog-button"
                onClick={this.props.toggleDescriptionPreview}
              />
        ];

        return (
            <div>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <Dialog
                        actions                     ={actions}
                        modal                       ={false}
                        open                        ={this.props.artworkDescriptionIsOpen}
                        actionsContainerClassName   ="confirm-actions"
                        bodyClassName               ="confirm-body" >
                        {this.props.reviewInfo.description}
                    </Dialog>
                </MuiThemeProvider>
            </div>
        );
    }

    componentDidMount() {
        console.log("+++++ArtworkDescriptionPreview");
    }

    componentWillReceiveProps(nextProps) {

    }
}
