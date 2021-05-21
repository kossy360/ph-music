import { useWindowWidth } from '@react-hook/window-size';
import { inRange } from 'lodash';
import { useMemo } from 'react';

const useScreenSize = () => {
  const width = useWindowWidth();

  const hook = useMemo(
    () => ({
      width,
      min: (value: number) => width >= value,
      max: (value: number) => width <= value,
      btw: (min: number, max: number) => inRange(width, min, max),
    }),
    [width]
  );

  return hook;
};

export default useScreenSize;
