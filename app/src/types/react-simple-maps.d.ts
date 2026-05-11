declare module "react-simple-maps" {
  import { ReactNode, CSSProperties, SVGAttributes } from "react";

  interface ComposableMapProps {
    projectionConfig?: { scale?: number; center?: [number, number] };
    style?: CSSProperties;
    children?: ReactNode;
  }

  interface GeographiesProps {
    geography: string;
    children: (props: { geographies: Geography[] }) => ReactNode;
  }

  interface Geography {
    rsmKey: string;
    [key: string]: unknown;
  }

  interface GeographyProps extends SVGAttributes<SVGPathElement> {
    geography: Geography;
    style?: {
      default?: CSSProperties;
      hover?: CSSProperties;
      pressed?: CSSProperties;
    };
  }

  interface MarkerProps extends SVGAttributes<SVGGElement> {
    coordinates: [number, number];
    children?: ReactNode;
  }

  interface ZoomableGroupProps {
    children?: ReactNode;
    [key: string]: unknown;
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element;
  export function Geographies(props: GeographiesProps): JSX.Element;
  export function Geography(props: GeographyProps): JSX.Element;
  export function Marker(props: MarkerProps): JSX.Element;
  export function ZoomableGroup(props: ZoomableGroupProps): JSX.Element;
}
