import type React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        poster?: string;
        alt?: string;
        "camera-controls"?: boolean | "";
        "auto-rotate"?: boolean | "";
        autoplay?: boolean | "";
        ar?: boolean | "";
        "ar-modes"?: string;
        exposure?: string;
        "environment-image"?: string;
      };
    }
  }
}

export {};
