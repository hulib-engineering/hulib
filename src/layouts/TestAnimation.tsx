'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Page() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector('.scroll-section');
    const textSpan = section?.querySelector('.reveal-text');

    if (!textSpan) {
      return;
    }

    const text = textSpan.textContent || '';
    textSpan.textContent = '';

    // Split text into characters, keeping spaces visible
    text.split('').forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char; // non-breaking space
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      span.style.filter = 'blur(4px)';
      span.style.marginRight = char === ' ' ? '0.1em' : '0'; // subtle spacing
      textSpan.appendChild(span);
    });

    const chars = textSpan.querySelectorAll('span');

    // Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=1500',
        pin: true,
        scrub: false,
        once: true,
      },
    });

    tl.to(chars, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      stagger: {
        each: 0.03,
        ease: 'power2.out',
      },
      duration: 1.2,
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      tl.kill();
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <section className="scroll-section flex h-screen items-center justify-center">
        <p className="m-0 max-w-3xl px-8 text-center leading-relaxed">
          {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
          <span className="reveal-text text-[clamp(1.5rem,3vw,2rem)] font-medium tracking-wide">
            Responsive Animated Text Reveals with CSS Scroll-Driven Animations.
            This effect can bring storytelling to life, guiding the reader’s
            attention word by word.
          </span>
        </p>
      </section>
    </main>
  );
}
