import type { GetStaticPathsContext, GetStaticPathsResult, GetStaticProps, GetStaticPropsContext } from 'next'
import { fetchNodeEntity } from '../../lib/entity-data';
import { matchContextualPaths } from '../../lib/match-paths';
import ExhibitionPage from '../../components/exhibition-page';
import { getSiteInfo } from '../../lib/api-view-results';

export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult> {
  const sections = ['exhibitions'];
  const paths = await matchContextualPaths(sections, context, 'simple');
  return {
    paths,
    fallback: "blocking",
  }
}


export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const path = ['/exhibitions', context.params?.slug].join('/')
  const entity = await fetchNodeEntity('exhibition', path, 'path');
  const site = await getSiteInfo();
  return {
    props: {
      entity,
      site
    },
  }
}

export default ExhibitionPage;