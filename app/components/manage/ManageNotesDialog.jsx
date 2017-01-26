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
export default class ManageNotesDialog extends React.Component {
    state = {
        public_notes: [
            {curator: "Paul Higgins", note: "Hello, my name is Paul."},
            {curator: "Seamus Maloo", note: "I really like this one."},
            {curator: "Bob Tomman", note: "It's got an aura to it."},
            {curator: "Heidi Bloom", note: "Fabulous!"}
        ],
        my_notes: {
            public: "This project is very interesting. It has many artworks, and is cohesive.",
            personal: "I lowkey don't think this project is cohesive, but that's just me."
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
                onClick   ={this.props.updateNotes} />,

            <ConfirmButton
                label     ={"Cancel"}
                className ="edit-artwork-no"
                onClick   ={this.props.toggleManageNotes} />
        ];

        let myNotes = this.state.my_notes;

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
                                    {this.state.public_notes.map(note => {
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
                                        htmlFor="public-note">
                                        Public Note
                                    </label>
                                    <textarea
                                        id          ="public-note"
                                        placeholder ="Write a short note about this project that will be viewable by all collaborators..."
                                        value       ={this.state.my_notes.public}
                                        maxLength   ="1500"
                                        onChange    ={(e) => {
                                            this.updateManageNotes(Object.assign({}, myNotes, {public: e.target.value}))
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

    }

    updateManageNotes = (my_notes) => {
        this.setState({
            my_notes : my_notes
        });
    }
}
