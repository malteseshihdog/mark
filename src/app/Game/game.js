import { Modal } from 'components/feedback';
import React from 'react';
// import FaviconDark from "./Dark/favicon.svg"
import FaviconDark from "../../styles/themes/Dark/favicon.svg"

// import { Howl } from 'howler';
// import { TweenMax, Linear } from 'gsap';

// // audio files for the game
// const laserSound = new Howl({ src: ['laser.mp3'] });
// const explosionSound = new Howl({ src: ['explosion.mp3'] });

// constants for the game
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;
const INVADER_WIDTH = 40;
const INVADER_HEIGHT = 40;
const LASER_HEIGHT = 10;
const LASER_WIDTH = 4;
const LASER_SPEED = 3;
const NUM_INVADERS_X = 10;
const NUM_INVADERS_Y = 3;
const INVADER_SPACING = 50;
const INVADER_SPEED = 1;

const INVADER_VERTICAL_SPACING = 10;
const INVADER_HORIZONTAL_SPEED = 0.5;
const PLAYER_SPEED = 5;
const LASER_COOLDOWN = 2000;


// key codes for the arrow keys and space bar
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const SPACE = 32;

// utility function to generate the initial positions of the invaders
const generateInvaderPositions = () => {
  const positions = [];
  for (let y = 0; y < NUM_INVADERS_Y; y++) {
    for (let x = 0; x < NUM_INVADERS_X; x++) {
      positions.push({
        x: INVADER_SPACING * x,
        y: INVADER_SPACING * y + 100,
      });
    }
  }
  return positions;
};

