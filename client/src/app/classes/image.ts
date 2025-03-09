import { Annotation } from "./annotation";

export class Image {
  constructor(
    public id: string,
    public filePath: string,
    public city: string,
    public width: number,
    public height: number,
    public annotations?: Annotation[]
  ) {
    this.id = id;
    this.filePath = filePath;
    this.city = city;
    this.width = width;
    this.height = height;
    this.annotations = annotations;
  }
}
