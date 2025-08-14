import React, { useEffect, useRef, useState } from "react";

type FixedUtilityBarProps = {
  children: React.ReactNode;
  top?: number; // pixels from top; defaults to 280 per current navbar offset
  zIndex?: number; // layer order; below modals, above content
  gap?: number; // extra breathing room below the bar
  withSpacer?: boolean; // render spacer in flow to offset content
  onHeightChange?: (heightPx: number) => void; // notify parent when measured height changes
};

export function FixedUtilityBar({ children, top = 280, zIndex = 40, gap = 16, withSpacer = true, onHeightChange }: FixedUtilityBarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [barHeight, setBarHeight] = useState<number>(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Initial measure
    const initial = Math.ceil(el.getBoundingClientRect().height) || 96;
    setBarHeight(initial);
    try { onHeightChange?.(initial); } catch {}

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === el) {
          const next = Math.ceil(entry.contentRect.height);
          if (next !== barHeight) {
            setBarHeight(next || 96);
            try { onHeightChange?.(next || 96); } catch {}
          }
        }
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [barHeight]);

  return (
    <>
      {/* Fixed bar container; children should include their visual styles */}
      <div style={{ position: "fixed", top, left: 0, right: 0, zIndex }}>
        <div ref={containerRef}>
          {children}
        </div>
      </div>
      {/* Spacer reserves the bar's height in normal flow so content starts below it */}
      {withSpacer && <div aria-hidden="true" style={{ height: barHeight + gap }} />}
    </>
  );
}

export default FixedUtilityBar;


