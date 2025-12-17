import { TegoSheet } from '@tego/sheet';
import '@tego/sheet/style.css';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <TegoSheet
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
