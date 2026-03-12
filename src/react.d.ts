declare module "react" {
  export = React;
  export as namespace React;

  namespace React {
    interface ReactElement {
      type: unknown;
      props: unknown;
      key: string | null;
    }

    type ReactNode = ReactElement | string | number | null | undefined | ReactNode[];

    function createElement(
      type: string | ((props: Record<string, unknown>) => ReactNode),
      props?: Record<string, unknown> | null,
      ...children: ReactNode[]
    ): ReactElement;

    function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
    function useState<T>(initialState: T): [T, (newState: T | ((prev: T) => T)) => void];
    function useRef<T>(initialValue: T | null): { current: T | null };
    function useCallback<T extends (...args: unknown[]) => unknown>(callback: T, deps: unknown[]): T;

    interface FC<P = Record<string, unknown>> {
      (props: P): ReactElement | null;
    }
  }
}

declare module "react-dom/client" {
  import { ReactElement } from "react";

  interface Root {
    render(element: ReactElement): void;
    unmount(): void;
  }

  function createRoot(container: Element | DocumentFragment): Root;
}
