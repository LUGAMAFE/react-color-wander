import { createRoot } from 'react-dom/client';

import Example from './example';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(<Example />);
