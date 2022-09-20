import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'next-share';
import { MetaDataSet } from '../../lib/ui-entity';
import { basePath } from '../../lib/settings';
import labels from '../../lib/labels';

export const ShareWidget = ({ meta }: { meta: MetaDataSet }) => { 
  const url = `${basePath}${meta.path}`;
  const title = meta.title;
  const size = 20;
  return <nav className='share-widget row'>
    <h4><span className='text-label'>{labels.share}</span><i className='icon icon-next-arrow-narrow'></i></h4>
    <div className='share-icons'>
      <FacebookShareButton
      url={url}
      quote={meta.title}
      hashtag={'#gavinturk'}
      ><FacebookIcon size={size} round /></FacebookShareButton>
      <TwitterShareButton
        url={url}
        title={title}
      >
        <TwitterIcon size={size} round />
      </TwitterShareButton>
    </div>
  </nav>

}