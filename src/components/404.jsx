import React from 'react';

const Error404 = () => {
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30px',
  };
  const statusCodeStyles = {
    fontWeight: '600',
    marginBottom: '10px',
  };

  return (
    <div style={containerStyles}>
      <img
        src='/jotter-circle.png'
        alt='jotter logo'
        width={100}
        height={100}
      />
      <br />
      <p className='large-text' style={statusCodeStyles}>
        404
      </p>
      <p className='medium-text'>Content not found</p>
    </div>
  );
};

export default Error404;
