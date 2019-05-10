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
      userInput: "",
      timerStarted: false,
      seconds: 0,
      secondsLeft: 10,
      totalSeconds: 10
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

  startTimer = e => {
    this.setState({
      timerStarted: true
    });
    this.timer = setInterval(() => {
      if (this.state.secondsLeft === 0) {
        clearInterval(this.timer);
        this.setState({
          timerStarted: false
        })
      } else {
          this.setState(prevState => ({
            secondsLeft: prevState.secondsLeft - 1,
            wpm: Math.floor(
              (prevState.wordIndex /
                (prevState.totalSeconds - prevState.secondsLeft + 1)) *
                60
            )
          }));

      }
    }, 1000);
    // this.timer = setInterval(()=>{
    //   this.setState(prevState => ({
    //     seconds: prevState.seconds+1,
    //     wpm: Math.floor(prevState.wordIndex / (prevState.seconds+1) * 60)
    //   }))
    // },1000);
  };

  handleChange = e => {
    // console.log(e.target.value);
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
        // console.log("Word underprogression");
        return {
          userInput,
          word_red: false,
          letterIndex: userInput.length
        };
      } else {
        return {
          userInput,
          word_red: true
        };
      }
    });
  };

  render() {
    const userInput = this.state.userInput;
    const wordIndex = this.state.wordIndex;
    const letterIndex = this.state.letterIndex;

    return (
      <div className="container">
        <header>
          <h1>Type Writer App</h1>
          {/* <h1 className="timer">{this.state.seconds}</h1> */}
          <h1 className="timer">{this.state.secondsLeft}</h1>
        </header>
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
                        key={lIndex}
                      >
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
          readOnly={!this.state.timerStarted}
        />

        <button onClick={this.startTimer}>Start Timer</button>

        <h2>WPA: {this.state.wpm}</h2>
      </div>
    );
  }
}

export default App;
