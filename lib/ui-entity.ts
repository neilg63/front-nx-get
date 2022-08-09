import { DrupalNode, JsonApiResource } from "next-drupal";
import { mergeNestedFieldEntities } from "./taxonomy-data";
import { notEmptyString } from "./utils";

const coreFields = [
  'id',
  'type',
  'langcode',
  'status',
  'title',
  'created',
  'changed',
  'promote',
  'sticky',
  'path',
  'body'
];

const coreFieldProps = [
  'id',
  'name',
  'value',
  'type',
  'end_value',
  'alias',
  'created'
];

const cleanFieldObj = (field: any = null, fieldKey = '') => {
  const entries: any[] = [];
  if (field instanceof Object) {
    Object.entries(field).forEach(([key, value]) => {
      if (coreFieldProps.includes(key) || key.startsWith('field_')) {
        entries.push([key, value]);
      }
    });
  }
  if (entries.some(entry => entry[0] === 'type' && entry[1] === 'media--image')) {
    //entries.push(['styles', toImageStyles(Object.fromEntries(entries), mediaItems)]);
    if (field.thumbnail instanceof Object) {
      const { resourceIdObjMeta } = field.thumbnail;
      if (resourceIdObjMeta) {
        const { alt, title, width, height } = resourceIdObjMeta;
        entries.push(['alt', alt]);
        entries.push(['title', title]);
        entries.push(['width', width]);
        entries.push(['height', height]);
      }
    }
  }
  return Object.fromEntries(entries);
}

const cleanField = (field: any = null, key = '') => {
  if (field instanceof Array) {
    return field.map(obj => cleanFieldObj(obj, key));
  } else if (field instanceof Object) {
    return cleanFieldObj(field, key);
  } else {
    return field;
  }
}

const imageStyles = [
  'max_650x650',
  'max_1300x1300',
  'max_2600x2600'
]

/* const composeImageStyle = (attrs: any = null, style = 'max_2600x2600', mediaItems: JsonApiResource[] = []): string => {
  let uri = '';
  if (attrs instanceof Object) {
    if (attrs.name) {
      const sub = attrs.created.split('-').slice(0,2).join('-');
      uri = [process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,'files', 'styles', style, 'public', sub, attrs.name].join('/');
    }
  }
  return uri;
} */

export interface MetaDataSet {
  title: string;
  description: string;
  image?: string;
}

export interface ImageStyleAttrs { 
  uri: string;
  size: string;
}

const toImageStyles = (attrs: any = null): ImageStyleAttrs[] => {
  let styles:ImageStyleAttrs[] = [];
  if (attrs instanceof Object) {
    
    if (attrs.field_media_image) {
      const file = attrs.field_media_image;
      if (file instanceof Object && file.image_style_uri instanceof Object) {
        styles = Object.entries(file.image_style_uri).map(([key, value]) => {
          const size = key.split('_').pop()?.split('x').shift() + 'w';
          const uri = typeof value === 'string'? value : '';
          return { 
            uri,
            size
          }
        })
      }
    }
  }
  return styles;
}

const toImageSrcSetFromAttrs = (imgs: ImageStyleAttrs[]) => {
  return imgs.map(img => [img.uri, img.size].join(' ')).join(', ');
}

const toImageSrcFromAttrs = (imgs: ImageStyleAttrs[]) => {
  return imgs.length > 0 ? imgs[0].uri : '';
}

export const toImageSrcSet = (row: any = null) => {
  const imgs = toImageStyles(row);
  return imgs.map(img => [img.uri, img.size].join(' ')).join(', ');
}

export const toImageSrc = (row: any = null) => {
  const imgs = toImageStyles(row);
  return imgs.length > 0 ? imgs[0].uri : '';
}

export const hasPreviewImage = (item: JsonApiResource) => {
  const keys = Object.keys(item);
  if (keys.includes('field_images')) {
    return item.field_images.length > 0;
  }
  if (keys.includes('field_media')) {
    return item.field_media instanceof Object;
  }
  return false;
}

export const extractFromImageStyles = (styleMap: any = null, style = 'max_650x650'): string  => {
  const keys = styleMap instanceof Object ? Object.keys(styleMap) : [];
  if (keys.includes(style)) {
    return styleMap[style];
  } else if (keys.length > 0) {
    return styleMap[keys[0]];
  }
  return '';
}

export const extractPreviewImageFromField = (item: any = null): string => {
  const keys = item instanceof Object ? Object.keys(item) : [];
  if (keys.includes('field_media') && item.field_media instanceof Object) {
    return extractFromImageStyles(item.field_media.image_style_uri);
  }
  if (keys.includes('image_style_uri')) {
    return extractFromImageStyles(item.image_style_uri);
  }
  return '';
}

export const extractPreviewImage = (item: JsonApiResource): string => {
  const keys = Object.keys(item);
  if (keys.includes('field_images')) {
    return extractPreviewImageFromField(item.field_images[0]);
  }
  if (keys.includes('field_media')) {
    const mediaItem = item.field_media instanceof Array && item.field_media.length > 0 ? item.field_media[0] : item.field_media;
    return extractPreviewImageFromField(mediaItem);
  }
  return '';
}

export const buildUIEntity = async (node: DrupalNode): Promise<JsonApiResource> => {
  const entity = await mergeNestedFieldEntities(node, true);
  const entries: any[] = [];
  const baseObj = { id: '', type: '', langcode: '', status: false, title: '', body: { value: ''} };
  if (entity instanceof Object) {
    Object.entries(entity).forEach(([key, values]) => {
      if (coreFields.includes(key) || key.startsWith('field_')) {
        const parsedVal = cleanField(values, key);
        entries.push([key, parsedVal])
      }
    });
  }
  const result = Object.fromEntries(entries);
  return { ...baseObj, ...result } as JsonApiResource;
}


export const extractMeta = (entity: JsonApiResource | undefined): MetaDataSet => {
  let title = '';
  let description = '';
  let image = '';
  if (entity instanceof Object) {
    if (entity.title) {
      title = entity.title;
    }
    if (entity.text) {
      description = entity.text;
    }
    const refImg = extractPreviewImage(entity);
    if (notEmptyString(refImg, 4)) {
      image = refImg;
    }
  }
  return { title, description, image };
}
