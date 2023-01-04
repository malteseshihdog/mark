import React from 'react';
import FaviconDark from "../../../styles/themes/Dark/favicon.svg"

const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;

const PlayerSpaceship = ({ x, y }) => {
  return (
    <img
      src={FaviconDark}
      alt="Player Spaceship"
      className="player-spaceship"
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${PLAYER_WIDTH}px`,
        height: `${PLAYER_HEIGHT}px`,
      }}
    />
  );
};

export default PlayerSpaceship;
