import { Annotation } from "./annotation";

export class Image {
  constructor(
    public id: string,
    public imagePath: string,
    public annotationsPath: string,
    public city: string,
    public width?: number,
    public height?: number,
    public annotations?: Annotation[]
  ) {}

  static fromJSON(json: any): Image {
    return new Image(
      json.id,
      json.imagePath,
      json.annotationsPath,
      json.city,
      json.width,
      json.height,
      json.annotations ? json.annotations.map((obj: any) => Annotation.fromJSON(obj)) : []
    );
  }

  static fromMinimalJSON(json: any): Image {
    return new Image(
      json.id,
      `http://localhost:5000${json.imagePath}`,
      `http://localhost:5000${json.annotationsPath}`,
      json.city
    );
  }
}
