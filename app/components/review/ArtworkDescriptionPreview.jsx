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
                        titleClassName              ="review-description-title"
                        actionsContainerClassName   ="review-description-actions"
                        bodyClassName               ="review-description-body"
                        contentClassName            ="review-description-content" >
                        <div className="review-description-dialog">
                            <div className="review-descrition-wrapper">
                                <p
                                    className="review-description">
                                    {this.props.reviewInfo.description}
                                </p>
                            </div>
                        </div>
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
