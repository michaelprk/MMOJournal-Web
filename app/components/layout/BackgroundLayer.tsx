import React from "react";
import { useLocation } from "react-router-dom";
import { useBackground } from "../../contexts/BackgroundContext";

export function BackgroundLayer() {
  const { state, manifest } = useBackground();
  const entry = manifest.find((m) => m.id === state.id) || null;
  const location = useLocation();

  const commonStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    zIndex: -1,
    pointerEvents: "none",
  };

  if (state.kind === "solid") {
    const bg = state.solidColor === "white" ? "#ffffff" : "#000000";
    return <div aria-hidden="true" style={{ ...commonStyle, backgroundColor: bg }} />;
  }

  if (state.kind === "image" && entry) {
    return (
      <img
        key={entry.id}
        aria-hidden="true"
        src={entry.src}
        alt=""
        style={commonStyle}
        draggable={false}
      />
    );
  }

  if (state.kind === "video" && entry) {
    const videoFilter =
      location.pathname === "/login" || location.pathname === "/create-account"
        ? "grayscale(50%) brightness(80%) contrast(95%) blur(4px)"
        : "grayscale(70%) brightness(40%) contrast(90%) blur(1px)";
    return (
      <video
        key={entry.id}
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={entry.poster}
        style={{ ...commonStyle, filter: videoFilter }}
      >
        <source src={entry.src} />
      </video>
    );
  }

  return null;
}


