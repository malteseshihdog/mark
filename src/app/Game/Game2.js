import React from 'react';
import PlayerSpaceship from './Components/player-spaceship';
import Invader from './Components/invader';
import Laser from './Components/laser';

const NUM_INVADERS_X = 2;
const NUM_INVADERS_Y = 1;
const INVADER_SPEED = 0.5;
const INVADER_WIDTH = 40;
const INVADER_HEIGHT = 40;
const INVADER_VERTICAL_SPACING = 10;
const INVADER_HORIZONTAL_SPEED = 0.5;

const PLAYER_SPEED = 5;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;

const LASER_SPEED = 10;
const LASER_HEIGHT = 10;
const LASER_WIDTH = 4;

const INVADER_SPACING = 50;

const generateInvaderPositions = () => {
  const positions = [];
  for (let y = 0; y < NUM_INVADERS_Y; y++) {
    for (let x = 0; x < NUM_INVADERS_X; x++) {
      positions.push({
        x: INVADER_SPACING * x + INVADER_WIDTH,
        y: INVADER_SPACING * y + INVADER_HEIGHT + 100,
      });
    }
  }
  console.log("positions: ",positions);
  return positions;
};

class Game extends React.Component {
  gameContainer = React.createRef();
  invaderDirection = 1;
  state = {
    score: 0,
    lives: 3,
    player: {
      x: 0,
      y: 0,
    },
    invaders: generateInvaderPositions(),
    playerLasers: [],
    invaderLasers: [],
    gameOver: false,
    playerDirection: 0,
  };

  componentDidMount() {
     // set up event listeners for user input (e.g. arrow keys)
     window.addEventListener('keydown', this.handleKeyDown);
     window.addEventListener('keyup', this.handleKeyUp);

    //  const invaders = generateInvaderPositions();
    //  console.log("🚀 ~ file: Game2.js:60 ~ Game ~ componentDidMount ~ invaders", invaders)

     // set up the initial state for the player's position and invaders
     this.setState({
       player: {
         x: window.innerWidth / 2 - PLAYER_WIDTH / 2,
         y: window.innerHeight - PLAYER_HEIGHT, // position at bottom of screen
       }
     });

     // start the game loop
     console.log('state: ', this.state)
     this.gameLoop();
  }

