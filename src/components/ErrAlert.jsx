import React from 'react';
import { Alert } from '@/components/ui/alert';

const ErrAlert = ({ error, m, mb }) => {
  return (
    <div
      style={{
        margin: m ? `${m}px` : '0px',
        marginBottom: mb ? `${mb}px` : '0px',
      }}
    >
      <Alert status='error' title={error} />
    </div>
  );
};

export default ErrAlert;
