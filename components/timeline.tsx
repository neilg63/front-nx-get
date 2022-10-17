import { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import parse from "html-react-parser";
import { BaseEntity } from "../lib/interfaces";
import { CompoundPageDataSet, NodeEntity } from "../lib/entity-data";
import { mediumDate, shortDate } from "../lib/converters";
import labels from "../lib/labels";
import Head from "next/head";
import SeoHead from "./layout/head";
import { Container } from "@nextui-org/react";
import { containerProps, timelineItemWidth } from "../lib/styles";
import AboutNav from "./widgets/about-nav";
import TimelineItem from "./widgets/timeline-item";
import { notEmptyString, validDateString } from "../lib/utils";
import MediaFigure from "./widgets/media-figure";
import Link from "next/link";
import { bundleName } from "../lib/content-types";

const defaultTimeHolderStyles = { width: '10000%', left: 0 };

const calcTimelineStyles = (num: number, offset: number) => {
  if (num > 3) {
    const totalPx = timelineItemWidth * num;
    const leftPx = 0 - (timelineItemWidth * offset);
    return { width: `${totalPx}px`, left: `${leftPx}px`  }
  } else {
    return defaultTimeHolderStyles;
  }
}

const Timeline: NextPage<BaseEntity> = (data: any = null) => { 
  const pageData = useMemo(() => new CompoundPageDataSet(data), [data]);
  const [hasSelectedItem, setHasSelectedItem] = useState(false);
  const [offset, setOffset] = useState(0);
  const [navClasses, setNavClasses] = useState('timeline-dir-nav');
  const [node, setNode] = useState(new NodeEntity(null));
  const { items, meta } = pageData;
  const selectedRef = (data instanceof Object && data.selected) ? data.selected : '';
  const hasItems = items.length > 0;

  const goPrev = () => {
    if (offset > 0) {
      setOffset(offset  - 1)
    } 
  }

  const goNext = () => {
    if (offset < (items.length - 1)) {
      setOffset(offset + 1)
    } 
  }

  useEffect(() => {
    const buildNavClasses = () => {
      const cls = ['timeline-dir-nav'];
      if (items.length > 0) {
        if (offset > 0) {
          cls.push('show-prev');
        }
        const contEl = document.querySelector('timeline-items');
        const width = contEl instanceof HTMLElement ? contEl.clientWidth : 1200;
        const numVisibleItems = Math.ceil(width / timelineItemWidth) - 1;
        const maxRight = items.length - 1 - numVisibleItems;
        if (offset < maxRight) {
          cls.push('show-next');
        }
      }
      return cls.join(' ');
    }
    const validSelectedDate = notEmptyString(selectedRef) ? validDateString(selectedRef) : false;
    const matchedNode = hasItems ? validSelectedDate ? items.find(item => item.path.endsWith(selectedRef)) : items[0] : null;
    if (matchedNode instanceof NodeEntity) {
      setNode(matchedNode);
    }
    setHasSelectedItem(matchedNode instanceof NodeEntity && matchedNode.nid > 0);
    setNavClasses(buildNavClasses());
    
  }, [hasSelectedItem, node, hasItems, selectedRef, items, navClasses, offset]);
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='timeline-main'>
      <AboutNav current='/about/timeline' />
      <section className="timeline-item-container full-width">
        <div className='timeline-items'>
          <section className='timeline-holder row' style={ calcTimelineStyles(items.length, offset) }>
            {hasItems && items.map((item: NodeEntity, index: number) => <TimelineItem node={item} selected={ node.nid }  key={ ['item.uuid', index].join('-') }  />)}
          </section>
          <nav className={navClasses}>
            <i className='icon icon-prev-arrow-narrow prev' onClick={() => goPrev()}></i>
            <i className='icon icon-next-arrow-narrow next' onClick={() => goNext()}></i>
          </nav>
        </div>
      </section>

        {hasSelectedItem && node.nid > 0 && <article className='timeline-details grid-2'>
          
        <MediaFigure item={node.firstImage} size='large' width='100%' height='auto' objectFit='contain' />
        <div className='text-details'>
          <h3 className='timeline-title'>{node?.title}</h3>
          <p className='date'>{shortDate(node.field_date)}</p>
          <div className='body'>{parse(node.body)}</div>
          {node.hasRelatedContent && <ul className='related-content'>
            {node.field_related_content.map((item: NodeEntity) => <li key={['related', node.nid, item.nid].join('-') }>
                <h4>
                  <Link href={item.path}>{item.title}</Link>
                  <em>{bundleName(item.bundle )}</em>
                </h4>
            </li>)
            }
          
          </ul>}
        </div>
        </article>}
    </Container>
  </>
}

export default Timeline;