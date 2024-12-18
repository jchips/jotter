import React from 'react';
import { Button } from '@chakra-ui/react';
import { useMarkdown } from '../../hooks/useMarkdown';
import './Note.scss';
import '../../assets/markdown.scss';
import Preview from './Preview';

const View = () => {
  const { markdown, setMarkdown } = useMarkdown();
  const handleSubmit = () => {};
  return (
    <div>
      <Preview />
      <div className='footer'>
        <Button className='save-btn' variant='solid' onClick={handleSubmit}>
          Edit
        </Button>
      </div>
    </div>
  );
};

export default View;
