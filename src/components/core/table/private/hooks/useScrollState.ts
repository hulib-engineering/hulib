import type { RefObject, UIEvent } from 'react';
import { useEffect, useState } from 'react';

const useScrollState = (tableRef: RefObject<HTMLDivElement | null>) => {
  const [scrollState, setScrollState] = useState({
    scrolledToLeft: true,
    scrolledToRight: true,
  });

  useEffect(() => {
    const element = tableRef.current;
    if (!element) {
      return;
    }

    setScrollState(previous => ({
      ...previous,
      scrolledToRight:
        element.scrollLeft + element.clientWidth === element.scrollWidth,
    }));
  }, [tableRef]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const scrolledToLeft = target.scrollLeft === 0;
    const scrolledToRight
      = target.scrollLeft + target.clientWidth === target.scrollWidth;

    setScrollState((previous) => {
      if (
        scrolledToLeft === previous.scrolledToLeft
        && scrolledToRight === previous.scrolledToRight
      ) {
        return previous;
      }

      return { scrolledToLeft, scrolledToRight };
    });
  };

  return { scrollState, handleScroll };
};

export default useScrollState;
