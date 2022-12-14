import useEmblaCarousel from 'embla-carousel-react';
import { useState, useEffect, useCallback, useContext } from "react";
import { MediaItem } from "../../lib/entity-data";
import { Image, useModal, Modal } from '@nextui-org/react';
import { TopContext } from "../../pages/_app";
import AutoHeight from 'embla-carousel-auto-height'
import { setCarouselImageMaxHeight } from '../../lib/styles';

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


const Carousel = ({ items }: { items: MediaItem[] }) => {
  const numSlides = items instanceof Array ? items.length : 0;
  const { setVisible, bindings } = useModal();
  const context = useContext(TopContext);
  const hasSlides = numSlides > 0;
  const startCarousel = numSlides > 1;
  const pc = numSlides > 1 ? numSlides * 100 : 100;
  const sectionStyles = { width: `${pc}%` };

  const cls = ["carousel-container"];
  if (startCarousel) {
    cls.push("show-controls");
  }
  const classNames = cls.join(" ");
  const options = { destroyHeight: 'auto' } // Autoheight Option
  const pluginOpts = items.length > 1 ? [AutoHeight(options)] : [];
  const [emblaRef, embla] = useEmblaCarousel({
    align: "start",
    // aligns the first slide to the start
    // of the viewport else will align it to the middle.

    loop: true,
    // we need the carousel to loop to the
    // first slide once it reaches the last slide.

    skipSnaps: false,
    // Allow the carousel to skip scroll snaps if
    // it's dragged vigorously.

    inViewThreshold: 0.7,
    // percentage of a slide that need's to be visible
    // inorder to be considered in view, 0.7 is 70%.
  }, pluginOpts);
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const emptyScrollSnaps: number[] = [];
  const [scrollSnaps, setScrollSnaps] = useState(emptyScrollSnaps);

  // this function allow's us to scroll to the slide whose
  // id correspond's to the id of the navigation dot when we
  // click on it.

  const scrollTo = useCallback(
    (index: number) => embla && embla.scrollTo(index),
    [embla]
  );

  const manageScroll = (embla: any, numItems = 0, next = true) => {
    if (embla instanceof Object) {
      const ci = embla.selectedScrollSnap();
      const lastIndex = numItems - 1;
      if (next) {
        if (ci < lastIndex) {
          embla.scrollNext(true)
        } else {
          embla.scrollTo(0, true);
        }
      } else {
        if (ci > 0) {
          embla.scrollPrev(true)
        } else {
          embla.scrollTo(lastIndex, true);
        }
      }
    }
  }

  const scrollPrev = useCallback(
    () => manageScroll(embla, items.length, false),
    [embla, items]
  );

  const scrollNext = useCallback(
    () => manageScroll(embla, items.length, true),
    [embla, items]
  );

  // set the id of the current slide to active id
  // we need it to correctly highlight it's corresponding
  // navigation dot.

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
  }, [embla, setSelectedIndex]);

  // make sure embla is mounted and return true operation's
  // can be only performed on it if it's successfully mounted.

  const enlarge = () => {
    if (items.length > 0) {
      setVisible(true);
    }
  }

  const closeModal = () => {
    setVisible(false);
  }

  const toNextPrev = useCallback(() => {
    if (context) {
      const diff = context.move < 0 ? -1 : context.move > 0 ? 1 : 0;
      if (diff !== 0) {
        context.setMove(0);
        let targetIndex = selectedIndex + diff;
        const lastIndex = items.length - 1
        if (targetIndex < 0) {
          targetIndex = lastIndex;
        } else if (targetIndex > lastIndex) {
          targetIndex = 0;
        }
        //setSelectedIndex(targetIndex); 
        if (diff < 0) {
          embla?.scrollPrev();
        } else {
          embla?.scrollNext();
        }
        setSelectedIndex(targetIndex);
      }
    }
  }, [embla, context, selectedIndex, setSelectedIndex, items])

  const selectedItem = (): MediaItem => {
    const item = selectedIndex < items.length ? items[selectedIndex] : items.length > 0 ? items[0] : null;
    if (item instanceof MediaItem) {
      return item;
    } else {
      return new MediaItem();
    }
  }

  useEffect(() => {
    const refEl = document.querySelector('.carousel-container');
    if (refEl instanceof HTMLElement && embla instanceof Object) {
      const selIndex = embla.selectedScrollSnap();
      setCarouselImageMaxHeight(refEl, selIndex, window);
      setTimeout(() => {
        setCarouselImageMaxHeight(refEl, selIndex, window);
          setTimeout(() => {
            setCarouselImageMaxHeight(refEl, selIndex, window);
        }, 750);
      }, 500);
    }
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on("select", onSelect);

    if (context) {
      toNextPrev();
    }
    setTimeout(() => {
      embla.reInit();
    }, 375);
  }, [embla, onSelect, context, toNextPrev, selectedIndex, items]);
  return <>
    <div className={classNames} ref={emblaRef}>
      {hasSlides && <section className="media-items flex" style={sectionStyles}>
            {items.map((item: MediaItem) => <figure key={item.uri} data-dims={item.dims('medium')}>
              <Image srcSet={item.srcSet} src={item.medium} alt={item.alt} width='auto' height='100%' objectFit='contain' css={ item.calcAspectStyle() } />
              <figcaption>{item.field_credit}</figcaption>
            </figure>)}
      </section>}
      {startCarousel && <>
        <div className="control prev icon-prev-arrow-wide" onClick={() => scrollPrev()}></div>
        <div className="control next icon-next-arrow-wide" onClick={() => scrollNext()}></div>
        <div className="slide-nav">
          {scrollSnaps.map((_, idx) => (
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