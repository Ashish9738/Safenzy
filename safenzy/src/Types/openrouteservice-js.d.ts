declare module "openrouteservice-js" {
  export class Directions {
    constructor(options: { api_key: string });
    calculate(params: {
      coordinates: [number, number][];
      profile: string;
      format: string;
    }): Promise<any>;
  }
}
