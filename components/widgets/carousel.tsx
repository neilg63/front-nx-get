import { useState, useEffect, useCallback, useContext, useRef } from "react";
import { MediaItem } from "../../lib/entity-data";
import { Image, useModal, Modal } from '@nextui-org/react';
import { TopContext } from "../../pages/_app";
import { useRouter } from "next/router";
// import { setCarouselImageMaxHeight } from '../../lib/styles';

const ModalFigure = ({ item }: { item: MediaItem }) => {
  const alt = item.alt || '';
  return <figure>
    <Image src={item.large} srcSet={item.srcSet} alt={ alt } width='auto' height='100%' objectFit='contain' />
    <figcaption>
      <h4 className='media-title'>{ item.caption }</h4>
      {item.hasCredits && <p className='credits'>{ item.field_credits }</p>}
    </figcaption>
    </figure>
}

const numSlidesToContainerWidth = (numSlides = 0):string =>  {
  const pc = numSlides > 1 ? numSlides * 100 : 100;
  return `${pc}%`;
}

const indexToLeftOffset = (index = 0, numSlides = 0):string =>  {
  const ti = (index + numSlides) % numSlides;
  const pc = 0 - (ti * 100);
  return `${pc}%`;
}


const Carousel = ({ items }: { items: MediaItem[] }) => {
  const initialised = useRef(false);
  const numSlides = items instanceof Array ? items.length : 0;
  const { setVisible, bindings } = useModal();
  const context = useContext(TopContext);
  const hasSlides = numSlides > 0;
  const startCarousel = numSlides > 1;
  const width = numSlidesToContainerWidth(numSlides);
  const [sectionStyles, setSectionStyles] = useState({ width, left: '0%'});
  const cls = ["carousel-container"];
  if (startCarousel) {
    cls.push("show-controls");
  }
  const classNames = cls.join(" ");
 
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const scrollTo = useCallback(
    (index: number) => {
      if (index >= 0) {
        const numSlides = items.length;
        const ti = (index + numSlides) % numSlides;
        const styles = { ...sectionStyles};
        styles.width = numSlidesToContainerWidth(numSlides);
        styles.left = indexToLeftOffset(ti, numSlides);
        setSectionStyles(styles);
        setSelectedIndex(ti);
      }
    },
    [items, sectionStyles, setSectionStyles]
  );

  const enlarge = () => {
    if (items.length > 0) {
      setVisible(true);
    }
  }

  const closeModal = () => {
    setVisible(false);
  }

  const toNextPrev = useCallback((nextMode = true) => {
    if (context) {
      const diff = nextMode ? 1 : - 1;
      const numSlides = items.length;
      const targetIndex = (selectedIndex + diff + numSlides) % numSlides;
      const styles = {...sectionStyles};
      styles.width = numSlidesToContainerWidth(numSlides);
      styles.left = indexToLeftOffset(targetIndex, numSlides);
      setSectionStyles(styles);
      setSelectedIndex(targetIndex);
    }
  }, [sectionStyles, setSectionStyles, context, selectedIndex, setSelectedIndex, items]);

  const scrollPrev = () => toNextPrev(false)

  const scrollNext = () => toNextPrev(true)

  const selectedItem = (): MediaItem => {
    const item = selectedIndex < items.length ? items[selectedIndex] : items.length > 0 ? items[0] : null;
    if (item instanceof MediaItem) {
      return item;
    } else {
      return new MediaItem();
    }
  }
  
  useEffect(() => {
    if (!initialised.current) {
      scrollTo(0);
    }
    router.events.on('routeChangeComplete', () => {
      scrollTo(0);
    });
    if (context) {
      if  (context.move !== 0) {
        toNextPrev(context.move > 0);
      }
    }
    return () => {
      initialised.current = true
    }
  }, [context, router, toNextPrev, scrollTo]);
  return <>
    <div className={classNames}>
      {hasSlides && <section className="media-items flex" style={sectionStyles}>
            {items.map((item: MediaItem) => <figure key={item.uri} data-dims={item.dims('medium')} style={ item.addAspectStyle() }>
              <Image srcSet={item.srcSet} src={item.medium} alt={item.alt} width='auto' height='100%' objectFit='contain' css={ item.calcAspectStyle() } />
              {item.hasCredits && <figcaption>
                {item.field_credit}
              </figcaption>}
            </figure>)}
      </section>}
      {startCarousel && <>
        <div className="control prev icon-prev-arrow-wide" onClick={() => scrollPrev()}></div>
        <div className="control next icon-next-arrow-wide" onClick={() => scrollNext()}></div>
        <div className="slide-nav">
          {items.map((_, idx) => (
            <button
              className={`${
                idx === selectedIndex ? "active" : "inactive"
              }`}
              key={idx}
              onClick={() => scrollTo(idx)} />
          ))}
        </div>
      </>}
      <div className="enlarge-trigger middle" onClick={() => enlarge()} title='Enlarge'></div>
      <div className="enlarge-trigger bottom icon icon-enlarge2" onClick={() => enlarge()}></div>
    </div>
     <Modal
      scroll={ false }
        width="100%"
        aria-labelledby="modal-title"
      aria-describedby="modal-description"
              fullScreen={true}
      {...bindings}
      className="image-fullscreen"
    >
      {startCarousel && <div className='control mid-left icon-prev-arrow-wide' onClick={e => scrollPrev()}></div>}
      {startCarousel && <div className='control mid-right icon-next-arrow-wide' onClick={e => scrollNext()}></div>}
      <div className='control top-right icon-close' onClick={e => closeModal()}></div>
      <ModalFigure item={ selectedItem() } />
      </Modal>
  </>
}

export default Carousel;