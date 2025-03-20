import { useEffect, useState, useRef, useCallback } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Button from "./Button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(new Set());
  const totalVideos = 5;
  const nextVideoRef = useRef(null);
  const videoRefs = useRef([]);

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

  const handleVideoLoad = useCallback((index) => {
    setLoadedVideos((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  // Preload all videos on mount
  useEffect(() => {
    const preloadVideos = () => {
      for (let i = 1; i <= totalVideos; i++) {
        const video = document.createElement("video");
        video.src = getVideoSrc(i);
        video.preload = "auto";
        video.addEventListener("canplaythrough", () => handleVideoLoad(i));
        video.style.display = "none";
        document.body.appendChild(video);
        videoRefs.current.push(video);
      }
    };

    preloadVideos();

    return () => {
      videoRefs.current.forEach((video) => video.remove());
    };
  }, [handleVideoLoad]);

  // Handle loading state - now only waiting for 3 video loads
  useEffect(() => {
    if (loadedVideos.size >= 3) {
      setIsLoading(false);
    }
  }, [loadedVideos, totalVideos]);

  const nextVideoIndex = (currentIndex % totalVideos) + 1;

  const handleMiniVDClick = () => {
    if (!isLoading) {
      setHasClicked(true);
      setCurrentIndex(nextVideoIndex);
    }
  };

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", { visibility: "visible" });

        gsap.to("#next-video", {
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 0.7, // decreased duration for smoother transition
          ease: "power2.out", // smoother easing
          onStart: () => {
            if (nextVideoRef.current) {
              nextVideoRef.current.play().catch(() => {});
            }
          },
        });

        gsap.from("#current-video", {
          scale: 0,
          duration: 0.7, // decreased duration
          ease: "power2.out", // smoother easing
        });
      }
    },
    { dependencies: [currentIndex], revertOnUpdate: true }
  );

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0 0 40% 10%",
    });

    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0 100%)",
      borderRadius: "0 0 0 0",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {isLoading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot" />
            <div className="three-body__dot" />
            <div className="three-body__dot" />
          </div>
        </div>
      )}

      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <div>
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <div
              onClick={handleMiniVDClick}
              className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
            >
              <video
                ref={nextVideoRef}
                src={getVideoSrc(nextVideoIndex)}
                preload="auto"
                loop
                muted
                id="current-video"
                className="size-64 origin-center scale-150 object-cover object-center"
                onCanPlayThrough={() => handleVideoLoad(nextVideoIndex)}
              />
            </div>
          </div>

          <video
            ref={nextVideoRef}
            src={getVideoSrc(currentIndex)}
            preload="auto"
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onCanPlayThrough={() => handleVideoLoad(currentIndex)}
          />

          <video
            src={getVideoSrc(currentIndex)}
            autoPlay
            loop
            muted
            preload="auto"
            className="absolute left-0 top-0 size-full object-cover object-center"
            onCanPlayThrough={() => handleVideoLoad(currentIndex)}
          />
        </div>

        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75 font-bold hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)]">
          <b>
            Ga<span className="text-yellow-500">m</span>ing
          </b>
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">
              re<b>d</b>efi<b>n</b>e
            </h1>
            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter the Metagame Layer <br />
              Unleash the Play Economy
            </p>

            <Button
              id="watch-trailer"
              title="Watch-Trailer"
              leftIcon={<TiLocationArrow />}
              containerClass="!bg-yellow-500 flex-center gap-1"
            />
          </div>
        </div>
      </div>

      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black font-bold hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.8)]">
        <b>
          Ga<span className="text-yellow-500">m</span>ing
        </b>
      </h1>
    </div>
  );
};

export default Hero;