  componentWillUnmount() {
    // remove event listeners when the component unmounts
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  gameLoop = () => {
     // update the game state
    this.movePlayer();
    this.moveInvaders();
    this.updateLasers();
    this.checkCollisions();

    // render the game
    this.renderGame();

    // check if the game is over
    if (this.state.gameOver) {
      this.renderGameOver();
    } else {
      // if the game is not over, request the next frame
      requestAnimationFrame(this.gameLoop);
    }
  }

  movePlayer = () => {
    if (this.state.player.x > 0 && this.state.playerDirection === -1) {
      this.setState(prevState => ({
        player: {
          ...prevState.player,
          x: prevState.player.x - PLAYER_SPEED,
        },
      }));
    } else if (this.state.player.x < this.gameContainer.current.width - PLAYER_WIDTH && this.state.playerDirection === 1) {
      this.setState(prevState => ({
        player: {
          ...prevState.player,
          x: prevState.player.x + PLAYER_SPEED,
        },
      }));
    }
  }

  moveInvaders = () => {
    console.log('this.state.invaders: ', this.state.invaders)
    // // update the position of each invader
    // const invaders = this.state.invaders.map((invader) => {
    //   // check if the invader has reached the edge of the screen
    //   console.log("🚀 ~ file: Game2.js:125 ~ Game ~ invaders ~ this.gameContainer", this.gameContainer)
    //   if (invader.x + INVADER_WIDTH > this.gameContainer.current.clientWidth || invader.x < 0) {
    //     // if the invader has reached the edge of the screen, reverse the direction and move down
    //     return {
    //       ...invader,
    //       x: invader.x + (this.invaderDirection * -1),
    //       y: invader.y + INVADER_VERTICAL_SPACING,
    //     };
    //   } else {
    //     // if the invader has not reached the edge of the screen, move in the current direction
    //     return {
    //       ...invader,
    //       x: invader.x + this.invaderDirection,
    //     };
    //   }
    // });
    // console.log("🚀 ~ file: Game2.js:140 ~ moveInvaders ~ invaders ~ this.state.invaders", this.state.invaders)

    // // update the state with the new positions of the invaders
    // this.setState({ invaders });

    // // reverse the direction if any of the invaders have reached the edge of the screen
    // if (invaders.some(invader => invader.x + INVADER_WIDTH > this.gameContainer.current.width || invader.x < 0)) {
    //   this.invaderDirection *= -1;
    // }


    // update the positions of the invaders
    let invaders = this.state.invaders.map(invader => {
      invader.x += INVADER_SPEED * this.invaderDirection;
      return invader;
    });

    if (invaders.length === 0) {
      // the player has won the game
      this.setState({ gameOver: true });
      return;
    }
    // check if the leftmost or rightmost invader has reached the edge of the canvas
    const leftmostInvader = invaders[0];
    const rightmostInvader = invaders[invaders.length - 1];
    console.log("🚀 ~ file: Game2.js:165 ~ Game ~ rightmostInvader", rightmostInvader)
    console.log("🚀 ~ file: Game2.js:167 ~ Game ~ this.gameContainer.current.width", this.gameContainer.current.clientWidth)
    if (leftmostInvader.x <= 0 || rightmostInvader.x + INVADER_WIDTH >= this.gameContainer.current.clientWidth) {
      // reverse the direction of the invaders
      this.invaderDirection = -this.invaderDirection;
      invaders = invaders.map(invader => {
        invader.y += INVADER_VERTICAL_SPACING;
        return invader;
      });
    }

    // update the invaders in state
    this.setState({ invaders });

  }

  updateLasers = () => {
    // update the position of the player's lasers, if any are active
    if (this.state.playerLasers.length > 0) {
      this.setState(prevState => {
        // create a new array to hold the updated laser positions
        const updatedLasers = [];

        // loop through the player's lasers
        for (let i = 0; i < prevState.playerLasers.length; i++) {
          const laser = prevState.playerLasers[i];

          // check if the laser has reached the top of the screen
          if (laser.y > 0) {
            // if the laser has not reached the top of the screen, update its position and add it to the updatedLasers array
            updatedLasers.push({
              ...laser,
              y: laser.y - LASER_SPEED,
            });
          }
        }

        // set the playerLasers state to the updatedLasers array
        return { playerLasers: updatedLasers };
      });
    }

    // update the position of the invader's lasers, if any are active
    if (this.state.invaderLasers.length > 0) {
      this.setState(prevState => {
        // create a new array to hold the updated laser positions
        const updatedLasers = [];

        // loop through the invader's lasers
        for (let i = 0; i < prevState.invaderLasers.length; i++) {
          const laser = prevState.invaderLasers[i];

          // check if the laser has reached the bottom of the screen
          if (laser.y < this.gameContainer.current.height) {
            // if the laser has not reached the bottom of the screen, update its position and add it to the updatedLasers array
            updatedLasers.push({
              ...laser,
              y: laser.y + LASER_SPEED,
            });
          }
        }

        // set the invaderLasers state to the updatedLasers array
        return { invaderLasers: updatedLasers };
      });
    }
  }

  checkCollisions = () => {
    // check for collisions between player lasers and invaders
    // this.state.playerLasers.forEach(laser => {
    //   this.state.invaders.forEach((invader, index) => {
    //     if (laser.x < invader.x + INVADER_WIDTH &&
    //         laser.x + LASER_WIDTH > invader.x &&
    //         laser.y < invader.y + INVADER_HEIGHT &&
    //         laser.y + LASER_HEIGHT > invader.y) {
    //       // if a collision is detected, remove the invader and the laser from their respective arrays in state
    //       this.setState(prevState => {
    //         return {
    //           invaders: [
    //             ...prevState.invaders.slice(0, index),
    //             ...prevState.invaders.slice(index + 1),
    //           ],
    //           playerLasers: prevState.playerLasers.filter(playerLaser => playerLaser !== laser),
    //         };
    //       });

    //       // increase the score by 1
    //       this.setState(prevState => ({
    //         score: prevState.score + 1,
    //       }));
    //     }
    //   });
    // });

    // check for collisions between the player's laser and the invaders
    let playerLasers = this.state.playerLasers;
    let invaders = this.state.invaders;
    for (let i = 0; i < playerLasers.length; i++) {
      for (let j = 0; j < invaders.length; j++) {
        if (playerLasers[i] && invaders[j]) {
          if (playerLasers[i].x >= invaders[j].x && playerLasers[i].x <= invaders[j].x + INVADER_WIDTH && playerLasers[i].y >= invaders[j].y && playerLasers[i].y <= invaders[j].y + INVADER_HEIGHT) {
            // remove the laser and the invader
            playerLasers.splice(i, 1);
            invaders.splice(j, 1);
            this.setState({
              playerLasers: playerLasers,
              invaders: invaders,
            });
            // increase the score
            this.setState(prevState => ({
              score: prevState.score + 1,
            }));
          }
        }
      }
    }

    // check for collisions between invader lasers and the player
    // this.state.invaderLasers.forEach(laser => {
    //   if (laser.x < this.state.player.x + PLAYER_WIDTH &&
    //       laser.x + LASER_WIDTH > this.state.player.x &&
    //       laser.y < this.state.player.y + PLAYER_HEIGHT &&
    //       laser.y + LASER_HEIGHT > this.state.player.y) {
    //     // if a collision is detected, remove the laser from the invaderLasers array in state and decrease the number of lives by 1
    //     this.setState(prevState => ({
    //       invaderLasers: prevState.invaderLasers.filter(invaderLaser => invaderLaser !== laser),
    //       lives: prevState.lives - 1,
    //     }));

    //     // check if the player has any lives remaining
    //     if (this.state.lives <= 0) {
    //       // if the player has no lives remaining, end the game
    //       this.setState({ gameOver: true });
    //     }
    //   }
    // });

    // check for collisions between the invader's laser and the player
    let invaderLasers = this.state.invaderLasers;
    let player = this.state.player;
    for (let i = 0; i < invaderLasers.length; i++) {
      if (invaderLasers[i] && player) {
        if (invaderLasers[i].x >= player.x && invaderLasers[i].x <= player.x + PLAYER_WIDTH && invaderLasers[i].y >= player.y && invaderLasers[i].y <= player.y + PLAYER_HEIGHT) {
          // remove the laser and decrease the number of lives
          invaderLasers.splice(i, 1);
          this.setState(prevState => ({
            invaderLasers: invaderLasers,
            lives: prevState.lives - 1,
          }));
          // check if the player is out of lives
          if (this.state.lives <= 0) {
            this.setState({
              gameOver: true,
            });
          }
        }
      }
    }

    // check for collisions between the player and the invaders
    for (let i = 0; i < invaders.length; i++) {
      if (player && invaders[i]) {
        if (player.x >= invaders[i].x && player.x <= invaders[i].x + INVADER_WIDTH && player.y >= invaders[i].y && player.y <= invaders[i].y + INVADER_HEIGHT) {
          // decrease the number of lives and check if the player is out of lives
          this.setState(prevState => ({
            lives: prevState.lives - 1,
          }));
          if (this.state.lives <= 0) {
            this.setState({
              gameOver: true,
            });
          }
        }
      }
    }
  }

  renderGame = () => {
    return (
      <div className="game-container" ref={this.gameContainer}>
        <PlayerSpaceship x={this.state.player.x} y={this.state.player.y} />
        {/* render the invaders */}
        {this.state.invaders.map((invader, index) => (
          <Invader key={index} x={invader.x} y={invader.y} />
        ))}

        {/* render the player's laser, if active */}
        {this.state.playerLasers.map((laser, index) => (
          <Laser key={index} x={laser.x} y={laser.y} />
        ))}

        {/* render the invader's laser, if active */}
        {this.state.invaderLasers.map((laser, index) => (
          <Laser key={index} x={laser.x} y={laser.y} />
        ))}

        {/* render the score and number of lives remaining */}
        <div className="score-lives-container">
          <div className="score">Score: {this.state.score}</div>
          <div className="lives">Lives: {this.state.lives}</div>
        </div>
      </div>
    );
  }

  handleKeyDown = (event) => {
    // check if the left arrow key is pressed
    if (event.keyCode === 37) {
      this.setState({ playerDirection: -1 });
    }
    // check if the right arrow key is pressed
    else if (event.keyCode === 39) {
      this.setState({ playerDirection: 1 });
    }
    // check if the space bar is pressed (to fire laser)
    else if (event.keyCode === 32) {
      this.fireLaser();
    }
  }

  handleKeyUp = (event) => {
    // check if the left arrow key is released
    if (event.keyCode === 37) {
      this.setState({ playerDirection: 0 });
    }
    // check if the right arrow key is released
    else if (event.keyCode === 39) {
      this.setState({ playerDirection: 0 });
    }
  }

  fireLaser = () => {
    this.setState(prevState => ({
      playerLasers: [
        ...prevState.playerLasers,
        {
          x: prevState.player.x + PLAYER_WIDTH / 2 - LASER_WIDTH / 2,
          y: prevState.player.y - LASER_HEIGHT,
        },
      ],
    }));
  }

  render() {
    return this.renderGame();
  }
}

export default Game;