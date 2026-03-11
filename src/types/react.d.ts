declare module 'react' {
  export = React;
  export as namespace React;

  namespace React {
    interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
      type: T;
      props: P;
      key: Key | null;
    }

    type JSXElementConstructor<P> = (props: P) => ReactElement<any, any> | null;
    type Key = string | number;

    interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> {
      render(): ReactNode;
    }

    interface ComponentLifecycle<P, S, SS = any> {
      componentDidMount?(): void;
      componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void;
      componentWillUnmount?(): void;
    }

    type ReactNode = ReactElement | string | number | boolean | null | undefined | ReactNode[];

    function createElement<P extends {}>(
      type: FunctionComponent<P> | ComponentClass<P> | string,
      props?: Attributes & P | null,
      ...children: ReactNode[]
    ): ReactElement<P>;

    interface Attributes {
      key?: Key | null;
    }

    interface FunctionComponent<P = {}> {
      (props: P, context?: any): ReactElement<any, any> | null;
    }

    interface ComponentClass<P = {}, S = {}> {
      new(props: P, context?: any): Component<P, S>;
    }

    type ComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
      T extends JSXElementConstructor<infer P>
        ? P
        : T extends keyof JSX.IntrinsicElements
          ? JSX.IntrinsicElements[T]
          : {};

    namespace JSX {
      interface Element extends ReactElement<any, any> { }
      interface ElementClass extends Component<any> { }
      interface ElementAttributesProperty { props: {}; }
      interface ElementChildrenAttribute { children: {}; }

      interface IntrinsicElements {
        [elemName: string]: any;
      }
    }
  }
}
