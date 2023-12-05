import {
  FacebookShareButton,
  TwitterShareButton,
  PinterestShareButton,
  EmailShareButton,
} from 'next-share';
import { MetaDataSet } from '../../lib/ui-entity';
import { basePath } from '../../lib/settings';
import labels from '../../lib/labels';

export const ShareWidget = ({ meta }: { meta: MetaDataSet }) => { 
  const url = `${basePath}${meta.path}`;
  const { title, image, description } = meta;
  return <nav className='share-widget row'>
    <h4><span className='text-label'>{labels.share}</span><i className='icon icon-next-arrow-narrow'></i></h4>
    <div className='share-icons'>
      <FacebookShareButton
      url={url}
      quote={title}
      hashtag={'#gavinturk'}
      >
        <i className='icon icon-facebook-f'></i>
      </FacebookShareButton>
      <TwitterShareButton
        url={url}
        title={title}
      >
        <i className='icon icon-x'></i>
      </TwitterShareButton>
       <EmailShareButton
        url={url}
        subject={title}
        body={ description }>
          <i className='icon icon-email'></i>
      </EmailShareButton>
      <PinterestShareButton
        url={url}
        media={image}
      >
        <i className='icon icon-pinterest'></i>
      </PinterestShareButton>
     
    </div>
  </nav>

}