import {
  ProgressCircleRing,
  ProgressCircleRoot,
} from '@/components/ui/progress-circle';

const Loading = () => {
  return (
    <ProgressCircleRoot
      value={null}
      size='md'
      style={{ display: 'flex', justifyContent: 'center' }}
    >
      <ProgressCircleRing style={{ position: 'absolute', top: 50 }} />
    </ProgressCircleRoot>
  );
};

export default Loading;
