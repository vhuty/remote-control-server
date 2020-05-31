/**
 * Express Request/Response object mixins
 */
declare namespace Express {
  export interface Request {
    device?: import('./src/models/device').Device;
    controller?: import('./src/models/controller').Controller;
  }
}