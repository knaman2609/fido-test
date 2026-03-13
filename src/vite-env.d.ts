/// <reference types="vite/client" />

declare module 'react-dom/client' {
  import { ReactElement } from 'react';
  
  interface Root {
    render(element: ReactElement): void;
    unmount(): void;
  }
  
  export function createRoot(container: Element | DocumentFragment): Root;
  export function hydrateRoot(container: Element | DocumentFragment, initialChildren: ReactElement): Root;
}

declare module 'uuid' {
  export function v4(): string;
}
