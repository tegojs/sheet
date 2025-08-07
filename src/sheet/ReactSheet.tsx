import { useEffect, useRef } from 'react';
import Sheet from '.';
import './sheet.less';
import config from './configs';
import svg from './assets/sprite.svg';

const ReactSheet = () => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      Sheet.makeSheet(ref.current);
      const elements = document.querySelectorAll(
        `.${config.cssPrefix}-icon-img`,
      );
      // @ts-expect-error NodeListOf<Element> should treat as array
      for (const element of elements) {
        (element as HTMLElement).style.backgroundImage = `url('${svg}')`;
      }
    }
  }, []);
  return <div style={{ width: 800 }} ref={ref} />;
};

export default ReactSheet;
