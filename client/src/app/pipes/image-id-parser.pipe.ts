import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageIdParser'
})
export class ImageIdParserPipe implements PipeTransform {
  transform(imageId: string, city: string): string {
    if (!imageId || !city) return imageId;

    let cleanId = imageId.replace(`${city.toLowerCase()}_`, ''); // This part removes the city part of the id

    const parts = cleanId.split('_');

    if (parts.length !== 2) return imageId;

    const sceneNumber = parseInt(parts[0], 10);
    const imageNumber = parseInt(parts[1], 10);

    // Parsing format: ID #<sceneNumber>-<imageNumber>
    return `ID #${sceneNumber}-${imageNumber}`;
  }
}
