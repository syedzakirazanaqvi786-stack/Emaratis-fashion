/**
 * EMARATIS FASHION - 360° HAUTE COUTURE CANVAS VIEWER
 * 
 * Features:
 * - Seamless borderless canvas integration
 * - 240-frame high-resolution sequence support
 * - Dual-tier progressive loading (Instant frame 1 -> 60 keyframes -> 240 full set)
 * - Momentum damping / inertia physics on release
 * - Mouse drag & mobile touch swipe with pointer-events
 * - Continuous smooth auto-rotation with intelligent idle resumption
 * - Degree readout and interactive scrubber
 * - Quick angle presets (0° Front, 90° Profile, 180° Back, 270° Turn)
 * - Detail inspection zoom mode
 */

class DressViewer360 {
  constructor(options = {}) {
    this.canvas = document.getElementById(options.canvasId || 'viewerCanvas');
    this.container = document.getElementById(options.containerId || 'viewerContainer');
    this.totalFrames = options.totalFrames || 240;
    this.framePrefix = options.framePrefix || 'ezgif-252ce33e2d298fa6-jpg/ezgif-frame-';
    this.frameExt = options.frameExt || '.jpg';
    
    // UI Elements
    this.slider = document.getElementById('angleSlider');
    this.angleDisplay = document.getElementById('currentAngleDisplay');
    this.progressBar = document.getElementById('viewerProgressBar');
    this.loadingOverlay = document.getElementById('viewerLoadingOverlay');
    this.playPauseBtn = document.getElementById('toggleAutoRotateBtn');
    this.zoomBtn = document.getElementById('toggleZoomBtn');
    this.resetBtn = document.getElementById('resetAngleBtn');
    
    // State
    this.images = new Array(this.totalFrames).fill(null);
    this.loadedCount = 0;
    this.currentFrame = 0; // 0 to 239
    this.targetFrame = 0;
    this.isDragging = false;
    this.startX = 0;
    this.lastX = 0;
    this.lastMoveTime = 0;
    this.velocity = 0;
    this.isAutoRotating = true;
    this.autoRotateSpeed = 0.35; // frames per tick
    this.autoRotateAccumulator = 0;
    this.idleTimer = null;
    this.idleDelay = 2200; // ms before auto-rotate resumes
    this.isZoomed = false;
    this.zoomLevel = 2.2;
    this.zoomX = 0.5;
    this.zoomY = 0.5;
    this.animatingPreset = false;
    
    // Drag sensitivity: pixels moved per frame shift
    this.dragSensitivity = 3.2;

    if (!this.canvas) {
      console.error('360 Viewer Canvas element not found.');
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.init();
  }

  getFramePath(index) {
    const frameNum = String(index + 1).padStart(3, '0');
    return `${this.framePrefix}${frameNum}${this.frameExt}`;
  }

  init() {
    this.setupResizeHandler();
    this.bindEvents();
    this.startProgressiveLoad();
    this.startRenderLoop();
  }

  setupResizeHandler() {
    const resize = () => {
      if (!this.container || !this.canvas) return;
      const rect = this.container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
      this.render();
    };

    window.addEventListener('resize', resize);
    setTimeout(resize, 40);
  }

  startProgressiveLoad() {
    // 1. Immediately load Frame 1
    const firstImg = new Image();
    firstImg.src = this.getFramePath(0);
    firstImg.onload = () => {
      this.images[0] = firstImg;
      this.loadedCount++;
      this.render();
      // 2. Load keyframes (every 4th frame: 1, 5, 9...)
      this.loadKeyframes();
    };
  }

  loadKeyframes() {
    const keyIndices = [];
    const step = 4;
    for (let i = 0; i < this.totalFrames; i += step) {
      if (i !== 0) keyIndices.push(i);
    }

    let loadedKeys = 0;
    keyIndices.forEach((idx) => {
      const img = new Image();
      img.src = this.getFramePath(idx);
      img.onload = () => {
        this.images[idx] = img;
        this.loadedCount++;
        loadedKeys++;
        const pct = Math.round((this.loadedCount / (keyIndices.length + 1)) * 40);
        this.updateLoadingProgress(pct);

        if (loadedKeys === keyIndices.length) {
          this.onKeyframesReady();
          this.loadRemainingFrames();
        }
      };
    });
  }

  onKeyframesReady() {
    if (this.loadingOverlay) {
      this.loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        if (this.loadingOverlay) this.loadingOverlay.style.display = 'none';
      }, 500);
    }
  }

  loadRemainingFrames() {
    const remainingIndices = [];
    for (let i = 0; i < this.totalFrames; i++) {
      if (!this.images[i]) {
        remainingIndices.push(i);
      }
    }

    let idxCursor = 0;
    const batchSize = 6;

    const loadNextBatch = () => {
      if (idxCursor >= remainingIndices.length) {
        this.updateLoadingProgress(100);
        return;
      }

      const currentBatch = remainingIndices.slice(idxCursor, idxCursor + batchSize);
      idxCursor += batchSize;

      let batchLoaded = 0;
      currentBatch.forEach(idx => {
        const img = new Image();
        img.src = this.getFramePath(idx);
        img.onload = () => {
          this.images[idx] = img;
          this.loadedCount++;
          batchLoaded++;
          const overallPct = Math.round((this.loadedCount / this.totalFrames) * 100);
          this.updateLoadingProgress(overallPct);
          if (batchLoaded === currentBatch.length) {
            setTimeout(loadNextBatch, 15);
          }
        };
        img.onerror = () => {
          batchLoaded++;
          if (batchLoaded === currentBatch.length) {
            setTimeout(loadNextBatch, 15);
          }
        };
      });
    };

    loadNextBatch();
  }

  updateLoadingProgress(percent) {
    if (this.progressBar) {
      this.progressBar.style.width = `${percent}%`;
    }
  }

  getBestAvailableImage(targetIndex) {
    targetIndex = Math.round(targetIndex);
    if (this.images[targetIndex]) return this.images[targetIndex];

    for (let offset = 1; offset < this.totalFrames / 2; offset++) {
      const nextIdx = (targetIndex + offset) % this.totalFrames;
      if (this.images[nextIdx]) return this.images[nextIdx];
      const prevIdx = (targetIndex - offset + this.totalFrames) % this.totalFrames;
      if (this.images[prevIdx]) return this.images[prevIdx];
    }
    return this.images[0];
  }

  bindEvents() {
    const el = this.container;
    if (!el) return;

    el.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('pointerup', (e) => this.onPointerUp(e));
    window.addEventListener('pointercancel', (e) => this.onPointerUp(e));

    if (this.slider) {
      this.slider.addEventListener('input', (e) => {
        this.pauseAutoRotate();
        const deg = parseFloat(e.target.value);
        this.currentFrame = Math.round((deg / 360) * this.totalFrames) % this.totalFrames;
        this.updateUI();
        this.render();
        this.scheduleAutoRotateResume();
      });
    }

    if (this.playPauseBtn) {
      this.playPauseBtn.addEventListener('click', () => {
        this.isAutoRotating = !this.isAutoRotating;
        this.updatePlayPauseIcon();
      });
    }

    if (this.zoomBtn) {
      this.zoomBtn.addEventListener('click', () => {
        this.toggleZoom();
      });
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        this.animateToAngle(0);
      });
    }

    document.querySelectorAll('[data-preset-angle]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const angle = parseFloat(e.currentTarget.getAttribute('data-preset-angle'));
        this.animateToAngle(angle);
      });
    });

    el.addEventListener('mousemove', (e) => {
      if (this.isZoomed) {
        const rect = el.getBoundingClientRect();
        this.zoomX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.zoomY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        this.render();
      }
    });
  }

  onPointerDown(e) {
    if (e.button && e.button !== 0) return;
    this.isDragging = true;
    this.startX = e.clientX;
    this.lastX = e.clientX;
    this.lastMoveTime = performance.now();
    this.velocity = 0;
    this.pauseAutoRotate();
    this.animatingPreset = false;
    this.container.style.cursor = 'grabbing';
  }

  onPointerMove(e) {
    if (!this.isDragging) return;
    const now = performance.now();
    const dt = Math.max(now - this.lastMoveTime, 8);
    const dx = e.clientX - this.lastX;

    if (Math.abs(dx) > 0.4) {
      const frameDelta = dx / this.dragSensitivity;
      this.currentFrame = (this.currentFrame - frameDelta + this.totalFrames) % this.totalFrames;
      this.velocity = (dx / dt) * 1.8;
      
      this.lastX = e.clientX;
      this.lastMoveTime = now;
      this.updateUI();
      this.render();
    }
  }

  onPointerUp(e) {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.container.style.cursor = this.isZoomed ? 'zoom-out' : 'grab';
    this.velocity = Math.max(-12, Math.min(12, this.velocity));
    this.scheduleAutoRotateResume();
  }

  pauseAutoRotate() {
    this.isAutoRotating = false;
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    this.updatePlayPauseIcon();
  }

  scheduleAutoRotateResume() {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      if (!this.isDragging && !this.isZoomed) {
        this.isAutoRotating = true;
        this.updatePlayPauseIcon();
      }
    }, this.idleDelay);
  }

  updatePlayPauseIcon() {
    if (!this.playPauseBtn) return;
    const icon = this.playPauseBtn.querySelector('i');
    const label = this.playPauseBtn.querySelector('.btn-label');
    if (this.isAutoRotating) {
      if (icon) icon.className = 'fas fa-pause text-xs';
      if (label) label.textContent = 'Pause 360°';
    } else {
      if (icon) icon.className = 'fas fa-play text-xs';
      if (label) label.textContent = 'Auto Spin';
    }
  }

  toggleZoom() {
    this.isZoomed = !this.isZoomed;
    if (this.container) {
      this.container.classList.toggle('zoomed', this.isZoomed);
    }
    if (this.zoomBtn) {
      const icon = this.zoomBtn.querySelector('i');
      const label = this.zoomBtn.querySelector('.btn-label');
      if (this.isZoomed) {
        if (icon) icon.className = 'fas fa-search-minus text-xs';
        if (label) label.textContent = 'Reset View';
        this.pauseAutoRotate();
      } else {
        if (icon) icon.className = 'fas fa-search-plus text-xs';
        if (label) label.textContent = 'Zoom Fabric';
        this.scheduleAutoRotateResume();
      }
    }
    this.render();
  }

  animateToAngle(targetAngle) {
    this.pauseAutoRotate();
    this.animatingPreset = true;
    
    const targetIdx = Math.round((targetAngle / 360) * this.totalFrames) % this.totalFrames;
    const startIdx = this.currentFrame;
    
    let diff = targetIdx - startIdx;
    if (diff > this.totalFrames / 2) diff -= this.totalFrames;
    if (diff < -this.totalFrames / 2) diff += this.totalFrames;

    const startTime = performance.now();
    const duration = 600;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      if (!this.animatingPreset) return;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      this.currentFrame = (startIdx + diff * eased + this.totalFrames) % this.totalFrames;
      this.updateUI();
      this.render();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.currentFrame = targetIdx;
        this.animatingPreset = false;
        this.updateUI();
        this.render();
        this.scheduleAutoRotateResume();
      }
    };

    requestAnimationFrame(step);
  }

  updateUI() {
    const rawFrame = (Math.round(this.currentFrame) % this.totalFrames + this.totalFrames) % this.totalFrames;
    const deg = Math.round((rawFrame / this.totalFrames) * 360);

    if (this.slider && document.activeElement !== this.slider) {
      this.slider.value = deg;
    }
    if (this.angleDisplay) {
      this.angleDisplay.textContent = `${deg}°`;
    }

    document.querySelectorAll('[data-preset-angle]').forEach((btn) => {
      const pAngle = parseFloat(btn.getAttribute('data-preset-angle'));
      const diff = Math.abs(deg - pAngle);
      if (diff <= 8 || diff >= 352) {
        btn.classList.add('border-[#D4AF37]', 'text-[#D4AF37]', 'bg-[rgba(212,175,55,0.15)]');
        btn.classList.remove('border-white/10', 'text-white/60');
      } else {
        btn.classList.remove('border-[#D4AF37]', 'text-[#D4AF37]', 'bg-[rgba(212,175,55,0.15)]');
        btn.classList.add('border-white/10', 'text-white/60');
      }
    });
  }

  startRenderLoop() {
    const loop = () => {
      if (!this.isDragging && Math.abs(this.velocity) > 0.05) {
        this.currentFrame = (this.currentFrame - this.velocity + this.totalFrames) % this.totalFrames;
        this.velocity *= 0.92;
        this.updateUI();
        this.render();
      } else if (!this.isDragging) {
        this.velocity = 0;
      }

      if (this.isAutoRotating && !this.isDragging && !this.animatingPreset && !this.isZoomed) {
        this.autoRotateAccumulator += this.autoRotateSpeed;
        if (this.autoRotateAccumulator >= 1) {
          const stepFrames = Math.floor(this.autoRotateAccumulator);
          this.autoRotateAccumulator -= stepFrames;
          this.currentFrame = (this.currentFrame + stepFrames) % this.totalFrames;
          this.updateUI();
          this.render();
        }
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  render() {
    if (!this.ctx || !this.canvas) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    if (width === 0 || height === 0) return;

    const img = this.getBestAvailableImage(this.currentFrame);
    if (!img || !img.complete) return;

    this.ctx.clearRect(0, 0, width, height);

    // Subtle atmospheric studio background gradient that seamlessly merges into #040406
    const grad = this.ctx.createRadialGradient(
      width * 0.5, height * 0.5, width * 0.15,
      width * 0.5, height * 0.5, Math.max(width, height) * 0.65
    );
    grad.addColorStop(0, 'rgba(38, 30, 20, 0.35)');
    grad.addColorStop(0.5, 'rgba(10, 10, 14, 0.85)');
    grad.addColorStop(1, '#040406');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, width, height);

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = width / height;

    let drawW, drawH, drawX, drawY;

    // Scale up to maximize grand silhouette presentation
    if (canvasAspect > imgAspect) {
      drawH = height * 0.98;
      drawW = drawH * imgAspect;
    } else {
      drawW = width * 0.98;
      drawH = drawW / imgAspect;
    }

    drawX = (width - drawW) / 2;
    drawY = (height - drawH) / 2 + (height * 0.01);

    if (this.isZoomed) {
      const scale = this.zoomLevel;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(0, 0, width, height);
      this.ctx.clip();

      const focusX = drawX + drawW * this.zoomX;
      const focusY = drawY + drawH * this.zoomY;

      this.ctx.translate(width * 0.5 - (focusX - width * 0.5) * (scale - 1), height * 0.5 - (focusY - height * 0.5) * (scale - 1));
      this.ctx.drawImage(img, drawX, drawY, drawW * scale, drawH * scale);
      this.ctx.restore();
    } else {
      this.ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }
  }
}

window.DressViewer360 = DressViewer360;
