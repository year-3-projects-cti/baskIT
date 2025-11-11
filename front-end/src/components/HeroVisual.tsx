import { useState } from "react";

const PARTICLE_COUNT = 8;

export const HeroVisual = () => {
  const [modelError, setModelError] = useState(false);

  return (
    <div className="hero-visual">
      <div className="hero-visual__glow hero-visual__glow--one" />
      <div className="hero-visual__glow hero-visual__glow--two" />

      {!modelError ? (
        <model-viewer
          className="hero-visual__model"
          src="/models/basket.glb"
          alt="Model 3D coș cadou"
          auto-rotate
          autoplay
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          disable-zoom
          poster="/fallbacks/basket-poster.png"
          exposure="1"
          environment-image="neutral"
          onError={() => setModelError(true)}
        />
      ) : (
        <div className="hero-visual__fallback">
          <div className="hero-visual__fallback-ring" />
          <div className="hero-visual__fallback-basket">🧺</div>
        </div>
      )}

      <div className="hero-visual__particles">
        {Array.from({ length: PARTICLE_COUNT }).map((_, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.6}s` }} />
        ))}
      </div>
    </div>
  );
};
