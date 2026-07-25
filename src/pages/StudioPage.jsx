import { Studio } from 'sanity';
import config from '../../studio/sanity.config';

export default function StudioPage() {
  return (
    <div style={{ height: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0, zIndex: 99999 }}>
      <Studio config={config} />
    </div>
  );
}
