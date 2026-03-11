declare module 'react-dom/client' {
  import type { ReactElement } from 'react';

  export interface Root {
    render(element: ReactElement): void;
    unmount(): void;
  }

  export function createRoot(container: Element | DocumentFragment): Root;
  export function hydrateRoot(container: Element | DocumentFragment, initialChildren: ReactElement): Root;
}
