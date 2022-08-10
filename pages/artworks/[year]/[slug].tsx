import type { GetStaticPathsContext, GetStaticPathsResult, GetStaticProps, GetStaticPropsContext } from 'next'
import { fetchNodeEntity } from '../../../lib/entity-data';
import { matchContextualPaths } from '../../../lib/match-paths';
import ArtworkPage from '../../../components/artwork-page';
import { getSiteInfo } from '../../../lib/api-view-results';

export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult> {
  const sections = ['artwork'];
  const paths = await matchContextualPaths(sections, context, 'y');
  return {
    paths,
    fallback: "blocking",
  }
}


export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const path = ['/artworks', context.params?.year, context.params?.slug].join('/')
  const entity = await fetchNodeEntity('artwork', path, 'path');
  const site = await getSiteInfo();
  return {
    props: {
      entity,
      site
    },
  }
}

export default ArtworkPage;