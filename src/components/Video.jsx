import { ScrollTrigger } from 'gsap/all';
import heroVideo from '/src/assets/videos/heroVid.mp4';

const Video = () => {
  return (
    <>
      <video
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 object-cover w-full h-full z-[-1] pointer-events-none"
      />
    </>
  );
};

export default Video;
