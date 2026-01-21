'use client';

export function RaysAnimation() {
  return (
    <div className="w-full h-[100vh] absolute top-0 left-0 hidden md:block">
      <div className="w-full h-full pointer-events-none z-[3] overflow-hidden relative flex items-center justify-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{
            backgroundColor: 'transparent',
            // opacity: 0.6,
            transition: 'opacity 0.3s ease-in-out',
          }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
