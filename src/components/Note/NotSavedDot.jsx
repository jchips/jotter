import { motion, AnimatePresence } from 'framer-motion';
import './Editor.scss';

const NotSavedDot = ({ showDot }) => {
  return (
    <AnimatePresence>
      {showDot && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: 0.6,
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            // backgroundColor: '#646cff', // themePurpleText
            marginInline: 10,
            // marginInline: !configs?.hideWordCount ? 0 : 10,
          }}
          className='saved-indicator-text'
        />
      )}
    </AnimatePresence>
  );
};

export default NotSavedDot;
