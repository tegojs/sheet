import { useEffect, useRef } from 'react';
import Sheet from '.';

const ReactSheet = () => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      Sheet.makeSheet(ref.current);
    }
  }, []);
  return <div ref={ref} />;
};

export default ReactSheet;
