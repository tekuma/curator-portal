// Libs
import React from 'react';
import uuid from 'node-uuid';
import { WithContext as ReactTags } from 'react-tag-input';

/**
 * TODO
 */
export default class EditArtworkForm extends React.Component {
    state = {
        tags: [],
        suggestions: []
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----EditArtworkForm");
    }

    render() {
        let oldArtwork  = this.props.value;
        let tags        = [];
        for (var i = 0; i < this.props.value.tags.length; i++) {
            let tag = this.props.value.tags[i];
            tags.push({id:i, text:tag});
        }

        let colors = [];
        for (let colr of this.props.value.colors) {
            colors.push({background:colr});
        }

        let image = this.props.value.thumbnail_url;

        let previewImage = {
            backgroundImage: 'url(' + image + ')'
        }

        return (


        );
    }

    componentDidMount() {
        console.log("+++++EditArtworkForm");

        // Get Tags
        if (this.props.value.tags) {
            let allTags  = this.props.value.tags;
            let tagKeys  = Object.keys(allTags);
            let tags = [];

            for (let i = 0; i < tagKeys.length; i++) {
                tags.push(allTags[i]);
            }

            //Set tags to state
            this.setState({
                tags : tags
            });
        }

        // Get suggestions
        let suggestions = [];
        // let artworks = this.props.user.artworks;
        //
        // for (let artwork in artworks) {
        //     let artworkTags = artworks[artwork]["tags"];
        //
        //     if (artworkTags) {
        //         for (let i = 0; i < Object.keys(artworkTags).length; i++) {
        //             let text = artworkTags[i].text;
        //             if (suggestions.indexOf(text) == -1) {
        //                 suggestions.push(text);
        //             }
        //         }
        //     }
        // }

        this.setState({
            suggestions : suggestions
        });
    }

    componentWillReceiveProps(nextProps) {
        //pass
    }

// ============= Methods ===============

handleTags = (data) => {
    //pass
}


}

EditArtworkForm.propTypes = {
    value: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired
};
