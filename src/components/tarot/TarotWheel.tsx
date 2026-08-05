import { useEffect, useRef, useState } from "react";
import { TAROT_DECK } from "../../data/tarotDeck";
import { CardBack } from "./TarotCardView";

const TOOTH_COUNT = TAROT_DECK.length;
const SLICE = 9; // độ giữa 2 lá liền kề — đủ rộng để tránh chạm nhầm lá bên cạnh
const TOTAL_SPAN = TOOTH_COUNT * SLICE;
const FRICTION = 0.965;
const STOP_THRESHOLD = 0.15;
const DRAG_SENSITIVITY = 0.6;
const TAP_MOVE_THRESHOLD = 6;
const VISIBLE_ANGLE = 100;
const FADE_START_ANGLE = 72;
const MOMENTUM_MIN_VELOCITY = 14; // dưới ngưỡng này: dừng ngay, không trôi theo quán tính
const LIFT_RATIO = 0.42;
const CONFIRM_LIFT_RATIO = 0.58;
const CONFIRM_DELAY_MS = 480;

const SIZE_DESKTOP = { radius: 190, cardW: 54, cardH: 81 };
const SIZE_MOBILE = { radius: 128, cardW: 40, cardH: 60 };

interface Props {
  onLand: (index: number, reversed: boolean) => void;
}

function normalizeAngle(a: number): number {
  let x = a % TOTAL_SPAN;
  if (x > TOTAL_SPAN / 2) x -= TOTAL_SPAN;
  if (x < -TOTAL_SPAN / 2) x += TOTAL_SPAN;
  return x;
}

