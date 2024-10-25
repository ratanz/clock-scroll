"use client";

import { useEffect, useRef } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef(null);
  const stickyRef = useRef(null);
  const handContainerRef = useRef(null);
  const handRef = useRef(null);
  const handImageRef = useRef(null);
  const introRef = useRef(null);
  const h1ElementRef = useRef(null);
  const introCopyRef = useRef(null);
  const websiteContentRef = useRef(null);

  const introHeaders = [
    "<span>time to</span> be brave",
    "<span>time to</span> be playful",
    "<span>time to</span> design the future",
    "<span>time to</span> meet ratan",
    "<span>time to</span> see more...",
  ];

  useGSAP(
    () => {
      let currentCycle = -1;
      let imageRevealed = false;

      const updateHeaderText = () => {
        if (h1ElementRef.current) {
          h1ElementRef.current.innerHTML =
            introHeaders[Math.min(currentCycle, introHeaders.length - 1)];
        }
      };

      const pinnedHeight = window.innerHeight * 8;

      ScrollTrigger.create({
        trigger: stickyRef.current,
        start: "top top",
        end: `+=${pinnedHeight}`,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress;

          const rotationProgress = Math.min((progress * 8) / 5, 1);
          const totalRotation = rotationProgress * 1800 - 90;
          const rotationInCycle = ((totalRotation + 90) % 360) - 90;
          gsap.set(handContainerRef.current, { rotationZ: rotationInCycle });

          const newCycle = Math.floor((totalRotation + 90) / 360);
          if (
            newCycle !== currentCycle &&
            newCycle >= 0 &&
            newCycle < introHeaders.length
          ) {
            currentCycle = newCycle;
            updateHeaderText();

            if (newCycle === 3 && !imageRevealed) {
              gsap.to(handImageRef.current, { opacity: 1, duration: 0.3 });
              gsap.to(introCopyRef.current.querySelectorAll("p"), {
                x: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
              });
              imageRevealed = true;
            } else if (newCycle !== 3 && imageRevealed) {
              gsap.to(handImageRef.current, { opacity: 0, duration: 0.3 });
              gsap.to(introCopyRef.current.querySelectorAll("p"), {
                x: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
              });
              imageRevealed = false;
            }
          }

          if (progress <= 6 / 8) {
            const animationProgress = Math.max(0, (progress - 5 / 8) / (1 / 8));
            const newHeight = gsap.utils.interpolate(
              52.75,
              100,
              animationProgress
            );
            const newOpacity = gsap.utils.interpolate(1, 0, animationProgress);
            gsap.set(handRef.current, { height: `${newHeight}%` });
            gsap.set(introRef.current, { opacity: 1 });
            gsap.set(h1ElementRef.current, { opacity: newOpacity });
            gsap.set(h1ElementRef.current.querySelector("span"), {
              opacity: newOpacity,
            });
          } else {
            gsap.set(introRef.current, { opacity: 0 });
          }

          if (progress <= 7 / 8) {
            const scaleProgress = Math.max(0, (progress - 6 / 8) / (1 / 8));
            const newScale = gsap.utils.interpolate(1, 20, scaleProgress);
            gsap.set(handRef.current, { scale: newScale });
          }

          if (progress <= 7.5 / 8) {
            const opacityProgress = Math.max(0, (progress - 7 / 8) / (0.5 / 8));
            const newOpacity = gsap.utils.interpolate(1, 0, opacityProgress);
            gsap.set(handRef.current, { opacity: newOpacity });
          }

          if (progress > 7.5 / 8) {
            const revealProgress = (progress - 7.5 / 8) / (0.5 / 8);
            const newOpacity = gsap.utils.interpolate(0, 1, revealProgress);
            gsap.set(websiteContentRef.current, { opacity: newOpacity });
          } else {
            gsap.set(websiteContentRef.current, { opacity: 0 });
          }
        },
      });

      updateHeaderText();

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  return (
    <>
      <ReactLenis
        root
        options={{ lerp: 0.1, duration: 1.5, smoothTouch: true }}
      >
        <div className="container" ref={container}>
          <section className="sticky" ref={stickyRef}>
            <div className="hand-container" ref={handContainerRef}>
              <div className="hand" ref={handRef}>
                {/* <Image src="/porfile.jpg" layout="fill" alt="" ref={handImageRef} /> */}
              </div>
            </div>

            <div className="intro" ref={introRef}>
              <h1 ref={h1ElementRef}>
                <span>time to</span> be brave
              </h1>
              <div ref={introCopyRef}>
                <p>Hey there, im creative frontend developer</p>
                <p>
                  I am a creative frontend developer with a passion for creating
                  beautiful and functional websites. using latest technology
                  stack. like gsap , lenis , nextjs , framer motion , tailwind
                  css , shadcn ui , react , node js , typescript , etc. to craft a beautiful looking websites.
                </p>
              </div>
            </div>

            <div className="website-content" ref={websiteContentRef}>
              <h1 className="">R A T A N</h1>
            </div>
          </section>
        </div>
      </ReactLenis>
    </>
  );
}
