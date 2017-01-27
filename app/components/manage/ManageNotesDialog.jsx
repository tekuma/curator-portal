// Libs
import React                from 'react';
import firebase             from 'firebase';
import uuid                 from 'node-uuid';
import Dialog               from 'material-ui/Dialog';
import getMuiTheme          from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider     from 'material-ui/styles/MuiThemeProvider';

// Files
import ConfirmButton        from '../confirm_dialog/ConfirmButton';

/**
 * TODO
 */
export default class ManageNotesDialog extends React.Component {
    state = {
        my_notes: {
            collab  : "",
            personal: ""
        }
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ManageNotesDialog");
    }

    render() {
        const actions = [
            <ConfirmButton
                label     ={"Update"}
                className ="edit-artwork-yes"
                onClick   ={this.props.addNote.bind({},this.state.my_notes)} />,

            <ConfirmButton
                label     ={"Cancel"}
                className ="edit-artwork-no"
                onClick   ={this.props.toggleManageNotes} />
        ];

        let myNotes = [];
        if (true) {
            myNotes = this.state.my_notes;
        }
        let public_notes = [];
        if (this.props.projectDetails.notes) {
            for (var uid in this.props.projectDetails.notes) {
                if (this.props.projectDetails.notes.hasOwnProperty(uid)) {
                    console.log(this.props.projectDetails.notes);
                    public_notes.push(this.props.projectDetails.notes[uid].public);
                }
            }
        }


        console.log(public_notes);

        return (
            <div>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <Dialog
                        title                       ="Manage Notes"
                        actions                     ={actions}
                        modal                       ={false}
                        open                        ={this.props.manageNotesIsOpen}
                        titleClassName              ="manage-notes-title"
                        actionsContainerClassName   ="manage-notes-actions"
                        bodyClassName               ="manage-notes-body"
                        contentClassName            ="manage-notes-content" >
                        <div className="manage-notes-dialog">
                            <div className="manage-notes-group-notes-wrapper">
                                <div className="manage-notes-group-notes">
                                    {public_notes.map(note => {
                                        return (
                                            <div
                                                key={uuid.v4()}
                                                className="group-note">
                                                    &#8220;{note.note}&#8221;
                                                    <div className="artwork-reviewer">{note.curator}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="manage-notes-textarea-wrapper">
                                <div className="manage-notes-textarea">
                                    <label
                                        htmlFor="collab-note">
                                        Collaboration Note
                                    </label>
                                    <textarea
                                        id          ="collab-note"
                                        placeholder ="Write a short note about this project that will be viewable by all collaborators..."
                                        value       ={this.state.my_notes.collab}
                                        maxLength   ="1500"
                                        onChange    ={(e) => {
                                            this.updateManageNotes(Object.assign({}, myNotes, {collab: e.target.value}))
                                        }} />
                                </div>
                                <div className="manage-notes-textarea">
                                    <label
                                        htmlFor="personal-note">
                                        Personal Note
                                    </label>
                                    <textarea
                                        id          ="personal-note"
                                        placeholder ="Write a short note about this project that you will get to view..."
                                        value       ={this.state.my_notes.personal}
                                        maxLength   ="1500"
                                        onChange    ={(e) => {
                                            this.updateManageNotes(Object.assign({}, myNotes, {personal: e.target.value}))
                                        }} />
                                </div>
                            </div>
                        </div>
                    </Dialog>
                </MuiThemeProvider>
            </div>
        );
    }

    componentDidMount() {
        console.log("+++++ManageNotesDialog");
    }

    componentWillReceiveProps(nextProps) {
        let uid = firebase.auth().currentUser.uid;

        if (nextProps.projectDetails.notes) {
            let private_note = nextProps.projectDetails.notes[uid].private;

            let update = this.state.my_notes;
            update.personal = private_note;
            this.setState({
                my_notes: update
            })
        }
    }

    updateManageNotes = (my_notes) => {
        this.setState({
            my_notes : my_notes
        });
    }
}
