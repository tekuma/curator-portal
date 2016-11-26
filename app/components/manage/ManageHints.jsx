// Libs
import React from 'react';

// Files

/**
 * a
 */
export default class ManageHints extends React.Component {
    state = {
        editing: false
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----ManageHints");
    }

    render() {
        if(this.state.editing) {
            return this.renderEdit();
        }

        return this.renderName();
    }

    renderEdit = () => {
        return(
            <div
                className="search-hints">
                <div className="project-name-writing">
                    <input type="text"
                        className="edit-project-name"
                        ref={
                            (e) => e ? e.selectionStart = 5 : null
                        }
                        autoFocus={true}
                        defaultValue={"Bobby"}
                        onBlur={this.finishEdit}
                        onKeyPress={this.checkEnter}
                        placeholder="Enter Project Name..." />
                </div>
            </div>
        );
    }

    renderName = () => {
        return(
            <div
                className="search-hints">
                <div className="project-name-writing">
                    <h3 className="project-name">
                        Bobby
                    </h3>
                </div>
            </div>
        );
    }

    componentDidMount() {
        console.log("++++++ManageHints");

    }

// ============= Methods ===============

edit = (e) => {
        // Avoid bubbling to click that opens up album view
        e.stopPropagation();

        // Enter edit mode.
        this.setState({
            editing: true
        });
    };

checkEnter = (e) => {
    // The user hit *enter*, let's finish up.
    if(e.key === 'Enter') {
        this.finishEdit(e);
    }
};

finishEdit = (e) => {
    const value = e.target.value;

    if (this.props.onEdit) {
        // Exit edit mode.
        this.setState({
            editing: false
        });

        this.props.onEdit(value);
    }
}

}//END App
