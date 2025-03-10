import { Annotation } from "./annotation";

export class Image {
  constructor(
    public id: string,
    public filePath: string,
    public city: string,
    public width?: number,
    public height?: number,
    public annotations?: Annotation[]
  ) {}

  static fromJSON(json: any): Image {
    return new Image(
      json.id,
      json.filePath,
      json.city,
      json.width,
      json.height,
      json.annotations ? json.annotations.map((obj: any) => Annotation.fromJSON(obj)) : []
    );
  }

  static fromMinimalJSON(json: any): Image {
    return new Image(json.id, json.filePath, json.city);
  }
}
