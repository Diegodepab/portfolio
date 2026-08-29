export interface AntsCursorOptions {
  element?: HTMLElement | null;
  numberOfAnts?: number;
  followRange?: number;
  color?: string;
  speed?: number;
  lineFormationSpeed?: number;
  zIndex?: string;
  opacity?: number;
  sizeMultiplier?: number;
}

export function antsCursor(options?: AntsCursorOptions) {
  const hasWrapperEl = options && options.element;
  const element = hasWrapperEl || document.body;

  let width = window.innerWidth;
  let height = window.innerHeight;
  const cursor = { x: width / 2, y: height / 2 };
  const ants: Ant[] = [];
  let canvas: HTMLCanvasElement | null = null;
  let context: CanvasRenderingContext2D | null = null;
  let animationFrame = 0;
  let isRunning = false;
  let eventsBound = false;
  let destroyed = false;

  const numberOfAnts = options?.numberOfAnts ?? 15;
  const followRange = options?.followRange ?? 60;
  const antColor = options?.color ?? "#4a2c0a";
  const antSpeed = options?.speed ?? 1.2;
  const antOpacity = options?.opacity !== undefined ? options.opacity : 0.6;
  const antSizeMultiplier = options?.sizeMultiplier ?? 0.6;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const handleMotionPreference = () => {
    if (prefersReducedMotion.matches) {
      stop();
    } else {
      init();
    }
  };
  prefersReducedMotion.addEventListener("change", handleMotionPreference);

  function init() {
    if (destroyed || prefersReducedMotion.matches || canvas) return false;

    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");
    if (!context) {
      canvas = null;
      return false;
    }
    
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = options?.zIndex || "0";

    if (hasWrapperEl) {
      canvas.style.position = "absolute";
      element.appendChild(canvas);
      canvas.width = element.clientWidth;
      canvas.height = element.clientHeight;
    } else {
      canvas.style.position = "fixed";
      document.body.appendChild(canvas);
      canvas.width = width;
      canvas.height = height;
    }

    ants.length = 0;
    for (let i = 0; i < numberOfAnts; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ants.push(new Ant(x, y, i));
    }

    bindEvents();
    if (!document.hidden) startLoop();
    return true;
  }

  function bindEvents() {
    if (eventsBound) return;
    eventsBound = true;
    window.addEventListener("mousemove", onMouseMove as EventListener);
    window.addEventListener("touchmove", onTouchMove as EventListener, { passive: true });
    window.addEventListener("touchstart", onTouchMove as EventListener, { passive: true });
    window.addEventListener("resize", onWindowResize);
    document.addEventListener("visibilitychange", onVisibilityChange);
  }

  function unbindEvents() {
    if (!eventsBound) return;
    eventsBound = false;
    window.removeEventListener("mousemove", onMouseMove as EventListener);
    window.removeEventListener("touchmove", onTouchMove as EventListener);
    window.removeEventListener("touchstart", onTouchMove as EventListener);
    window.removeEventListener("resize", onWindowResize);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  }

  function onVisibilityChange() {
    if (document.hidden) stopLoop();
    else if (canvas) startLoop();
  }

  function onWindowResize() {
    if (!canvas) return;
    width = window.innerWidth;
    height = window.innerHeight;

    if (hasWrapperEl) {
      canvas.width = element.clientWidth;
      canvas.height = element.clientHeight;
    } else {
      canvas.width = width;
      canvas.height = height;
    }
  }

  function onTouchMove(e: TouchEvent) {
    if (e.touches.length > 0) {
      if (hasWrapperEl) {
        const boundingRect = element.getBoundingClientRect();
        cursor.x = e.touches[0].clientX - boundingRect.left;
        cursor.y = e.touches[0].clientY - boundingRect.top;
      } else {
        cursor.x = e.touches[0].clientX;
        cursor.y = e.touches[0].clientY;
      }
    }
  }

  function onMouseMove(e: MouseEvent) {
    if (hasWrapperEl) {
      const boundingRect = element.getBoundingClientRect();
      cursor.x = e.clientX - boundingRect.left;
      cursor.y = e.clientY - boundingRect.top;
    } else {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    }
  }

  function updateAnts() {
    if (!context || !canvas) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = antOpacity;

    ants.forEach((ant) => {
      ant.following = false;
      ant.target = null;
    });

    const followingAnts: Ant[] = [];
    let closestToCursor: Ant | null = null;
    let closestDist = Infinity;

    for (const ant of ants) {
      const dist = Math.hypot(ant.position.x - cursor.x, ant.position.y - cursor.y);
      if (dist < followRange && dist < closestDist) {
        closestDist = dist;
        closestToCursor = ant;
      }
    }

    if (closestToCursor) {
      const leader: Ant = closestToCursor;
      leader.following = true;
      leader.target = { ...cursor };
      followingAnts.push(leader);
    }

    let addedNew = true;
    while (addedNew) {
      addedNew = false;
      ants.forEach((ant) => {
        if (ant.following) return;

        let nearestDist = Infinity;
        let nearestAnt: Ant | null = null;

        for (const followingAnt of followingAnts) {
          const dist = Math.hypot(
            ant.position.x - followingAnt.position.x,
            ant.position.y - followingAnt.position.y
          );
          if (dist < nearestDist) {
            nearestDist = dist;
            nearestAnt = followingAnt;
          }
        }

        if (nearestDist < followRange && nearestAnt) {
          const targetAnt: Ant = nearestAnt;
          ant.following = true;
          ant.target = { ...targetAnt.position };
          followingAnts.push(ant);
          addedNew = true;
        }
      });
    }

    ants.forEach((ant) => {
      if (ant.following && ant.target) {
        ant.moveToward(ant.target);
      } else {
        ant.wander();
      }
      ant.update();
      ant.draw(context!);
    });
  }

  function loop() {
    if (!isRunning) return;
    updateAnts();
    animationFrame = requestAnimationFrame(loop);
  }

  function startLoop() {
    if (isRunning) return;
    isRunning = true;
    loop();
  }

  function stopLoop() {
    isRunning = false;
    cancelAnimationFrame(animationFrame);
  }

  function stop() {
    stopLoop();
    unbindEvents();
    canvas?.remove();
    canvas = null;
    context = null;
    ants.length = 0;
  }

  function destroy() {
    destroyed = true;
    stop();
    prefersReducedMotion.removeEventListener("change", handleMotionPreference);
  }

  class Ant {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    angle: number;
    wanderAngle: number;
    index: number;
    following: boolean;
    target: { x: number; y: number } | null;
    legPhase: number;
    size: number;

    constructor(x: number, y: number, index: number) {
      this.position = { x, y };
      this.velocity = { x: 0, y: 0 };
      this.angle = Math.random() * Math.PI * 2;
      this.wanderAngle = this.angle;
      this.index = index;
      this.following = false;
      this.target = null;
      this.legPhase = Math.random() * Math.PI * 2;
      this.size = (1.5 + Math.random() * 1) * antSizeMultiplier;
    }

    wander() {
      this.wanderAngle += (Math.random() - 0.5) * 0.3;
      const targetVx = Math.cos(this.wanderAngle) * antSpeed * 0.5;
      const targetVy = Math.sin(this.wanderAngle) * antSpeed * 0.5;
      this.velocity.x += (targetVx - this.velocity.x) * 0.05;
      this.velocity.y += (targetVy - this.velocity.y) * 0.05;

      if (!canvas) return;
      if (this.position.x < 20) this.wanderAngle = 0;
      if (this.position.x > canvas.width - 20) this.wanderAngle = Math.PI;
      if (this.position.y < 20) this.wanderAngle = Math.PI / 2;
      if (this.position.y > canvas.height - 20) this.wanderAngle = -Math.PI / 2;
    }

    moveToward(target: { x: number; y: number }) {
      const dx = target.x - this.position.x;
      const dy = target.y - this.position.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 8) {
        const targetAngle = Math.atan2(dy, dx);
        let angleDiff = targetAngle - this.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        this.angle += angleDiff * 0.3;

        const speed = Math.min(antSpeed * 1.8, dist * 0.15);
        const targetVx = Math.cos(this.angle) * speed;
        const targetVy = Math.sin(this.angle) * speed;

        this.velocity.x += (targetVx - this.velocity.x) * 0.2;
        this.velocity.y += (targetVy - this.velocity.y) * 0.2;
      } else {
        this.velocity.x *= 0.8;
        this.velocity.y *= 0.8;
      }
    }

    update() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      if (Math.hypot(this.velocity.x, this.velocity.y) > 0.1) {
        this.angle = Math.atan2(this.velocity.y, this.velocity.x);
      }

      if (canvas) {
        this.position.x = Math.max(5, Math.min(canvas.width - 5, this.position.x));
        this.position.y = Math.max(5, Math.min(canvas.height - 5, this.position.y));
      }

      this.legPhase += Math.hypot(this.velocity.x, this.velocity.y) * 0.3;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(this.angle);

      const s = this.size;
      const phase = this.legPhase;

      ctx.strokeStyle = antColor;
      ctx.lineWidth = 0.5;

      const legPositions = [
        { x: s * 0.4, side: -1, group: 0 },
        { x: s * 0.4, side: 1, group: 1 },
        { x: 0, side: -1, group: 1 },
        { x: 0, side: 1, group: 0 },
        { x: -s * 0.5, side: -1, group: 0 },
        { x: -s * 0.5, side: 1, group: 1 },
      ];

      legPositions.forEach((leg) => {
        const wiggle = Math.sin(phase + leg.group * Math.PI) * 0.4;
        const extendY = s * 0.9 * leg.side;
        const extendX = leg.x - s * 0.3 + wiggle * s * 0.3;

        ctx.beginPath();
        ctx.moveTo(leg.x, 0);
        ctx.lineTo(extendX, extendY);
        ctx.stroke();
      });

      ctx.fillStyle = antColor;

      ctx.beginPath();
      ctx.ellipse(s * 0.9, 0, s * 0.5, s * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.5, s * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(-s * 1.1, 0, s * 0.7, s * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = antColor;
      ctx.lineWidth = 0.4;
      ctx.beginPath();
      ctx.moveTo(s * 1.2, -s * 0.2);
      ctx.quadraticCurveTo(s * 1.6, -s * 0.6, s * 1.8, -s * 0.3);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(s * 1.2, s * 0.2);
      ctx.quadraticCurveTo(s * 1.6, s * 0.6, s * 1.8, s * 0.3);
      ctx.stroke();

      ctx.restore();
    }
  }

  init();

  return {
    destroy
  };
}
