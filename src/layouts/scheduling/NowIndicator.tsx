import type { CSSProperties } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { format } from 'date-fns';

/** Helper: compute offsetTop of `el` relative to `ancestor` by walking offsetParent */
function offsetTopRelative(el: HTMLElement, ancestor: HTMLElement) {
  let top = 0;
  let cur: HTMLElement | null = el;
  // walk up offsetParent chain until we hit ancestor (or null)
  while (cur && cur !== ancestor) {
    top += cur.offsetTop;
    cur = cur.offsetParent as HTMLElement | null;
  }
  return top;
}

type IndicatorStyle = {
  line: CSSProperties;
  label: CSSProperties;
  time: string;
};

export default function NowIndicator({
  containerRef,
  minTime,
  maxTime,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
  minTime: Date;
  maxTime: Date;
}) {
  const rafRef = useRef<number | null>(null);

  const [style, setStyle] = useState<CSSProperties | null>(null);
  const [labelStyle, setLabelStyle] = useState<CSSProperties | null>(null);
  const [now, setNow] = useState(new Date());
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(t);
  }, []);
  // find .rbc-time-content once the container mounts
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const content = containerRef.current.querySelector<HTMLElement>('.rbc-time-content');
    if (content) {
      // ensure the portal target is positioned so absolute children align
      if (getComputedStyle(content).position === 'static') {
        content.style.position = 'relative';
      }
      setTarget(content);
    }
  }, [containerRef]);

  // compute style based on the existing RBC indicator when available
  const computeStyle = useCallback((): IndicatorStyle | null => {
    if (!target) {
      return null;
    }
    const content = target;

    const minMinutes = minTime.getHours() * 60 + minTime.getMinutes();
    const maxMinutes = maxTime.getHours() * 60 + maxTime.getMinutes();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    if (nowMinutes < minMinutes || nowMinutes > maxMinutes) {
      return null;
    }

    const gutter = content.querySelector<HTMLElement>('.rbc-time-gutter');
    const left = gutter ? gutter.offsetWidth : 0;
    const width = Math.max(0, content.scrollWidth - left);

    // try to mirror RBC indicator first
    const existing = content.querySelector<HTMLElement>('.rbc-current-time-indicator');
    let top: number;
    if (existing) {
      top = offsetTopRelative(existing, content);
    } else {
      // fallback ratio
      const ratio = (nowMinutes - minMinutes) / (maxMinutes - minMinutes);
      top = ratio * content.scrollHeight;
    }

    return {
      line: {
        position: 'absolute',
        top: `${top}px`,
        left: `${left - 10}px`,
        width: `${width + 10}px`,
        borderTop: '2px dashed #0442BF',
        pointerEvents: 'none',
        zIndex: 999,
      },
      label: {
        position: 'absolute',
        top: `${top - 10}px`, // shift up a bit to center
        left: `10px`,
        width: `${left - 20}px`, // fit inside gutter
        fontSize: '11px',
        color: 'white',
        fontWeight: 600,
        borderRadius: '12px',
        border: '1px solid #0442BF',
        background: '#0442BF', // optional: to keep visible
        padding: '4px 10px',
        zIndex: 999,
      },
      time: format(now, 'H\'h\'mm'),
    };
  }, [target, minTime, maxTime, now]);

  useEffect(() => {
    if (!target) {
      setStyle(null);
      setLabelStyle(null);
      return;
    }
    const update = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        const indicator = computeStyle();
        if (indicator) {
          setStyle(indicator.line);
          setLabelStyle(indicator.label);
        }
      });
    };

    update();

    const onResize = () => update();
    window.addEventListener('resize', onResize);
    // scroll inside content should also update
    target.addEventListener('scroll', onResize);

    // observe DOM changes (RBC may insert indicators later)
    const mo = new MutationObserver(() => update());
    mo.observe(target, { subtree: true, childList: true, attributes: true });

    return () => {
      window.removeEventListener('resize', onResize);
      target.removeEventListener('scroll', onResize);
      mo.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, now, minTime.getTime(), maxTime.getTime(), computeStyle]);

  if (!target || !style || !labelStyle) {
    return null;
  }

  return createPortal(
    <>
      <div style={style} />
      <div style={labelStyle}>{computeStyle()?.time}</div>
    </>,
    target,
  );
}