// game component
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.gameContainer = React.createRef();
    this.canvas = React.createRef();
    this.ctx = null;
    this.invaderDirection = 1; // add this line
    this.playerDirection = 0; // add this line
    this.state = {
      gameOver: false,
      playerLasers: [],
      player: { x: 0, y: 0 },
      invaderLasers: [],
      score: 0,
      lives: 3,
      invaders: generateInvaderPositions(),
      lastInvaderLaser: Date.now(),
    };
  }

  componentDidMount() {
    // set up event listeners for user input (e.g. arrow keys)
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);

    // set up the canvas for rendering
    this.ctx = this.canvas.current.getContext('2d');

    this.canvas.current.width = this.gameContainer.current.clientWidth;
    this.canvas.current.height = this.gameContainer.current.clientHeight;

    this.setState({
      player: {
        x: this.canvas.current.width / 2 - PLAYER_WIDTH / 2,
        y: this.canvas.current.height - PLAYER_HEIGHT, // position at bottom of canvas
      }
    })

    // start the game loop
    this.gameLoop();
  }

  componentWillUnmount() {
    // remove event listeners
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  gameLoop = () => {
    this.moveInvaders();
    this.updateLasers();
    this.checkCollisions();
    this.movePlayer();
    // this.fireInvaderLaser();
    this.renderGame();
    if (this.state.gameOver) {
      return;
    }
    requestAnimationFrame(this.gameLoop);
  }

  movePlayer = (direction, fire) => {
    // update the player's x coordinate

    if (this.state.gameOver) {
      return;
    }

    if (this.state.player.x === 0 && this.state.player.y === 0) {
      this.setState({
        player: {
          x: this.canvas.current.width / 2 - PLAYER_WIDTH / 2,
          y: this.canvas.current.height - PLAYER_HEIGHT, // position at bottom of canvas
        }
      })
    } else {
      this.setState(prevState => {
        console.log(prevState.player.x + PLAYER_SPEED * this.playerDirection)
        return ({
          player: { ...prevState.player, x: prevState.player.x + PLAYER_SPEED * this.playerDirection }
        })
      })
    }

    // check if the player has moved off the canvas
    if (this.state.player.x < 0) {
      this.setState({ player: { ...this.state.player, x: 0 } });
    } else if (this.state.player.x + PLAYER_WIDTH > this.canvas.current.width) {
      this.setState({ player: { ...this.state.player, x: this.canvas.current.width - PLAYER_WIDTH } });
    }

    // fire laser if the space key is pressed
    if (fire) {
      const playerLaser = {
        x: this.state.player.x + PLAYER_WIDTH / 2 - LASER_WIDTH / 2,
        y: this.state.player.y - LASER_HEIGHT,
      };
      console.log("🚀 ~ file: game.js:149 ~ Game ~ this.state", this.state)
      console.log("🚀 ~ file: game.js:149 ~ Game ~ playerLaser", playerLaser)

      this.setState(prevState => ({
        playerLasers: [...prevState.playerLasers, playerLaser],
      }));
    }
  };

  moveInvaders = () => {
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
    if (leftmostInvader.x <= 0 || rightmostInvader.x + INVADER_WIDTH >= this.canvas.current.width) {
      // reverse the direction of the invaders
      this.invaderDirection = -this.invaderDirection;
      invaders = invaders.map(invader => {
        invader.y += INVADER_VERTICAL_SPACING;
        return invader;
      });
    }

    // update the invaders in state
    this.setState({ invaders });
  };

  fireInvaderLaser = () => {
    const { invaders } = this.state;
    // choose a random invader to shoot the laser
    const invader = invaders[Math.floor(Math.random() * invaders.length)];
    // create a new laser for the invader
    const invaderLaser = {
      x: invader.x + INVADER_WIDTH / 2 - LASER_WIDTH / 2,
      y: invader.y + INVADER_HEIGHT,
    };
    // add the invaderLaser to the array of invaderLasers
    this.setState((prevState) => ({
      invaderLasers: [...prevState.invaderLasers, invaderLaser],
    }));
  };

  updateLasers = () => {
    // update the position of each player laser
    let playerLasers = this.state.playerLasers.map(laser => {
      laser.y -= LASER_SPEED;
      return laser;
    });

    // remove player lasers that have moved off the top of the canvas
    playerLasers = playerLasers.filter(laser => laser.y > 0);

    this.setState({ playerLasers });

    // fire an invader laser at regular intervals
    if (this.state.lastInvaderLaser + LASER_COOLDOWN < Date.now()) {
      console.log('SHOOT')
      this.setState({ lastInvaderLaser: Date.now() });
      this.fireInvaderLaser();
    }


    let invaderLasers = this.state.invaderLasers.map(laser => {
      laser.y += LASER_SPEED;
      return laser;
    });

    // remove player lasers that have moved off the top of the canvas
    invaderLasers = invaderLasers.filter(laser => laser.y > 0);

    this.setState({ invaderLasers });
  }

  checkCollisions = () => {
    // check for collisions between player lasers and invaders
    this.state.playerLasers.forEach((playerLaser, index) => {
      this.state.invaders.forEach((invader, invaderIndex) => {
        if (playerLaser.x >= invader.x && playerLaser.x <= invader.x + INVADER_WIDTH && playerLaser.y >= invader.y && playerLaser.y <= invader.y + INVADER_HEIGHT) {
          // collision detected
          this.setState(prevState => {
            const playerLasers = [...prevState.playerLasers];
            playerLasers.splice(index, 1);
            const invaders = [...prevState.invaders];
            invaders.splice(invaderIndex, 1);
            return { playerLasers, invaders };
          });
        }
      });
    });

    this.state.invaderLasers.forEach((invaderLaser, index) => {
        if (invaderLaser.x >= this.state.player.x && invaderLaser.x <= this.state.player.x + PLAYER_WIDTH && invaderLaser.y >= this.state.player.y && invaderLaser.y <= this.state.player.y + PLAYER_HEIGHT) {
          // collision detected
          if (this.state.lives === 1) {
            this.setState({ gameOver: true });
          }
          this.setState({
            lives: this.state.lives - 1,
            invaderLasers: []
          });
        }
    });
    // check for collisions between the invader laser and the player, if active
    if (this.state.invaderLaser && this.state.invaderLaser.x >= this.state.player.x && this.state.invaderLaser.x <= this.state.player.x + PLAYER_WIDTH && this.state.invaderLaser.y >= this.state.player.y && this.state.invaderLaser.y <= this.state.player.y + PLAYER_HEIGHT) {
      // collision detected
      this.setState({
        invaderLaser: null,
        lives: this.state.lives - 1,
      });
    }
  };

  fireLaser = () => {
    // fire the player's laser

    // create a new laser
    const laser = {
      x: this.state.player.x + PLAYER_WIDTH / 2,
      y: this.state.player.y - LASER_HEIGHT,
      width: LASER_WIDTH,
      height: LASER_HEIGHT
    };

    console.log(laser);

    // add the new laser to the array of player lasers
    this.setState((prevState) => ({
      playerLasers: [...prevState.playerLasers, laser]
    }));
  }

  handleKeyDown = (event) => {
    if (event.keyCode === 37) {
      // left arrow key
      this.playerDirection = -1;
      // this.movePlayer(-1, false);
    } else if (event.keyCode === 39) {
      // right arrow key
      this.playerDirection = 1;
      // this.movePlayer(1, false);
    } else if (event.keyCode === 32) {
      // space key
      this.movePlayer(0, true);
    }
  };

  handleKeyUp = (event) => {
    if (event.keyCode === 32) {
      // space key
      this.movePlayer(0, false);
    } else if (event.keyCode === 37 || event.keyCode === 39) {
      // left or right arrow key, or space key
      this.playerDirection = 0;
    }
  };

  renderGame = () => {
    if (!this.canvas.current) {
      return;
    }
    // clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);

    this.ctx.save();
    this.ctx.translate(this.state.player.x + PLAYER_WIDTH / 2, this.state.player.y + PLAYER_HEIGHT / 2);
    this.ctx.rotate(Math.PI / 4);
    // render the player's spaceship
    // create an Image object for the spaceship
    const spaceshipImg = new Image();
    spaceshipImg.src = FaviconDark;
    // render the spaceship image on the canvas
    this.ctx.drawImage(
      spaceshipImg,
      -PLAYER_WIDTH / 2, // move the image back to its original position
      -PLAYER_HEIGHT / 2, // move the image back to its original position
      PLAYER_WIDTH,
      PLAYER_HEIGHT,
    );

    this.ctx.restore();
    // this.ctx.fillStyle = '#fff';
    // this.ctx.fillRect(
    //   this.state.player.x,
    //   this.state.player.y,
    //   PLAYER_WIDTH,
    //   PLAYER_HEIGHT,
    // );

    // render the invaders
    this.state.invaders.forEach((invader) => {
      this.ctx.fillStyle = '#f00';
      this.ctx.fillRect(
        invader.x,
        invader.y,
        INVADER_WIDTH,
        INVADER_HEIGHT,
      );
    });

    // // render the player's laser, if active
    this.state.playerLasers.forEach((laser) => {
      // this.ctx.fillStyle = 'green';
      // this.ctx.fillRect(laser.x, laser.y, LASER_WIDTH, LASER_HEIGHT);
      this.ctx.fillStyle = '#2F61EA';
      this.ctx.fillRect(
        laser.x,
        laser.y,
        LASER_WIDTH,
        LASER_HEIGHT,
      );
    });
    // if (this.state.playerLaser) {

    // }

    // render the invader lasers
    this.state.invaderLasers.forEach((laser) => {
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(
        laser.x,
        laser.y,
        LASER_WIDTH,
        LASER_HEIGHT,
      );
    });

    // render the score and number of lives remaining
    this.ctx.font = '24px sans-serif';
    this.ctx.fillStyle = '#fff';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.state.score}`, 10, 30);
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`Lives: ${this.state.lives}`, this.canvas.current.width - 10, 30);
  }

  restartGame = () => {
    const invaders = generateInvaderPositions();
    this.gameContainer = React.createRef();
    this.canvas = React.createRef();
    // this.ctx = null;
    this.invaderDirection = 1
    this.playerDirection = 0; // add this line
    this.setState({
      gameOver: false,
      playerLasers: [],
      player: { x: 0, y: 0 },
      invaderLasers: [],
      score: 0,
      lives: 3,
      invaders: invaders,
    });

    setTimeout(() => {
      this.componentDidMount();
    }, 1000);
  };

  render() {
    return (
      <>
        <div>
          <h1>Station Defender</h1>
          <div ref={this.gameContainer} style={{ height: '800px' }}>
            <canvas ref={this.canvas} />
            {/*   */}
          </div>
        </div>
        {this.state.gameOver && <Modal title="Game Over!!!" isOpen><button onClick={this.restartGame}>Restart</button></Modal>}
      </>
    );
  }
}

export default Game;