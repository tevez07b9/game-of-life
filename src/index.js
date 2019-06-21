import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Box extends React.Component {
  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.col);
  };
  render() {
    return (
      <div
        className={this.props.boxClass}
        id={this.props.boxId}
        onClick={this.selectBox}
      />
    );
  }
}

class Grid extends React.Component {
  render() {
    const width = this.props.cols * 16;
    var rowsArr = [];
    var boxClass = "";

    for (var i = 0; i < this.props.rows; i++) {
      for (var j = 0; j < this.props.cols; j++) {
        let boxId = i + "_" + j;
        boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
        rowsArr.push(
          <Box
            key={boxId}
            row={i}
            col={j}
            boxClass={boxClass}
            boxId={boxId}
            selectBox={this.props.selectBox}
          />
        );
      }
    }
    return (
      <div className="grid" style={{ width: width }}>
        {rowsArr}
      </div>
    );
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.speed = 100;
    this.rows = 30;
    this.cols = 50;
    this.state = {
      generation: 0,
      gridFull: Array(this.rows)
        .fill()
        .map(() => Array(this.cols).fill(false))
    };
  }

  selectBox = (row, col) => {
    let gridFull = arrayClone(this.state.gridFull);
    gridFull[row][col] = !gridFull[row][col];
    this.setState({
      gridFull
    });
  };

  seed = () => {
    let gridFull = arrayClone(this.state.gridFull);
    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.cols; j++) {
        if (Math.floor(Math.random() * 4) === 1) {
          gridFull[i][j] = true;
        }
      }
    }
    this.setState({
      gridFull
    });
  };

  play = () => {
    let g = this.state.gridFull;
    let g2 = arrayClone(this.state.gridFull);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let count = 0;
        if (i > 0) if (g[i - 1][j]) count++;
        if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
        if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
        if (j < this.cols - 1) if (g[i][j + 1]) count++;
        if (j > 0) if (g[i][j - 1]) count++;
        if (i < this.rows - 1) if (g[i + 1][j]) count++;
        if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
        if (i < this.rows - 1 && j < this.cols - 1)
          if (g[i + 1][j + 1]) count++;
        if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
        if (!g[i][j] && count === 3) g2[i][j] = true;
      }
    }
    this.setState({
      gridFull: g2,
      generation: this.state.generation + 1
    });
  };

  playButton = () => {
    clearInterval(this.intervalID);
    this.intervalID = setInterval(this.play, this.speed);
  };

  pauseButton = () => {
    clearInterval(this.intervalID);
  };

  componentDidMount() {
    this.seed();
  }

  render() {
    return (
      <div>
        <h1>Game Of Life</h1>
        <button onClick={() => this.playButton()}>Play</button>
        <button onClick={() => this.pauseButton()}>Pause</button>
        <Grid
          cols={this.cols}
          rows={this.rows}
          gridFull={this.state.gridFull}
          selectBox={this.selectBox}
        />
        <h2>Generations: {this.state.generation}</h2>
      </div>
    );
  }
}

function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(<Main />, document.getElementById("root"));
