import { ReactSheet } from '@tachybase/sheet';
import '@tachybase/sheet/style.css';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactSheet
        options={{
          view: {
            height: () => window.innerHeight,
            width: () => window.innerWidth,
          },
        }}
      />
    </div>
  );
}

export default App;
