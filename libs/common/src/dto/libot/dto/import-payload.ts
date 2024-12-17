import { ImportAttributes } from "../../map/dto/importAttributes.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Feature, FeatureCollection, Polygon } from '@turf/turf';


export class Webhook {

  @ApiProperty({ required: false })
  events: string[];

  @ApiProperty({ required: false })
  url: string;
}

export class Roi {
  @ApiProperty({ required: false })
  type: string;
  
  @ApiProperty({ required: false })
  features: Feature[];
}
export class ImportPayload {

  @ApiProperty({ required: false })
  catalogRecordID: string;

  @ApiProperty({ required: false })
  domain: string = "RASTER";

  @ApiProperty({ required: false })
  artifactCRS: string = "4326";

  @ApiProperty({ required: false })
  webhook: Webhook[];

  @ApiProperty({ required: false })
  ROI: FeatureCollection<Polygon>;

  @ApiProperty({ required: false , type: Roi})
  description: string;

  @ApiProperty({ required: false })
  keywords: { [key: string]: string };

  @ApiProperty({ required: false })
  parameters: { [key: string]: string };

  static fromImportAttrs(attrs: ImportAttributes): ImportPayload {
    const importPayload = new ImportPayload()
    importPayload.catalogRecordID = attrs.product.id
    importPayload.webhook = [
      {
        events: ["TASK_COMPLETED", "TASK_FAILED"],
        url: process.env.LIBOT_CALLBACK_URL
      }
    ]
    importPayload.ROI = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            maxResolutionDeg: attrs.targetResolution,
            minResolutionDeg: attrs.minResolutionDeg
          },
          geometry: attrs.Polygon.geometry
        }
      ]
    }
    importPayload.description = `Export request for prodID: ${attrs.product.id} points: [${attrs.Points}] resolution: ${attrs.targetResolution}`
    return importPayload
  }

  toString(): string {
    return JSON.stringify(this);
  }

}








