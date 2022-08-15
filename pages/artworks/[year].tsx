import type { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { fetchApiViewResults } from '../../lib/api-view-results';
import ArtworkList from '../../components/artwork-list';
import { isNumeric, notEmptyString } from '../../lib/utils';


export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const yearRef = context.params?.year;
  let y = 0;
  let first = 'artworks';
  let second = '';
  if (isNumeric(yearRef) && yearRef.length === 4) {
    y = typeof yearRef === 'string' ? parseInt(yearRef, 10) : typeof yearRef === 'number' ? yearRef : 0;
    if (y < 1960) {
      y = new Date().getFullYear();
    }
  }
  if (y < 1960 && notEmptyString(yearRef, 2)) {
    first = yearRef.startsWith('tag--') || yearRef.startsWith('tags--')? 'artworks-by-tag' : 'artworks-by-type';
    second = yearRef.includes('--')? yearRef.split('--').pop() : yearRef;
  } else {
    second = y.toString();
  }
  const uri = [first, second].join('/');
  const pageData = await fetchApiViewResults(uri);
  return {
    props: {
      ...pageData
    },
  }
}

export default ArtworkList;