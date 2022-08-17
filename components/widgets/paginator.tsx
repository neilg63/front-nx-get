import { Pagination } from '@nextui-org/react';
import { NextRouter, useRouter } from 'next/router';
import { PageDataSet } from '../../lib/entity-data';

const goToPaginated = (page: number, base: string, router: NextRouter) => {
  const href = `${base}?page=${page}`;
  router.push(href);
}

const Paginator = ({pageData, maxLinks}: {pageData: PageDataSet, maxLinks: number}) => {
  const maxSiblings = Math.floor(maxLinks / 2);
  const { page, perPage, total, meta } = pageData;
  const numPages = Math.ceil(total / perPage);
  const pageNum = page + 1;
  const basePath = pageData.meta.path;
  const router = useRouter();
  return (
    <Pagination total={numPages} initialPage={pageNum} onChange={page => goToPaginated(page, basePath, router)} siblings={maxSiblings} rounded={false} />
  );
}

export default Paginator;