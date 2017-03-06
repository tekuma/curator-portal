// Libs
import React                        from 'react';
import Dropzone                     from 'react-dropzone';
import {Tooltip, OverlayTrigger}    from 'react-bootstrap';
import Select                       from 'react-select';
import { WithContext as ReactTags } from 'react-tag-input';
import uuid from 'node-uuid';

// @Afika,  props has this.props.doQuery(queryString), which should be called on
// key event by the search bar

export default class SearchAccordion extends React.Component {
    state = {
      selectableColors: []
    }
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----SearchAccordion");
    }

    render() {
        let wrapperHeight = {
            height: window.innerHeight - 5*60 // - Header Height (60px) - Project Selector (60px) - Search Hints Height (60px) - Search Tools Height (60px) - Search Button Height (60px)
        }

        let options = this.props.artistNames.map(function(artist){
                return {label: artist, value: artist}
            });

        let selectableColors = [];

        for (let i = 0; i < this.state.selectableColors.length; i++) {
            selectableColors.push({
                number: i * 10,
                hex: this.state.selectableColors[i]
            });
        }

        return(
            <div
                style={wrapperHeight}
                className="search-accordion-wrapper">
                <article
                    className="search-accordion">
                    <div
                        className={this.props.accordion.general ? "accordion-item open" : "accordion-item"}
                        onClick={this.props.toggleAccordion.bind({},"general")}>
                        <h2 className="accordion-item-heading search">General</h2>
                    </div>
                    <div
                        id="search-general-content"
                        className={this.props.accordion.general ? "accordion-content open" : "accordion-content"}>
                        <input
                        type="text"
                        id="search-general"
                        onChange={this.getGeneralAndChange}
                        ref="general"
                        placeholder="Search by Artist, Title, etc..."
                        autoCapitalize="off"
                        autoComplete="off"
                        autoCorrect="off" />
                    </div>
                    <div
                        className={this.props.accordion.artist ? "accordion-item open" : "accordion-item"}
                        onClick={this.props.toggleAccordion.bind({},"artist")}>
                        <h2 className="accordion-item-heading search">Artist</h2>
                    </div>
                    <div
                        id="search-artist-content"
                        className={this.props.accordion.artist ? "accordion-content open" : "accordion-content"}>
                        <input
                        type="text"
                        id="search-artist"
                        onChange={this.getArtistAndChange}
                        ref="artist"
                        placeholder="Search by Artist Name..."
                        autoCapitalize="off"
                        autoComplete="off"
                        autoCorrect="off" />
                    </div>
                    <div
                        className={this.props.accordion.tag ? "accordion-item open" : "accordion-item"}
                        onClick={this.props.toggleAccordion.bind({},"tag")}>
                        <h2 className="accordion-item-heading search">Tag</h2>
                    </div>
                    <div
                        id="search-tag-content"
                        className={this.props.accordion.tag ? "accordion-content open" : "accordion-content"}>
                        <ReactTags
                            tags={this.props.tags}
                            suggestions={this.props.suggestions}
                            handleDelete={this.props.handleDelete}
                            handleAddition={this.props.handleAddition}
                            handleDrag={this.props.handleDrag} />
                    </div>
                    <div
                        className={this.props.accordion.title ? "accordion-item open" : "accordion-item"}
                        onClick={this.props.toggleAccordion.bind({},"title")}>
                        <h2 className="accordion-item-heading search">Title</h2>
                    </div>
                    <div
                        id="search-title-content"
                        className={this.props.accordion.title ? "accordion-content open" : "accordion-content"}>
                        <input
                        type="text"
                        id="search-title"
                        onChange={this.getTitleAndChange}
                        ref="title"
                        placeholder="Search by Artwork Title..."
                        autoCapitalize="off"
                        autoComplete="off"
                        autoCorrect="off" />
                    </div>
                    <div
                        className={this.props.accordion.time ? "accordion-item open" : "accordion-item"}
                        onClick={this.props.toggleAccordion.bind({},"time")}>
                        <h2 className="accordion-item-heading search">Time</h2>
                    </div>
                    <div
                        id="search-time-content"
                        className={this.props.accordion.time? "accordion-content open" : "accordion-content"}>
                        <div>
                            <label
                                    htmlFor="search-time-day"
                                    className="search-time-label">
                                    <input
                                        type="radio"
                                        id="search-time-day"
                                        name="time"
                                        className="search-time-radio"
                                        defaultValue="day"
                                        onChange={this.setTime} />
                                    Past 24 Hours
                              </label>
                              <label
                                  htmlFor="search-time-week"
                                  className="search-time-label">
                                  <input
                                      type="radio"
                                      id="search-time-week"
                                      name="time"
                                      className="search-time-radio"
                                      defaultValue="week"
                                      onChange={this.setTime} />
                                  Past Week
                            </label>
                            <label
                                htmlFor="search-time-range"
                                className="search-time-label"
                                style={{
                                    display: this.props.accordion.time ? "block" : "none"
                                }}>
                                    <input
                                        type="radio"
                                        id="search-time-range"
                                        name="time"
                                        className="search-time-radio"
                                        defaultValue="range"
                                        onChange={this.setTime} />
                                    <div id="from-range">
                                        <p>From</p>
                                        <input
                                        type="date"
                                        className="search-time-range-input"
                                        id="search-time-from"
                                        ref="fromDate"
                                        placeholder="mm/dd/yyyy" />
                                    </div>
                                    <div id="to-range">
                                        <p>To</p>
                                        <input
                                        type="date"
                                        className="search-time-range-input"
                                        id="search-time-to"
                                        ref="toDate"
                                        placeholder="mm/dd/yyyy" />
                                    </div>
                            </label>
                        </div>
                    </div>
                    <div
                        className={this.props.accordion.color ? "accordion-item open no-border-bottom" : "accordion-item no-border-bottom"}
                        onClick={this.props.toggleAccordion.bind({},"color")}>
                        <h2 className="accordion-item-heading search">Color</h2>
                    </div>
                    <div
                        id="search-color-content"
                        className={this.props.accordion.color ? "accordion-content open" : "accordion-content"}>
                        <div>
                            <div className="color-box-wrapper">
                                {selectableColors.map(color => {
                                    return (
                                        <div
                                            key     ={uuid.v4()}
                                            className="color-box"
                                            style={{
                                                backgroundColor: color.hex
                                            }}
                                            onClick={this.getColorAndChange.bind({}, color.number, color.hex)}>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="search-color-ranges">
                                <div className="search-color-range">
                                    <input
                                        type="radio"
                                        id="search-color-one"
                                        name="color"
                                        className="search-color-radio"
                                        defaultValue="one"
                                        defaultChecked="true" />
                                    <label
                                        htmlFor="search-color-one"
                                        className="color-box"
                                        style={{
                                            backgroundColor: this.props.searchColors.one.hex
                                        }}>
                                    </label>
                                    <input
                                        type="range"
                                        id="colorRange-one"
                                        ref="rangeOne"
                                        defaultValue="0"
                                        min="0"
                                        max="9"
                                        step="1"
                                        onChange={this.varyColor.bind({}, "one")} />
                                </div>
                                <div className="search-color-range">
                                    <input
                                        type="radio"
                                        id="search-color-two"
                                        name="color"
                                        className="search-color-radio"
                                        defaultValue="two" />
                                    <label
                                        htmlFor="search-color-two"
                                        className="color-box"
                                        style={{
                                            backgroundColor: this.props.searchColors.two.hex
                                        }}>
                                    </label>
                                    <input
                                        type="range"
                                        id="colorRange-two"
                                        ref="rangeTwo"
                                        defaultValue="0"
                                        min="0"
                                        max="9"
                                        step="1"
                                        onChange={this.varyColor.bind({}, "two")} />
                                </div>
                                <div className="search-color-range">
                                    <input
                                        type="radio"
                                        id="search-color-three"
                                        name="color"
                                        className="search-color-radio"
                                        defaultValue="three" />
                                    <label
                                        htmlFor="search-color-three"
                                        className="color-box"
                                        style={{
                                            backgroundColor: this.props.searchColors.three.hex
                                        }}>
                                    </label>
                                    <input
                                        type="range"
                                        id="colorRange-three"
                                        ref="rangeThree"
                                        defaultValue="0"
                                        min="0"
                                        max="9"
                                        step="1"
                                        onChange={this.varyColor.bind({}, "three")} />
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        );
    }

    /*  This is the selector from Artist in the accordion.
    <Select
        ref="searchArtist"
        inputProps={{id: 'search-artist'}}
        autofocus
        options={options}
        simpleValue
        clearable={this.props.clearable}
        name="artist-search"
        value={this.props.artist}
        placeholder="Search by Artist Name..."
        onChange={this.props.artistChange}
        />
     */

    componentDidMount() {
        console.log("+++++SearchAccordion");
        console.log(`There are ${this.props.htmlColors.length} colors!`);

        // Pick 14 Colors to display in Colors Search Tab
        for (let i = 0; i < 140; i++) {
            if(i % 10 == 0) {
                this.state.selectableColors.push(`#${this.props.htmlColors[i].hex}`);
            }
        }

    }

    componentWillReceiveProps(nextProps) {
        //pass
    }

    // -------- METHODS ------------

    getGeneralAndChange = (e) => {
        let general = this.refs.general.value;
        this.props.generalChange(general, e);
    }

    getArtistAndChange = (e) => {
        let artist = this.refs.artist.value;
        this.props.artistChange(artist, e);
    }

    getTitleAndChange = (e) => {
        let title = this.refs.title.value;
        this.props.titleChange(title, e);
    }

    setTime = (e) => {
        let timeType = e.target.value;
        let time = this.props.time;
        time.day.selected = false;
        time.week.selected = false;
        time.range.selected = false;

        switch (timeType) {
            case "day":
                time.day.selected = true;
                this.props.timeChange(time);
                break;
            case "week":
                time.week.selected = true;
                this.props.timeChange(time);
                break;
            case "range":
                time.range.selected = true;
                let fromDate = this.refs.fromDate.value;
                let toDate = this.refs.toDate.value;
                time.range.from = fromDate;
                time.range.to = toDate;
                this.props.timeChange(time);
                break;
        }

        this.props.toggleSearchCategory("time", true);
    }

    getColorAndChange = (colorBlock, color) => {
        let colors = document.getElementsByName('color');

        for (let i = 0; i < colors.length; i++) {
            if (colors[i].checked) {
                let searchColors = this.props.searchColors;
                searchColors[colors[i].value] = {number: colorBlock, hex: color };
                this.props.colorChange(searchColors);

                switch (i) {
                    case 0:
                        this.refs.rangeOne.value = 0;
                        break;
                    case 1:
                        this.refs.rangeTwo.value = 0;
                        break;
                    case 2:
                        this.refs.rangeThree.value = 0;
                        break;
                }
            }
        }

        // Toggles Search Hint
        this.props.toggleSearchCategory("color", true);
    }

    varyColor = (rangeInputNum) => {
        let rangeValue;

        // Get Current Range Value
        switch (rangeInputNum) {
            case "one":
                rangeValue = parseInt(this.refs.rangeOne.value);
                break;
            case "two":
                rangeValue = parseInt(this.refs.rangeTwo.value);
                break;
            case "three":
                rangeValue = parseInt(this.refs.rangeThree.value);
                break;
        }

        // Get Current Search Color Box
        let searchColors = this.props.searchColors;
        let searchColor = searchColors[rangeInputNum];

        // Get New Color Number
        let colorCategory = Math.floor(searchColor.number / 10) * 10;
        let colorNumber = colorCategory + rangeValue;

        let newColor = {
            number: colorNumber,
            hex: `#${this.props.htmlColors[colorNumber].hex}`
        }

        searchColors[rangeInputNum] = newColor;
        this.props.setSearchColors(searchColors);

        // Toggles Search Hint
        this.props.toggleSearchCategory("color", true);
    }

    sortColors = () => {

        for (var c = 0; c < this.state.htmlColors.length; c++) {
            let color = this.state.htmlColors[c]
            let hex = color.hex;

            /* Get the RGB values to calculate the Hue. */
            var r = parseInt(hex.substring(0,2),16)/255;
            var g = parseInt(hex.substring(2,4),16)/255;
            var b = parseInt(hex.substring(4,6),16)/255;

            /* Getting the Max and Min values for Chroma. */
            var max = Math.max.apply(Math, [r,g,b]);
            var min = Math.min.apply(Math, [r,g,b]);

            /* Variables for HSV value of hex color. */
            var chr = max-min;
            var hue = 0;
            var val = max;
            var sat = 0;

            if (val > 0) {
                /* Calculate Saturation only if Value isn't 0. */
                sat = chr/val;
                if (sat > 0) {
                    if (r == max) {
                        hue = 60*(((g-min)-(b-min))/chr);
                        if (hue < 0) {
                            hue += 360;
                        }
                    } else if (g == max) {
                        hue = 120+60*(((b-min)-(r-min))/chr);
                    } else if (b == max) {
                        hue = 240+60*(((r-min)-(g-min))/chr);
                }
              }
            }

            /* Modifies existing objects by adding HSV values. */
            this.state.htmlColors[c].hue = hue;
            this.state.htmlColors[c].sat = sat;
            this.state.htmlColors[c].val = val;
          }

          /* Sort by Hue. */
          let sortedColors = this.state.htmlColors.sort(function(a,b){
              return a.hue - b.hue;
          });

        this.setState({
            htmlColors: sortedColors
        });

        console.log(JSON.stringify(sortedColors));

        //   // Sort Hue Sorted colors by Value Too
        //   let sixty = [];
        //   let oneTwenty = [];
        //   let oneEighty = [];
        //   let twoForty = [];
        //   let threeHundred = [];
        //   let threeSixty = [];
        //
        //   for (let i = 0; i < 140; i++) {
        //       if (sortedColors[i].hue < 60) {
        //           sixty.push(sortedColors[i]);
        //       } else if (60 <= sortedColors[i].hue && sortedColors[i].hue < 120) {
        //           oneTwenty.push(sortedColors[i]);
        //       } else if (120 <= sortedColors[i].hue && sortedColors[i].hue < 180) {
        //           oneEighty.push(sortedColors[i]);
        //       } else if (180 <= sortedColors[i].hue && sortedColors[i].hue < 240) {
        //           twoForty.push(sortedColors[i]);
        //       } else if (240 <= sortedColors[i].hue && sortedColors[i].hue < 300) {
        //           threeHundred.push(sortedColors[i]);
        //       } else if (300 <= sortedColors[i].hue && sortedColors[i].hue <= 360) {
        //           threeSixty.push(sortedColors[i]);
        //       }
        //   }
        //
        //   let sortedSixty = sixty.sort(function(a,b){
        //       return a.val - b.val;
        //   });
        //
        //   let sortedOneTwenty = oneTwenty.sort(function(a,b){
        //       return a.val - b.val;
        //   });
        //
        //   let sortedOneEighty = oneEighty.sort(function(a,b){
        //       return a.val - b.val;
        //   });
        //
        //   let sortedTwoForty = twoForty.sort(function(a,b){
        //       return a.val - b.val;
        //   });
        //
        //   let sortedThreeHundred = threeHundred.sort(function(a,b){
        //       return a.val - b.val;
        //   });
        //
        //   let sortedThreeSixty = threeSixty.sort(function(a,b){
        //       return a.val - b.val;
        //   });
        //
        //   let colors = [];
        //
        //   colors = colors.concat(sortedSixty);
        //   colors = colors.concat(sortedOneTwenty);
        //   colors = colors.concat(sortedOneEighty);
        //   colors = colors.concat(sortedTwoForty);
        //   colors = colors.concat(sortedThreeHundred);
        //   colors = colors.concat(sortedThreeSixty);
        //
        // this.setState({
        //     htmlColors: colors
        // });
        //
        // console.log(JSON.stringify(colors));
    }
}
