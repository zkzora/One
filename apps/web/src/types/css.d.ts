import "react";

declare module "react" {
  /**
   * The ported design sets CSS custom properties inline (`--bg`, `--ink`, …).
   * React passes them through fine at runtime; the base types just don't
   * describe them.
   */
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
