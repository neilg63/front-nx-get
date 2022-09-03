import useEmblaCarousel from 'embla-carousel-react';
import { useState, useEffect, useCallback } from "react";
import { MediaItem } from "../../lib/entity-data";
import { Image, useModal, Modal } from '@nextui-org/react';
import { ImgAttrs } from '../../lib/interfaces';


const Carousel = ({ items }: { items: MediaItem[] }) => {
  const numSlides = items instanceof Array && items.length;
  const { setVisible, bindings } = useModal();
  const hasSlides = numSlides > 0;
  const startCarousel = numSlides > 1;

  const cls = ["carousel-container"];
  if (startCarousel) {
    cls.push("show-controls");
  }
  const classNames = cls.join(" ");

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
  });

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

  const scrollPrev = useCallback(
    () => embla && embla.scrollPrev(),
    [embla]
  );

  const scrollNext = useCallback(
    () => embla && embla.scrollNext(),
    [embla]
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

  const selectedImgAttrs = (): ImgAttrs => {
    const item = selectedIndex < items.length ? items[selectedIndex] : items.length > 0 ? items[0] : null;
    if (item instanceof MediaItem) {
      return {
        srcSet: item.srcSet,
        src: item.large,
        alt: item.alt || '--'
      }
    } else {
      return { srcSet: '', src: '', alt: '--'}
    }
  }

  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on("select", onSelect);
    setTimeout(() => {
      embla.reInit();
    }, 375)
  }, [embla, setScrollSnaps, onSelect]);
  return <>
    <div className={classNames} ref={emblaRef}>
      {hasSlides && <section className="media-items flex">
            {items.map((item: MediaItem) => <figure key={item.uri} data-key={item.uri} data-dims={item.dims('medium')}>
              <Image srcSet={item.srcSet} src={item.medium} alt={item.alt} width='auto' height='100%' />
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
      <div className="enlarge-trigger icon icon-enlarge2" onClick={() => enlarge()}></div>
    </div>
     <Modal
      scroll={ false }
        width="100%"
        aria-labelledby="modal-title"
      aria-describedby="modal-description"
      closeButton={true}
              fullScreen={true}
        {...bindings}
    >
      <div className='control icon-prev-arrow-wide prev' onClick={e => closeModal()}></div>
        <Image {...selectedImgAttrs()} width='auto' height='100%' objectFit='contain' />
      </Modal>
  </>
}

export default Carousel;