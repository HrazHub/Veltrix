/// <reference types="vite/client" />

import type { VeltrixApi } from './src/types';

declare global {
  interface Window {
    velitrix: VeltrixApi;
  }
}
