import React from 'react';

const INVADER_WIDTH = 50;
const INVADER_HEIGHT = 50;

const Invader = ({ x, y }) => {
  return (
    <div
      className="invader"
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${INVADER_WIDTH}px`,
        height: `${INVADER_HEIGHT}px`,
        backgroundColor: 'red',
      }}
    />
  );
};

export default Invader;
