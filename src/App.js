import React, { Component } from "react";
import axios from "axios";
import classNames from "classnames";

import "./bootstrap-grid.min.css";
import "./App.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: [],
      wordIndex: 0,
      letterIndex: 0,
      userInput: ""
    };
  }

  extractRichText = plainText => {};

  componentDidMount() {
    axios
      .get("http://www.randomtext.me/api/")
      .then(res => {
        console.log(res);
        let words = res.data.text_out
          .match(/\w+/g)
          .filter(word => word !== "p")
          .map(word => word + " ");
        this.setState({
          text: res.data.text_out,
          words
        });
        console.log(words);
      })
      .catch(err => console.error(err));
  }

  handleChange = e => {
    console.log(e.target.value);
    const userInput = e.target.value;
    const curWord = this.state.words[this.state.wordIndex];
    this.setState(prevState => {
      if (curWord === userInput) {
        return {
          wordIndex: prevState.wordIndex + 1,
          userInput: "",
          letterIndex: 0
        };
      } else if (curWord.indexOf(userInput) === 0) {
        console.log("Word underprogression");
        return {
          userInput,
          word_red: false,
          // wordClass: ''
          letterIndex: userInput.length
        };
      } else {
        return {
          userInput,
          word_red: true
          // wordClass: "word__red"
        };
      }
    });

    // if (curWord === userInput) {
    //   console.log("User input is correct, increase the index");
    //   this.setState(prevState => {
    //     return {
    //       wordIndex: prevState.wordIndex + 1,
    //       userInput: "",
    //       letterIndex: 0
    //     };
    //   });
    // } else {
    //   console.log("letterIndex = ", userInput.length - 1);
    //   this.setState(prevState => {
    //     return {
    //       userInput,
    //       letterIndex: userInput.length - 1
    //     };
    //   });
    // }
  };

  render() {
    const userInput = this.state.userInput;
    const wordIndex = this.state.wordIndex;
    const letterIndex = this.state.letterIndex;

    return (
      <div className="container">
        <h1>Type Writer App</h1>
        <div className="textToWrite">
          {this.state.words.map((word, wIndex) => {
            return (
              <>
                <span
                  className={classNames("word", {
                    word__current: wIndex === wordIndex,
                    word__correct: wIndex < wordIndex,
                    word__red: this.state.word_red && wIndex === wordIndex
                  })}
                  // className={
                  //   wIndex === wordIndex
                  //     ? "word__current"
                  //     : wIndex <= wordIndex
                  //     ? "word__correct"
                  //     : "word"
                  // }
                  key={wIndex}
                >
                  {/* {word} */}
                  {word.split("").map((letter, lIndex) =>
                    wIndex === wordIndex ? (
                      <span
                        className={classNames("letter", {
                          green: lIndex < letterIndex,
                          red_bg:
                            letterIndex <= lIndex &&
                            lIndex <
                              letterIndex + userInput.length - letterIndex &&
                            this.state.word_red
                        })}
                        // className={
                        //   lIndex === letterIndex &&
                        //   userInput[letterIndex] === letter
                        //     ? "green"
                        //     : "Cur"
                        // }
                        key={lIndex}
                      >
                        {/* { lIndex == letterIndex && "$" } */}
                        {letter}
                      </span>
                    ) : (
                      <span key={lIndex}>{letter}</span>
                    )
                  )}
                </span>
                &nbsp;
              </>
            );
          })}
        </div>

        <input
          type="text"
          value={this.state.userInput}
          onChange={this.handleChange}
          className={classNames({
            red_bg: this.state.word_red
          })}
        />
      </div>
    );
  }
}

export default App;
