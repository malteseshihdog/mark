import React from 'react';

const LASER_WIDTH = 5;
const LASER_HEIGHT = 15;

const Laser = ({ x, y }) => {
  return (
    <div
      className="laser"
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${LASER_WIDTH}px`,
        height: `${LASER_HEIGHT}px`,
      }}
    />
  );
};

export default Laser;
