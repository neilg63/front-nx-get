import { useRouter } from "next/router";
import { useCallback } from "react";
import { PageDataSet } from "../../lib/entity-data"
import labels from "../../lib/labels";


const LoadMoreNav = ({ data, maxScrollPages }: { data: PageDataSet, maxScrollPages: number }) => {
  const router = useRouter();
  const loadNextPrev = useCallback((forward = true) => {
    const currPath = router.asPath.split('?').shift();
    const nextPage = forward ? data.page + 1 : data.page - 1;
    const nextPageNum = nextPage + 1;
      router.push(currPath + '?page=' + nextPageNum);
      data.page = nextPage;
  }, [data, router]);
  return <nav className='listing-nav row'>
    {data.mayLoadPrevious && <span className='nav-link prev' title={data.prevPageOffset(maxScrollPages).toString()} onClick={() => loadNextPrev(false)}><i className='icon icon-prev-arrow-narrow prev'></i>{ labels.load_newer}</span>}
    <span className='text-label' onClick={() => loadNextPrev(data.mayLoadMore)}>{data.listingInfo} </span>
    {data.mayLoadMore && <span className='nav-link next' title={data.nextPageOffset.toString()} onClick={() => loadNextPrev(true)}>{ labels.load_older}<i className='icon icon-next-arrow-narrow next'></i></span>}
  </nav>
}

LoadMoreNav.defaultProps = {
  maxScrollPages: 1
};

export default LoadMoreNav;