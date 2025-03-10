export class Annotation {
  constructor(
    public label: string,
    public polygon: [number, number][]
  ) {}

  static fromJSON(json: any): Annotation {
    return new Annotation(json.label, json.polygon);
  }
}
