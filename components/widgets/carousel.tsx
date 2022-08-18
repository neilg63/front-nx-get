import useEmblaCarousel from 'embla-carousel-react';
import { useState, useEffect, useCallback } from "react";
import { MediaItem } from "../../lib/entity-data";
import { Image } from '@nextui-org/react';

const Carousel = ({items}: { items: MediaItem[] }) => {  
  const hasImages = items instanceof Array && items.length > 0;
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

  // set the id of the current slide to active id
  // we need it to correctly highlight it's corresponding
  // navigation dot.

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
  }, [embla, setSelectedIndex]);

  // make sure embla is mounted and return true operation's
  // can be only performed on it if it's successfully mounted.

  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on("select", onSelect);
  }, [embla, setScrollSnaps, onSelect]);
  return <div className="carousel-container" ref={emblaRef}>
        {hasImages && <section className="media-items flex">
        {items.map((item: MediaItem) => <figure key={item.uri} data-key={item.uri} data-dims={item.dims('medium')}>
          <Image srcSet={item.srcSet} src={item.medium} alt={item.alt} width='auto' height='100%' />
          <figcaption>{item.field_credit}</figcaption>
        </figure>)}
      </section>}
        <div className="slide-nav">
          <div className="flex items-center justify-center mt-5 space-x-2">
            {scrollSnaps.map((index, idx) => (
              <button
                className={`w-2 h-2 rounded-full ${
                  idx === selectedIndex ? "bg-yellow-500" : "bg-gray-300"
                }`}
                key={idx}
                onClick={() => scrollTo(idx)}>{ (idx +1 ).toString() }</button>
            ))}
          </div>
      </div>
  </div>
}

export default Carousel;