export function TarotWheel({ onLand }: Props) {
  const [displayRotation, setDisplayRotation] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(false);
  const [liftedIdx, setLiftedIdx] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia("(min-width: 640px)").matches);
  const rotationRef = useRef(0);
  const liftedIdxRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const confirmTimeoutRef = useRef<number | null>(null);
  const drag = useRef({ active: false, lastX: 0, lastT: 0, velocity: 0, pointerId: -1, totalMove: 0 });

  useEffect(() => {
    liftedIdxRef.current = liftedIdx;
  }, [liftedIdx]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (confirmTimeoutRef.current) window.clearTimeout(confirmTimeoutRef.current);
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("pointercancel", onWindowPointerUp);
      window.removeEventListener("selectstart", preventSelectStart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { radius: RADIUS, cardW: CARD_W, cardH: CARD_H } = isDesktop ? SIZE_DESKTOP : SIZE_MOBILE;

  function clearSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) sel.removeAllRanges();
  }

  function preventSelectStart(e: Event) {
    e.preventDefault();
  }

  function liftCard(idx: number) {
    setTransitionEnabled(true);
    setLiftedIdx(idx);
  }

  function confirmCard(idx: number) {
    setConfirming(true);
    confirmTimeoutRef.current = window.setTimeout(() => {
      const reversed = Math.random() < 0.35;
      onLand(idx, reversed);
    }, CONFIRM_DELAY_MS);
  }

  function snapImmediately() {
    const snapped = Math.round(rotationRef.current / SLICE) * SLICE;
    rotationRef.current = snapped;
    setTransitionEnabled(true);
    setDisplayRotation(snapped);
    window.setTimeout(() => setTransitionEnabled(false), 220);
  }

  function startMomentum(initialVelocity: number) {
    let velocity = initialVelocity;
    const step = () => {
      velocity *= FRICTION;
      rotationRef.current += velocity;
      setDisplayRotation(rotationRef.current);
      if (Math.abs(velocity) < STOP_THRESHOLD) {
        const snapped = Math.round(rotationRef.current / SLICE) * SLICE;
        rotationRef.current = snapped;
        setTransitionEnabled(true);
        setDisplayRotation(snapped);
        window.setTimeout(() => setTransitionEnabled(false), 450);
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }

  function handleMove(clientX: number) {
    const now = performance.now();
    const dx = clientX - drag.current.lastX;
    const dt = Math.max(now - drag.current.lastT, 1);
    // Kéo sang trái (dx < 0) phải làm các lá trôi sang trái theo đúng hướng ngón tay/chuột.
    const deltaDeg = -dx * DRAG_SENSITIVITY;
    rotationRef.current += deltaDeg;
    setDisplayRotation(rotationRef.current);
    const instVelocity = (deltaDeg / dt) * 16.67;
    drag.current.velocity = drag.current.velocity * 0.7 + instVelocity * 0.3;
    drag.current.totalMove += Math.abs(dx);
    drag.current.lastX = clientX;
    drag.current.lastT = now;

    if (liftedIdxRef.current !== null && drag.current.totalMove >= TAP_MOVE_THRESHOLD) {
      setLiftedIdx(null);
    }
  }

  function onWindowPointerMove(e: PointerEvent) {
    if (!drag.current.active) return;
    e.preventDefault();
    clearSelection();
    handleMove(e.clientX);
  }

  function onWindowPointerUp(e: PointerEvent) {
    if (!drag.current.active || e.pointerId !== drag.current.pointerId) return;
    drag.current.active = false;
    window.removeEventListener("pointermove", onWindowPointerMove);
    window.removeEventListener("pointerup", onWindowPointerUp);
    window.removeEventListener("pointercancel", onWindowPointerUp);
    window.removeEventListener("selectstart", preventSelectStart);
    clearSelection();

    if (drag.current.totalMove < TAP_MOVE_THRESHOLD) {
      const target = e.target as HTMLElement | null;
      const cardEl = target?.closest("[data-card-idx]") as HTMLElement | null;
      if (cardEl) {
        const idx = Number(cardEl.dataset.cardIdx);
        if (liftedIdxRef.current === idx) {
          confirmCard(idx);
        } else {
          liftCard(idx);
        }
      } else if (liftedIdxRef.current !== null) {
        setTransitionEnabled(true);
        setLiftedIdx(null);
      }
      return;
    }

    if (Math.abs(drag.current.velocity) < MOMENTUM_MIN_VELOCITY) {
      snapImmediately();
    } else {
      startMomentum(drag.current.velocity);
    }
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (confirming) return;
    e.preventDefault();
    clearSelection();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setTransitionEnabled(false);
    drag.current = { active: true, lastX: e.clientX, lastT: performance.now(), velocity: 0, pointerId: e.pointerId, totalMove: 0 };
    window.addEventListener("pointermove", onWindowPointerMove, { passive: false });
    window.addEventListener("pointerup", onWindowPointerUp);
    window.addEventListener("pointercancel", onWindowPointerUp);
    window.addEventListener("selectstart", preventSelectStart);
  }

  const maxLift = RADIUS * CONFIRM_LIFT_RATIO;
  const containerWidth = RADIUS * 2 + CARD_W + maxLift * 0.6;
  const containerHeight = RADIUS + maxLift + CARD_H / 2 + 10;
  const pivotX = containerWidth / 2;
  const pivotY = containerHeight;
  const cardTransition = transitionEnabled
    ? "left 0.5s cubic-bezier(0.16, 1, 0.3, 1), top 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, box-shadow 0.4s ease"
    : "opacity 0.3s ease";

  const cards = Array.from({ length: TOOTH_COUNT }, (_, i) => {
    const angle = normalizeAngle(i * SLICE - displayRotation);
    if (Math.abs(angle) > VISIBLE_ANGLE) return null;
    const isLifted = liftedIdx === i;
    const isConfirmingThis = confirming && isLifted;
    const absAngle = Math.abs(angle);

    const opacity =
      liftedIdx !== null
        ? isLifted
          ? 1
          : Math.max(0, (absAngle <= FADE_START_ANGLE ? 1 : Math.max(0, 1 - (absAngle - FADE_START_ANGLE) / (VISIBLE_ANGLE - FADE_START_ANGLE))) * 0.3)
        : absAngle <= FADE_START_ANGLE
          ? 1
          : Math.max(0, 1 - (absAngle - FADE_START_ANGLE) / (VISIBLE_ANGLE - FADE_START_ANGLE));

    const baseScale = 1 - Math.min(absAngle / 90, 1) * 0.32;
    const scale = isConfirmingThis ? 1.4 : isLifted ? 1 + LIFT_RATIO * 0.7 : baseScale;
    const liftAmount = isConfirmingThis ? RADIUS * CONFIRM_LIFT_RATIO : isLifted ? RADIUS * LIFT_RATIO : 0;
    const r = RADIUS + liftAmount;
    const angleRad = (angle * Math.PI) / 180;
    const x = pivotX + Math.sin(angleRad) * r;
    const y = pivotY - Math.cos(angleRad) * r;
    const zIndex = isLifted ? 2000 : Math.round(1000 - absAngle);

    return (
      <div
        key={i}
        data-card-idx={i}
        className="absolute rounded-md overflow-hidden border cursor-pointer"
        style={{
          width: CARD_W,
          height: CARD_H,
          left: x,
          top: y,
          transform: `translate(-50%, -50%) rotate(${angle}deg) scale(${scale})`,
          opacity,
          zIndex,
          transition: cardTransition,
          borderColor: isLifted ? "#f1d98b" : "rgba(212,175,55,0.4)",
          boxShadow: isLifted
            ? `0 0 ${isConfirmingThis ? 34 : 24}px ${isConfirmingThis ? 8 : 4}px rgba(241,217,139,${isConfirmingThis ? 0.75 : 0.55}), 0 10px 24px -4px rgba(0,0,0,0.7)`
            : "0 4px 14px -4px rgba(0,0,0,0.6)",
          pointerEvents: confirming ? "none" : opacity < 0.12 ? "none" : "auto",
        }}
      >
        <CardBack />
      </div>
    );
  });

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative" style={{ width: containerWidth, height: containerHeight + 18 }}>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-0 h-0"
          style={{
            borderLeft: "9px solid transparent",
            borderRight: "9px solid transparent",
            borderTop: "16px solid #d4af37",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
          }}
          aria-hidden
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 touch-none"
          onPointerDown={onPointerDown}
          onDragStart={(e) => e.preventDefault()}
          style={
            {
              width: containerWidth,
              height: containerHeight,
              userSelect: "none",
              WebkitUserSelect: "none",
              WebkitTapHighlightColor: "transparent",
              WebkitUserDrag: "none",
            } as React.CSSProperties
          }
        >
          {cards}
        </div>
      </div>
      <p
        className="text-xs text-white/40 text-center max-w-xs select-none transition-opacity duration-500"
        style={{ opacity: liftedIdx === null ? 1 : 0, height: liftedIdx === null ? "auto" : 0 }}
      >
        Vuốt để lướt qua các lá bài, chạm vào một lá để rút nó ra.
      </p>
      <p
        className="text-xs text-gold-soft/80 text-center max-w-xs select-none transition-opacity duration-500"
        style={{ opacity: liftedIdx !== null ? 1 : 0, height: liftedIdx !== null ? "auto" : 0 }}
      >
        {confirming ? "Đang mở lá bài của bạn..." : "Chạm lại lá bài để xác nhận, hoặc vuốt để chọn lá khác."}
      </p>
    </div>
  );
}
