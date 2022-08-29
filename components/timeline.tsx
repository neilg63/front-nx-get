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
import { containerProps } from "../lib/styles";
import AboutNav from "./widgets/about-nav";
import TimelineItem from "./widgets/timeline-item";
import { notEmptyString, validDateString } from "../lib/utils";
import MediaFigure from "./widgets/media-figure";

const Timeline: NextPage<BaseEntity> = (data: any = null) => { 
  const pageData = useMemo(() => new CompoundPageDataSet(data), [data]);
  const [hasSelectedItem, setHasSelectedItem] = useState(false);
  const [node, setNode] = useState(new NodeEntity(null));
  const { items, meta } = pageData;
  const selectedRef = (data instanceof Object && data.selected) ? data.selected : '';
  const hasItems = items.length > 0;
  useEffect(() => {
    const validSelectedDate = notEmptyString(selectedRef) ? validDateString(selectedRef) : false;
    const matchedNode = hasItems ? validSelectedDate ? items.find(item => item.path.endsWith(selectedRef)) : items[0] : null;
    if (matchedNode instanceof NodeEntity) {
      setNode(matchedNode);
    }
    setHasSelectedItem(matchedNode instanceof NodeEntity && matchedNode.nid > 0);
  }, [hasSelectedItem, node, hasItems, selectedRef, items]);
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='timeline-main'>
      <AboutNav current='/about/timeline' />
      <section className="timeline-item-container full-width">
        <h2 className='section-header'>Timeline</h2>
        <div className='timeline-items'>
          <section className='timeline-holder row'>
            {hasItems && items.map((item: NodeEntity, index: number) => <TimelineItem node={item} key={ ['item.uuid', index].join('-') }  />)}
          </section>
        </div>
      </section>

        {hasSelectedItem && node.nid > 0 && <article className='timeline-details'>
          <h3>{node?.title}</h3>
          <MediaFigure item={node.firstImage} size='large' width='100%' height='auto' objectFit='contain' />
          <p>{shortDate(node.field_date)}</p>
            <p>{parse(node.body)}</p>
        </article>}
    </Container>
  </>
}

export default Timeline;