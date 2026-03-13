/// <reference types="vite/client" />

declare module 'react-dom/client' {
  export * from 'react-dom';
}

declare module 'uuid' {
  export function v4(): string;
}
