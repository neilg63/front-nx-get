import { getResource, JsonApiResource } from "next-drupal";
import { isObjectWithObject } from "./utils";

export class PathItem {
  path = "";
  type = "";
  uuid = "";

  constructor(inData: any = null) {
    if (isObjectWithObject(inData, "attributes")) {
      const { alias } = inData.attributes;
      this.path = alias;
    }
  }

  get parts(): string[] {
    const basePath = this.path.startsWith("/") ? this.path.substring(1) : this.path;
    return  basePath.split("/");
  }

  get section(): string {
    return this.parts.length > 0 ? this.parts[0] : '';
  }

}

export const fetchFileItem = async (imgId = '', refType = 'file--file'): Promise<JsonApiResource | null> => {
  let item = null;
  const refKey = refType.split('--').pop();
  await getResource(refType, imgId).then (result => {
    item = result;
  })
  .catch(e => {
    if (e) {
      console.log(`${refKey}/${imgId} not found`);
    }
  });
  return item;
}