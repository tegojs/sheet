import { useEffect, useRef } from 'react';
import Sheet from '.';
import './sheet.less';
import config from './config';
import svg from './assets/sprite.svg';

const ReactSheet = () => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      Sheet.makeSheet(ref.current);
      const elements = document.querySelectorAll(
        `.${config.cssPrefix}-icon-img`,
      );
      elements.forEach((element) => {
        (element as HTMLElement).style.backgroundImage = `url('${svg}')`;
      });
    }
  }, []);
  return <div ref={ref} />;
};

export default ReactSheet;
