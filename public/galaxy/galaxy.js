(function () {
  var THREE = window.THREE;
  var PORTFOLIO = window.PORTFOLIO;

  if (!THREE || !PORTFOLIO) {
    return;
  }

  var DEFAULT_CAMERA = { x: 0, y: 60, z: 280 };
  var CLOSE_DURATION_MS = 400;
  var AUTO_ROTATION_IDLE_MS = 4000;
  var SUN_REVEAL_DURATION_MS = 600;
  var PLANET_REVEAL_DURATION_MS = 500;
  var PLANET_REVEAL_START_MS = 400;
  var PLANET_REVEAL_STAGGER_MS = 200;
  var ASTEROID_REVEAL_START_MS = 900;
  var ASTEROID_REVEAL_DURATION_MS = 420;
  var LABEL_MARGIN = 20;
  var LABEL_GAP = 16;
  var LABEL_CONNECTOR_GAP = 8;
  var LABEL_PLACEHOLDER_DELAY_MS = 160;
  var LABEL_SMOOTHING = 0.24;
  var LABEL_FOCUS_FREEZE_MS = 1250;
  var LABEL_LAYOUT_HYSTERESIS = 18;
  var DETAIL_VISIBILITY_WIDTH = 1320;
  var PANEL_SAFE_WIDTH = 388;
  var PANEL_SAFE_GAP = 18;

  var LABEL_PLACEMENTS = {
    top: { x: 0, y: -1 },
    "top-right": { x: 1, y: -1 },
    right: { x: 1, y: 0 },
    "bottom-right": { x: 1, y: 1 },
    bottom: { x: 0, y: 1 },
    "bottom-left": { x: -1, y: 1 },
    left: { x: -1, y: 0 },
    "top-left": { x: -1, y: -1 },
  };

  var LABEL_PLACEMENT_FALLBACKS = {
    top: ["top", "top-right", "top-left", "right", "left", "bottom"],
    "top-right": ["top-right", "right", "top", "bottom-right", "top-left", "left"],
    right: ["right", "top-right", "bottom-right", "top", "bottom", "left"],
    "bottom-right": ["bottom-right", "right", "bottom", "top-right", "left"],
    bottom: ["bottom", "bottom-right", "bottom-left", "right", "left", "top"],
    "bottom-left": ["bottom-left", "left", "bottom", "top-left", "right"],
    left: ["left", "top-left", "bottom-left", "top", "bottom", "right"],
    "top-left": ["top-left", "left", "top", "bottom-left", "top-right", "right"],
  };

  var root = null;
  var triggerButton = null;
  var overlay = null;
  var canvasWrapper = null;
  var labelLayer = null;
  var asteroidCardLayer = null;
  var panelShell = null;
  var panel = null;
  var exitButton = null;

  var renderer = null;
  var scene = null;
  var camera = null;
  var controls = null;
  var raycaster = null;
  var mouse = null;
  var systemGroup = null;
  var projectGroup = null;
  var sun = null;
  var sunRing = null;
  var starField = null;

  var frameId = 0;
  var cleanupSceneListeners = [];
  var timers = [];
  var interactionTimer = 0;
  var isOpen = false;
  var isClosing = false;
  var sceneReady = false;
  var isMobile = false;
  var userInteracting = false;
  var entranceStartTime = 0;
  var labelLayoutFreezeUntil = 0;

  var clickablePlanets = [];
  var clickableAsteroids = [];
  var planetEntries = [];
  var asteroidEntries = [];
  var labelEntries = [];
  var ripples = [];
  var tweens = [];
  var hoveredObject = null;
  var selectedPlanet = null;
  var activeAsteroidCard = null;

  function createElement(tagName, className, innerHTML) {
    var element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (innerHTML) {
      element.innerHTML = innerHTML;
    }
    return element;
  }

  function trackTimer(timerId) {
    timers.push(timerId);
    return timerId;
  }

  function clearTrackedTimers() {
    while (timers.length) {
      window.clearTimeout(timers.pop());
    }
    window.clearTimeout(interactionTimer);
    interactionTimer = 0;
  }

  function addSceneListener(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    cleanupSceneListeners.push(function () {
      target.removeEventListener(type, handler, options);
    });
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function createRoot() {
    if (root) {
      return;
    }

    root = createElement("div");
    root.id = "galaxy-portfolio-root";

    triggerButton = createElement(
      "button",
      "galaxy-trigger",
      [
        '<span class="galaxy-trigger-glyph" aria-hidden="true">[]</span>',
        '<span class="galaxy-trigger-copy">',
        '<span class="galaxy-trigger-copy-default">View Galaxy</span>',
        '<span class="galaxy-trigger-copy-hover">Enter System -></span>',
        "</span>",
      ].join("")
    );
    triggerButton.type = "button";
    triggerButton.setAttribute("aria-label", "View galaxy");

    overlay = createElement("div", "galaxy-overlay");
    canvasWrapper = createElement("div");
    canvasWrapper.id = "galaxy-canvas-wrapper";
    labelLayer = createElement("div", "galaxy-label-layer");
    asteroidCardLayer = createElement("div", "galaxy-asteroid-card-layer");
    exitButton = createElement("button", "galaxy-exit", "Exit System");
    exitButton.type = "button";
    panelShell = createElement("div", "galaxy-panel-shell");
    panel = createElement("aside", "galaxy-planet-panel");

    panelShell.appendChild(panel);
    overlay.appendChild(canvasWrapper);
    overlay.appendChild(labelLayer);
    overlay.appendChild(asteroidCardLayer);
    overlay.appendChild(exitButton);
    overlay.appendChild(panelShell);

    root.appendChild(triggerButton);
    root.appendChild(overlay);
    document.body.appendChild(root);

    triggerButton.addEventListener("click", openGalaxy);
    exitButton.addEventListener("click", function () {
      closeGalaxy();
    });
  }

  function createScene() {
    if (sceneReady) {
      return;
    }

    isMobile = window.innerWidth < 768;
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2(-10, -10);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(DEFAULT_CAMERA.x, DEFAULT_CAMERA.y, DEFAULT_CAMERA.z);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    canvasWrapper.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 80;
    controls.maxDistance = 420;
    controls.target.set(0, 0, 0);
    controls.update();
    controls.addEventListener("start", markUserInteracting);
    controls.addEventListener("end", scheduleAutoRotationResume);

    systemGroup = new THREE.Group();
    projectGroup = new THREE.Group();
    scene.add(systemGroup);
    scene.add(projectGroup);

    createLighting();
    createStarField();
    createSun();
    createPlanets();
    createAsteroids();
    createLabels();

    addSceneListener(window, "resize", handleResize);
    addSceneListener(document, "pointerdown", handleDocumentPointerDown, true);
    addSceneListener(renderer.domElement, "mousemove", handlePointerMove);
    addSceneListener(renderer.domElement, "mouseleave", handlePointerLeave);
    addSceneListener(renderer.domElement, "wheel", markUserInteracting, {
      passive: true,
    });
    addSceneListener(renderer.domElement, "click", handleCanvasClick);

    entranceStartTime = performance.now();
    labelLayoutFreezeUntil = entranceStartTime + LABEL_PLACEHOLDER_DELAY_MS;
    sceneReady = true;
    animate();
  }

  function createLighting() {
    var pointLight = new THREE.PointLight(0xfffbe6, 2, 700);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    var ambientLight = new THREE.AmbientLight(0xe8f0ff, 0.25);
    scene.add(ambientLight);
  }

  function createStarField() {
    var starCount = isMobile ? 1000 : 2000;
    var positions = new Float32Array(starCount * 3);

    for (var index = 0; index < starCount; index += 1) {
      var radius = 900 * Math.cbrt(Math.random());
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.acos(2 * Math.random() - 1);
      var sinPhi = Math.sin(phi);
      positions[index * 3] = radius * sinPhi * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.cos(phi);
      positions[index * 3 + 2] = radius * sinPhi * Math.sin(theta);
    }

    var starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    var starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.8,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });

    starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
  }

  function createSun() {
    var segmentCount = isMobile ? 28 : 48;
    var sunGeometry = new THREE.SphereGeometry(18, segmentCount, segmentCount);
    var sunMaterial = new THREE.MeshStandardMaterial({
      color: 0xfffbe6,
      emissive: 0xfff5cc,
      emissiveIntensity: 1.4,
      roughness: 0.3,
    });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.scale.set(0, 0, 0);
    sun.userData.kind = "sun";
    systemGroup.add(sun);

    var ringGeometry = new THREE.TorusGeometry(24, 0.3, 8, 80);
    var ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
    });
    sunRing = new THREE.Mesh(ringGeometry, ringMaterial);
    sunRing.rotation.x = Math.PI / 2;
    sun.add(sunRing);
  }

  function getPlanetMaterial(planet) {
    if (planet.type === "education") {
      return new THREE.MeshStandardMaterial({
        color: planet.color,
        roughness: 0.8,
        metalness: 0.05,
      });
    }

    return new THREE.MeshStandardMaterial({
      color: planet.color,
      roughness: 0.65,
      metalness: 0.15,
      emissive: planet.color,
      emissiveIntensity: 0.12,
    });
  }

  function createOrbitLine(orbitRadius, tilt) {
    var points = [];

    for (var step = 0; step <= 64; step += 1) {
      var theta = (step / 64) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(theta) * orbitRadius,
          Math.sin(theta) * orbitRadius * Math.sin(tilt),
          Math.sin(theta) * orbitRadius
        )
      );
    }

    var orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    var orbitMaterial = new THREE.LineBasicMaterial({
      color: 0x888888,
      transparent: true,
      opacity: 0.12,
    });
    var orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    systemGroup.add(orbitLine);
  }

  function createPlanets() {
    clickablePlanets = [];
    planetEntries = [];

    PORTFOLIO.planets.forEach(function (planet, index) {
      var radius = 4.5 + (planet.prestige / 10) * 9;
      var orbitRadius = 65 + index * 50;
      var speed = 0.00028 + index * 0.00004;
      var tilt = THREE.MathUtils.degToRad(THREE.MathUtils.randFloat(-8, 8));
      var angle = Math.random() * Math.PI * 2;
      var group = new THREE.Group();
      var geometry = new THREE.SphereGeometry(
        radius,
        isMobile ? 18 : 26,
        isMobile ? 18 : 26
      );
      var material = getPlanetMaterial(planet);
      var mesh = new THREE.Mesh(geometry, material);
      var moonEntries = [];

      mesh.userData.kind = "planet";
      mesh.userData.planetId = planet.id;
      mesh.scale.set(0, 0, 0);
      group.add(mesh);
      systemGroup.add(group);
      createOrbitLine(orbitRadius, tilt);

      if (!isMobile) {
        (planet.moons || []).forEach(function (moon, moonIndex) {
          var moonGeometry = new THREE.SphereGeometry(1.8, 16, 16);
          var moonMaterial = new THREE.MeshStandardMaterial({
            color: 0x999999,
            roughness: 0.9,
          });
          var moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
          moonMesh.scale.set(0, 0, 0);
          group.add(moonMesh);
          moonEntries.push({
            data: moon,
            mesh: moonMesh,
            angle: Math.random() * Math.PI * 2,
            orbitRadius: radius + 7 + moonIndex * 6,
            speed: speed * 5,
          });
        });
      }

      var entry = {
        data: planet,
        group: group,
        mesh: mesh,
        moonEntries: moonEntries,
        radius: radius,
        orbitRadius: orbitRadius,
        speed: speed,
        tilt: tilt,
        angle: angle,
        frozen: false,
        revealStart: PLANET_REVEAL_START_MS + index * PLANET_REVEAL_STAGGER_MS,
        labelReadyAt:
          PLANET_REVEAL_START_MS + index * PLANET_REVEAL_STAGGER_MS + PLANET_REVEAL_DURATION_MS,
      };

      group.position.set(
        Math.cos(angle) * orbitRadius,
        Math.sin(angle) * orbitRadius * Math.sin(tilt),
        Math.sin(angle) * orbitRadius
      );

      clickablePlanets.push(mesh);
      planetEntries.push(entry);
    });
  }

  function createAsteroids() {
    clickableAsteroids = [];
    asteroidEntries = [];

    var asteroids = PORTFOLIO.asteroids || [];
    var beltRadius = 65 + (PORTFOLIO.planets.length * 50) / 2 + 26;
    var visibleRadius = isMobile ? 3.9 : 3.3;
    var hitRadius = isMobile ? 9.5 : 7.6;

    asteroids.forEach(function (asteroid, index) {
      var geometry =
        index % 2 === 0
          ? new THREE.DodecahedronGeometry(visibleRadius, 0)
          : new THREE.IcosahedronGeometry(visibleRadius * 0.92, 0);
      var shade = index % 2 === 0 ? 0xa3a3a3 : 0xc1c1c1;
      var material = new THREE.MeshStandardMaterial({
        color: shade,
        roughness: 0.92,
        metalness: 0.02,
      });
      var mesh = new THREE.Mesh(geometry, material);
      var hitGeometry = new THREE.SphereGeometry(hitRadius, 14, 14);
      var hitMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      var hitArea = new THREE.Mesh(hitGeometry, hitMaterial);
      var baseAngle = (index / Math.max(asteroids.length, 1)) * Math.PI * 2;
      var angleOffset = Math.sin((index + 1) * 2.71) * 0.16;
      var angle = baseAngle + angleOffset;
      var radialJitter = Math.cos((index + 1) * 1.93) * 14;
      var verticalJitter = Math.sin((index + 1) * 1.37) * 8;
      var finalRadius = beltRadius + radialJitter;
      var position = new THREE.Vector3(
        Math.cos(angle) * finalRadius,
        verticalJitter,
        Math.sin(angle) * finalRadius
      );

      mesh.userData.kind = "asteroid";
      mesh.userData.asteroidId = asteroid.id;
      mesh.scale.set(0, 0, 0);
      mesh.position.copy(position);
      projectGroup.add(mesh);

      hitArea.userData.kind = "asteroid";
      hitArea.userData.asteroidId = asteroid.id;
      hitArea.userData.hitTarget = mesh;
      hitArea.scale.set(0, 0, 0);
      hitArea.position.copy(position);
      projectGroup.add(hitArea);

      asteroidEntries.push({
        data: asteroid,
        mesh: mesh,
        hitArea: hitArea,
        position: position,
        rotationX: 0.0009 + index * 0.00008,
        rotationZ: 0.0007 + index * 0.00007,
        revealStart: ASTEROID_REVEAL_START_MS,
        labelReadyAt: ASTEROID_REVEAL_START_MS + ASTEROID_REVEAL_DURATION_MS,
      });
      clickableAsteroids.push(hitArea);
    });
  }

  function getLabelPreferredPlacements(preferredPlacement) {
    return LABEL_PLACEMENT_FALLBACKS[preferredPlacement] || LABEL_PLACEMENT_FALLBACKS.top;
  }

  function createLabel(kind, config) {
    var element = createElement("div", "galaxy-label");
    element.dataset.kind = kind;

    var connector = createElement("div", "galaxy-label-connector");
    var content = createElement("div", "galaxy-label-content");
    var main = createElement("span", "galaxy-label-main");
    var sub = createElement("span", "galaxy-label-sub");

    main.textContent = config.mainText;
    sub.textContent = config.subText || "";

    if (!config.subText) {
      sub.hidden = true;
    }

    content.appendChild(main);
    content.appendChild(sub);
    element.appendChild(connector);
    element.appendChild(content);
    labelLayer.appendChild(element);

    return {
      element: element,
      connector: connector,
      content: content,
      main: main,
      sub: sub,
    };
  }

  function createLabels() {
    labelEntries = [];

    var sunLabel = createLabel("sun", {
      mainText: "Download Resume",
      subText: "Primary orbit",
    });

    labelEntries.push({
      kind: "sun",
      entry: null,
      data: {
        label: "Download Resume",
        labelShort: "Resume",
        labelDetail: "Primary orbit",
        labelPriority: 90,
        preferredLabelPlacement: "top",
      },
      element: sunLabel.element,
      connector: sunLabel.connector,
      content: sunLabel.content,
      main: sunLabel.main,
      sub: sunLabel.sub,
      anchorWorldPosition: new THREE.Vector3(),
      anchorScreenPosition: { x: 0, y: 0 },
      smoothedPosition: { x: 0, y: 0 },
      targetPosition: { x: 0, y: 0 },
      currentPlacement: "top",
      currentRect: null,
      currentConnector: null,
      visible: false,
    });

    planetEntries.forEach(function (planetEntry) {
      var label = createLabel("planet", {
        mainText: planetEntry.data.labelShort || planetEntry.data.label,
        subText: planetEntry.data.labelDetail || planetEntry.data.sublabel,
      });

      labelEntries.push({
        kind: "planet",
        entry: planetEntry,
        data: planetEntry.data,
        element: label.element,
        connector: label.connector,
        content: label.content,
        main: label.main,
        sub: label.sub,
        anchorWorldPosition: new THREE.Vector3(),
        anchorScreenPosition: { x: 0, y: 0 },
        smoothedPosition: { x: 0, y: 0 },
        targetPosition: { x: 0, y: 0 },
        currentPlacement: planetEntry.data.preferredLabelPlacement || "top",
        currentRect: null,
        currentConnector: null,
        visible: false,
      });
    });

    asteroidEntries.forEach(function (asteroidEntry) {
      var label = createLabel("asteroid", {
        mainText: asteroidEntry.data.labelShort || asteroidEntry.data.label,
      });

      labelEntries.push({
        kind: "asteroid",
        entry: asteroidEntry,
        data: asteroidEntry.data,
        element: label.element,
        connector: label.connector,
        content: label.content,
        main: label.main,
        sub: label.sub,
        anchorWorldPosition: new THREE.Vector3(),
        anchorScreenPosition: { x: 0, y: 0 },
        smoothedPosition: { x: 0, y: 0 },
        targetPosition: { x: 0, y: 0 },
        currentPlacement: asteroidEntry.data.preferredLabelPlacement || "top",
        currentRect: null,
        currentConnector: null,
        visible: false,
      });
    });
  }

  function markUserInteracting() {
    userInteracting = true;
    window.clearTimeout(interactionTimer);
    interactionTimer = 0;
  }

  function scheduleAutoRotationResume() {
    window.clearTimeout(interactionTimer);
    interactionTimer = window.setTimeout(function () {
      userInteracting = false;
    }, AUTO_ROTATION_IDLE_MS);
  }

  function handleResize() {
    if (!renderer || !camera) {
      return;
    }

    isMobile = window.innerWidth < 768;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelEntries.forEach(function (labelEntry) {
      labelEntry.currentRect = null;
    });
  }

  function projectToScreen(position) {
    var vector = position.clone().project(camera);

    return {
      x: (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth,
      y: (-vector.y * 0.5 + 0.5) * renderer.domElement.clientHeight,
      z: vector.z,
    };
  }

  function isObjectVisible(worldPosition) {
    var projected = worldPosition.clone().project(camera);

    if (projected.z > 1 || projected.z < -1) {
      return false;
    }

    var cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    var objectDirection = worldPosition.clone().sub(camera.position).normalize();
    return cameraDirection.dot(objectDirection) > 0;
  }

  function getWorldPositionForLabel(kind, entry) {
    if (kind === "sun") {
      return new THREE.Vector3(0, 0, 0);
    }

    if (kind === "planet") {
      return entry.group.position.clone();
    }

    return entry.mesh.position.clone();
  }

  function getRevealProgress(now, delay, duration) {
    var elapsed = now - entranceStartTime - delay;
    return clamp(elapsed / duration, 0, 1);
  }

  function updateRevealState(now) {
    var sunProgress = getRevealProgress(now, 0, SUN_REVEAL_DURATION_MS);
    sun.scale.setScalar(easeOutCubic(sunProgress));

    planetEntries.forEach(function (planetEntry) {
      var planetProgress = getRevealProgress(
        now,
        planetEntry.revealStart,
        PLANET_REVEAL_DURATION_MS
      );
      var scale = easeOutCubic(planetProgress);

      planetEntry.mesh.scale.setScalar(scale);
      planetEntry.moonEntries.forEach(function (moonEntry) {
        moonEntry.mesh.scale.setScalar(scale);
      });
    });

    asteroidEntries.forEach(function (asteroidEntry) {
      var asteroidProgress = getRevealProgress(
        now,
        asteroidEntry.revealStart,
        ASTEROID_REVEAL_DURATION_MS
      );
      var scale = easeOutCubic(asteroidProgress);
      asteroidEntry.mesh.scale.setScalar(scale);
      asteroidEntry.hitArea.scale.setScalar(scale);
    });
  }

  function updatePlanets() {
    planetEntries.forEach(function (planetEntry) {
      if (!planetEntry.frozen) {
        planetEntry.angle += planetEntry.speed;
      }

      planetEntry.group.position.x = Math.cos(planetEntry.angle) * planetEntry.orbitRadius;
      planetEntry.group.position.z = Math.sin(planetEntry.angle) * planetEntry.orbitRadius;
      planetEntry.group.position.y =
        Math.sin(planetEntry.angle) *
        planetEntry.orbitRadius *
        Math.sin(planetEntry.tilt);

      planetEntry.mesh.rotation.y += 0.005;

      planetEntry.moonEntries.forEach(function (moonEntry) {
        moonEntry.angle += moonEntry.speed;
        moonEntry.mesh.position.set(
          Math.cos(moonEntry.angle) * moonEntry.orbitRadius,
          Math.sin(moonEntry.angle * 0.8) * 1.8,
          Math.sin(moonEntry.angle) * moonEntry.orbitRadius
        );
      });
    });
  }

  function updateAsteroids() {
    asteroidEntries.forEach(function (asteroidEntry) {
      asteroidEntry.mesh.rotation.x += asteroidEntry.rotationX;
      asteroidEntry.mesh.rotation.z += asteroidEntry.rotationZ;
    });
  }

  function createSunRipple() {
    var geometry = new THREE.RingGeometry(18, 18.8, 64);
    var material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    var ripple = new THREE.Mesh(geometry, material);
    ripple.rotation.x = Math.PI / 2;
    ripple.position.set(0, 0, 0);
    ripple.scale.set(1, 1, 1);
    systemGroup.add(ripple);
    ripples.push({
      mesh: ripple,
      startTime: performance.now(),
      duration: 800,
    });
  }

  function updateRipples(now) {
    ripples = ripples.filter(function (ripple) {
      var progress = clamp((now - ripple.startTime) / ripple.duration, 0, 1);
      var radiusScale = 1 + progress * ((60 / 18) - 1);
      ripple.mesh.scale.setScalar(radiusScale);
      ripple.mesh.material.opacity = 0.6 * (1 - progress);

      if (progress >= 1) {
        systemGroup.remove(ripple.mesh);
        ripple.mesh.geometry.dispose();
        ripple.mesh.material.dispose();
        return false;
      }

      return true;
    });
  }

  function createTween(options) {
    tweens.push({
      startTime: performance.now(),
      duration: options.duration,
      onUpdate: options.onUpdate,
      onComplete: options.onComplete,
    });
  }

  function updateTweens(now) {
    tweens = tweens.filter(function (tween) {
      var progress = clamp((now - tween.startTime) / tween.duration, 0, 1);
      tween.onUpdate(easeOutCubic(progress));

      if (progress >= 1) {
        if (tween.onComplete) {
          tween.onComplete();
        }
        return false;
      }

      return true;
    });
  }

  function getIntersectedObject(event) {
    if (!renderer || !raycaster || !camera) {
      return null;
    }

    var bounds = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    var sunHit = raycaster.intersectObject(sun, false);
    if (sunHit.length) {
      return sun;
    }

    var planetHits = raycaster.intersectObjects(clickablePlanets, false);
    if (planetHits.length) {
      return planetHits[0].object;
    }

    var asteroidHits = raycaster.intersectObjects(clickableAsteroids, false);
    if (asteroidHits.length) {
      return asteroidHits[0].object.userData.hitTarget || asteroidHits[0].object;
    }

    return null;
  }

  function updateHoverState(object) {
    hoveredObject = object;
    if (renderer && renderer.domElement) {
      renderer.domElement.style.cursor = object ? "pointer" : "default";
    }
  }

  function handlePointerMove(event) {
    if (!sceneReady) {
      return;
    }

    updateHoverState(getIntersectedObject(event));
  }

  function handlePointerLeave() {
    updateHoverState(null);
  }

  function getPlanetEntryByMesh(mesh) {
    return planetEntries.find(function (planetEntry) {
      return planetEntry.mesh === mesh;
    });
  }

  function getAsteroidEntryByMesh(mesh) {
    return asteroidEntries.find(function (asteroidEntry) {
      return asteroidEntry.mesh === mesh || asteroidEntry.hitArea === mesh;
    });
  }

  function handleCanvasClick(event) {
    if (!sceneReady) {
      return;
    }

    markUserInteracting();
    scheduleAutoRotationResume();

    var object = getIntersectedObject(event);

    if (!object) {
      closeAsteroidCard();
      return;
    }

    if (object === sun) {
      createSunRipple();
      window.open(PORTFOLIO.resume.url);
      return;
    }

    if (object.userData.kind === "planet") {
      openPlanetPanel(getPlanetEntryByMesh(object));
      closeAsteroidCard();
      return;
    }

    if (object.userData.kind === "asteroid") {
      openAsteroidCard(getAsteroidEntryByMesh(object));
    }
  }

  function renderPlanetPanel(planetEntry) {
    var moons = (planetEntry.data.moons || [])
      .map(function (moon) {
        return (
          '<span class="galaxy-moon-chip" title="' +
          moon.description.replace(/"/g, "&quot;") +
          '">' +
          moon.label +
          "</span>"
        );
      })
      .join("");

    panel.innerHTML = [
      '<p class="galaxy-panel-kicker">Planet Detail</p>',
      '<h2 class="galaxy-panel-title">' + planetEntry.data.label + "</h2>",
      '<p class="galaxy-panel-sublabel">' + planetEntry.data.sublabel + "</p>",
      '<p class="galaxy-panel-description">' + planetEntry.data.description + "</p>",
      '<section class="galaxy-panel-section">',
      '<p class="galaxy-panel-section-title">Moons</p>',
      '<div class="galaxy-panel-moons">' + moons + "</div>",
      "</section>",
      '<div class="galaxy-panel-spacer"></div>',
      '<button type="button" class="galaxy-panel-back"><- Back to System</button>',
    ].join("");

    var backButton = panel.querySelector(".galaxy-panel-back");
    backButton.addEventListener("click", function () {
      closePlanetPanel();
    });
  }

  function openPlanetPanel(planetEntry) {
    if (!planetEntry || selectedPlanet === planetEntry) {
      return;
    }

    if (selectedPlanet) {
      selectedPlanet.frozen = false;
    }

    selectedPlanet = planetEntry;
    selectedPlanet.frozen = true;
    controls.enabled = false;
    renderPlanetPanel(planetEntry);
    labelLayoutFreezeUntil = performance.now() + LABEL_FOCUS_FREEZE_MS;

    var fromPosition = camera.position.clone();
    var fromTarget = controls.target.clone();
    var toTarget = planetEntry.group.position.clone();
    var toPosition = planetEntry.group.position
      .clone()
      .add(new THREE.Vector3(0, planetEntry.radius * 0.5, planetEntry.radius * 4));

    createTween({
      duration: 1200,
      onUpdate: function (progress) {
        camera.position.lerpVectors(fromPosition, toPosition, progress);
        controls.target.lerpVectors(fromTarget, toTarget, progress);
        controls.update();
      },
      onComplete: function () {
        panel.classList.add("is-visible");
      },
    });
  }

  function closePlanetPanel() {
    if (!selectedPlanet) {
      return;
    }

    panel.classList.remove("is-visible");
    labelLayoutFreezeUntil = performance.now() + LABEL_FOCUS_FREEZE_MS;

    var fromPosition = camera.position.clone();
    var fromTarget = controls.target.clone();
    var toPosition = new THREE.Vector3(
      DEFAULT_CAMERA.x,
      DEFAULT_CAMERA.y,
      DEFAULT_CAMERA.z
    );
    var toTarget = new THREE.Vector3(0, 0, 0);
    var closingPlanet = selectedPlanet;

    createTween({
      duration: 900,
      onUpdate: function (progress) {
        camera.position.lerpVectors(fromPosition, toPosition, progress);
        controls.target.lerpVectors(fromTarget, toTarget, progress);
        controls.update();
      },
      onComplete: function () {
        closingPlanet.frozen = false;
        selectedPlanet = null;
        controls.enabled = true;
      },
    });
  }

  function updateAsteroidCardPosition() {
    if (!activeAsteroidCard) {
      return;
    }

    var position = activeAsteroidCard.entry.mesh.position.clone().add(new THREE.Vector3(0, 8, 0));

    if (!isObjectVisible(position)) {
      activeAsteroidCard.element.classList.remove("is-visible");
      return;
    }

    var projected = projectToScreen(position);
    activeAsteroidCard.element.style.left = projected.x + "px";
    activeAsteroidCard.element.style.top = projected.y - 80 + "px";
    activeAsteroidCard.element.classList.add("is-visible");
  }

  function closeAsteroidCard() {
    if (!activeAsteroidCard) {
      return;
    }

    activeAsteroidCard.element.remove();
    activeAsteroidCard = null;
  }

  function navigateToProject(entry) {
    var currentPath = window.location.pathname;

    if (currentPath === "/lightmode") {
      trackTimer(
        window.setTimeout(function () {
          var target = document.querySelector(entry.data.cardSelector);
          if (!target) {
            return;
          }
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          target.classList.remove("galaxy-highlight");
          void target.offsetWidth;
          target.classList.add("galaxy-highlight");
          trackTimer(
            window.setTimeout(function () {
              target.classList.remove("galaxy-highlight");
            }, 1600)
          );
        }, 40)
      );
      return;
    }

    window.location.href = entry.data.url;
  }

  function openAsteroidCard(asteroidEntry) {
    if (!asteroidEntry) {
      return;
    }

    closeAsteroidCard();

    var card = createElement("div", "galaxy-asteroid-card");
    card.innerHTML = [
      '<div class="galaxy-asteroid-title">' + asteroidEntry.data.label + "</div>",
      '<p class="galaxy-asteroid-description">' + asteroidEntry.data.description + "</p>",
      '<div class="galaxy-asteroid-tags">' +
        asteroidEntry.data.tags
          .map(function (tag) {
            return '<span class="galaxy-asteroid-tag">' + tag + "</span>";
          })
          .join("") +
        "</div>",
      '<button type="button" class="galaxy-asteroid-action">View Project</button>',
    ].join("");

    asteroidCardLayer.appendChild(card);
    activeAsteroidCard = {
      entry: asteroidEntry,
      element: card,
    };

    var actionButton = card.querySelector(".galaxy-asteroid-action");
    actionButton.addEventListener("click", function () {
      closeGalaxy({
        afterClose: function () {
          navigateToProject(asteroidEntry);
        },
      });
    });

    trackTimer(
      window.setTimeout(function () {
        if (activeAsteroidCard && activeAsteroidCard.element === card) {
          card.classList.add("is-visible");
        }
      }, 16)
    );
  }

  function handleDocumentPointerDown(event) {
    if (!activeAsteroidCard) {
      return;
    }

    if (activeAsteroidCard.element.contains(event.target)) {
      return;
    }

    if (renderer && renderer.domElement && event.target === renderer.domElement) {
      return;
    }

    closeAsteroidCard();
  }

  function shouldShowLabelDetails(labelEntry) {
    if (labelEntry.kind === "sun") {
      return true;
    }

    if (labelEntry.kind === "asteroid") {
      return false;
    }

    if (selectedPlanet && labelEntry.entry === selectedPlanet) {
      return true;
    }

    if (hoveredObject && labelEntry.entry && hoveredObject === labelEntry.entry.mesh) {
      return true;
    }

    return window.innerWidth >= DETAIL_VISIBILITY_WIDTH && labelEntry.data.labelPriority >= 80;
  }

  function getLabelPriority(labelEntry) {
    var basePriority = labelEntry.data.labelPriority || 0;

    if (labelEntry.kind === "sun") {
      basePriority = 88;
    }

    if (selectedPlanet && labelEntry.entry === selectedPlanet) {
      return basePriority + 300;
    }

    if (hoveredObject && labelEntry.entry && hoveredObject === labelEntry.entry.mesh) {
      return basePriority + 220;
    }

    if (hoveredObject === sun && labelEntry.kind === "sun") {
      return basePriority + 180;
    }

    return basePriority;
  }

  function getSafeRects() {
    var rects = [];
    var viewportWidth = renderer.domElement.clientWidth;
    var viewportHeight = renderer.domElement.clientHeight;

    rects.push({
      left: -Infinity,
      top: -Infinity,
      right: LABEL_MARGIN,
      bottom: Infinity,
    });
    rects.push({
      left: viewportWidth - LABEL_MARGIN,
      top: -Infinity,
      right: Infinity,
      bottom: Infinity,
    });
    rects.push({
      left: -Infinity,
      top: -Infinity,
      right: Infinity,
      bottom: LABEL_MARGIN,
    });
    rects.push({
      left: -Infinity,
      top: viewportHeight - LABEL_MARGIN,
      right: Infinity,
      bottom: Infinity,
    });

    if (exitButton) {
      var exitRect = exitButton.getBoundingClientRect();
      rects.push({
        left: exitRect.left - 12,
        top: exitRect.top - 12,
        right: exitRect.right + 12,
        bottom: exitRect.bottom + 12,
      });
    }

    if (panel && panel.classList.contains("is-visible")) {
      rects.push({
        left: viewportWidth - PANEL_SAFE_WIDTH - PANEL_SAFE_GAP,
        top: 0,
        right: viewportWidth,
        bottom: viewportHeight,
      });
    }

    return rects;
  }

  function rectsIntersect(a, b) {
    return !(
      a.right <= b.left ||
      a.left >= b.right ||
      a.bottom <= b.top ||
      a.top >= b.bottom
    );
  }

  function isRectInsideViewport(rect, viewportWidth, viewportHeight) {
    return (
      rect.left >= LABEL_MARGIN &&
      rect.top >= LABEL_MARGIN &&
      rect.right <= viewportWidth - LABEL_MARGIN &&
      rect.bottom <= viewportHeight - LABEL_MARGIN
    );
  }

  function getPlacementMetrics(anchor, width, height, placement) {
    var vector = LABEL_PLACEMENTS[placement] || LABEL_PLACEMENTS.top;
    var horizontalBias = vector.x === 0 ? 0.5 : vector.x > 0 ? 0 : 1;
    var verticalBias = vector.y === 0 ? 0.5 : vector.y > 0 ? 0 : 1;
    var horizontalGap = width * 0.18 + LABEL_GAP;
    var verticalGap = height * 0.18 + LABEL_GAP;
    var x = anchor.x + vector.x * horizontalGap - width * horizontalBias;
    var y = anchor.y + vector.y * verticalGap - height * verticalBias;

    return {
      rect: {
        left: x,
        top: y,
        right: x + width,
        bottom: y + height,
      },
      boxX: x,
      boxY: y,
      contentX: x,
      contentY: y,
    };
  }

  function clampPlacementRect(rect, viewportWidth, viewportHeight) {
    var width = rect.right - rect.left;
    var height = rect.bottom - rect.top;
    var left = clamp(rect.left, LABEL_MARGIN, viewportWidth - LABEL_MARGIN - width);
    var top = clamp(rect.top, LABEL_MARGIN, viewportHeight - LABEL_MARGIN - height);

    return {
      left: left,
      top: top,
      right: left + width,
      bottom: top + height,
    };
  }

  function getConnectorGeometry(rect, anchor) {
    var edgeX = clamp(anchor.x, rect.left + 10, rect.right - 10);
    var edgeY = clamp(anchor.y, rect.top + 10, rect.bottom - 10);

    if (anchor.x < rect.left) {
      edgeX = rect.left;
    } else if (anchor.x > rect.right) {
      edgeX = rect.right;
    }

    if (anchor.y < rect.top) {
      edgeY = rect.top;
    } else if (anchor.y > rect.bottom) {
      edgeY = rect.bottom;
    }

    var dx = edgeX - anchor.x;
    var dy = edgeY - anchor.y;
    var distance = Math.max(Math.sqrt(dx * dx + dy * dy) - LABEL_CONNECTOR_GAP, 0);
    var angle = Math.atan2(dy, dx);

    return {
      left: anchor.x,
      top: anchor.y,
      width: distance,
      angle: angle,
    };
  }

  function measureLabel(labelEntry) {
    var rect = labelEntry.content.getBoundingClientRect();
    return {
      width: Math.ceil(rect.width),
      height: Math.ceil(rect.height),
    };
  }

  function computeLabelAnchors(now) {
    labelEntries.forEach(function (labelEntry) {
      var worldPosition = getWorldPositionForLabel(labelEntry.kind, labelEntry.entry);
      var revealReady =
        labelEntry.kind === "sun" ||
        !labelEntry.entry ||
        now - entranceStartTime >= labelEntry.entry.labelReadyAt;

      labelEntry.anchorWorldPosition.copy(worldPosition);
      labelEntry.isAnchorVisible = revealReady && isObjectVisible(worldPosition);

      if (labelEntry.isAnchorVisible) {
        labelEntry.anchorScreenPosition = projectToScreen(worldPosition);
      }

      var showDetails = shouldShowLabelDetails(labelEntry);
      labelEntry.element.classList.toggle("is-detailed", showDetails);
      labelEntry.sub.hidden = !showDetails || !labelEntry.sub.textContent;
      labelEntry.layoutPriority = getLabelPriority(labelEntry);
    });
  }

  function shouldKeepLabelDuringFreeze(labelEntry) {
    if (labelEntry.kind === "sun") {
      return true;
    }

    if (selectedPlanet && labelEntry.entry === selectedPlanet) {
      return true;
    }

    if (hoveredObject && labelEntry.entry && hoveredObject === labelEntry.entry.mesh) {
      return true;
    }

    return false;
  }

  function selectPlacementForLabel(labelEntry, viewportWidth, viewportHeight, safeRects, placedRects) {
    var dimensions = measureLabel(labelEntry);
    var placements = getLabelPreferredPlacements(
      labelEntry.data.preferredLabelPlacement || labelEntry.currentPlacement || "top"
    );
    var anchor = labelEntry.anchorScreenPosition;
    var bestFit = null;

    placements.forEach(function (placement) {
      var metrics = getPlacementMetrics(anchor, dimensions.width, dimensions.height, placement);
      var rect = metrics.rect;
      var insideViewport = isRectInsideViewport(rect, viewportWidth, viewportHeight);
      var collides = false;

      if (!insideViewport) {
        return;
      }

      for (var index = 0; index < safeRects.length; index += 1) {
        if (rectsIntersect(rect, safeRects[index])) {
          collides = true;
          break;
        }
      }

      if (collides) {
        return;
      }

      for (var placedIndex = 0; placedIndex < placedRects.length; placedIndex += 1) {
        if (rectsIntersect(rect, placedRects[placedIndex])) {
          collides = true;
          break;
        }
      }

      if (collides) {
        return;
      }

      var distance = Math.abs(rect.left + rect.right - anchor.x * 2) + Math.abs(rect.top + rect.bottom - anchor.y * 2);
      if (labelEntry.currentPlacement === placement) {
        distance -= LABEL_LAYOUT_HYSTERESIS;
      }

      if (!bestFit || distance < bestFit.score) {
        bestFit = {
          placement: placement,
          rect: rect,
          score: distance,
        };
      }
    });

    if (bestFit) {
      return bestFit;
    }

    if (labelEntry.layoutPriority >= 88 || (selectedPlanet && labelEntry.entry === selectedPlanet)) {
      var fallbackMetrics = getPlacementMetrics(
        anchor,
        dimensions.width,
        dimensions.height,
        labelEntry.currentPlacement || placements[0]
      );
      var clampedRect = clampPlacementRect(fallbackMetrics.rect, viewportWidth, viewportHeight);

      return {
        placement: labelEntry.currentPlacement || placements[0],
        rect: clampedRect,
        score: 9999,
      };
    }

    return null;
  }

  function applyLabelPlacement(labelEntry, placementResult) {
    var rect = placementResult.rect;
    var connector = getConnectorGeometry(rect, labelEntry.anchorScreenPosition);

    if (!labelEntry.visible) {
      labelEntry.smoothedPosition.x = rect.left;
      labelEntry.smoothedPosition.y = rect.top;
    } else {
      labelEntry.smoothedPosition.x = lerp(
        labelEntry.smoothedPosition.x,
        rect.left,
        LABEL_SMOOTHING
      );
      labelEntry.smoothedPosition.y = lerp(
        labelEntry.smoothedPosition.y,
        rect.top,
        LABEL_SMOOTHING
      );
    }

    labelEntry.targetPosition.x = rect.left;
    labelEntry.targetPosition.y = rect.top;
    labelEntry.currentPlacement = placementResult.placement;
    labelEntry.currentRect = {
      left: labelEntry.smoothedPosition.x,
      top: labelEntry.smoothedPosition.y,
      right: labelEntry.smoothedPosition.x + (rect.right - rect.left),
      bottom: labelEntry.smoothedPosition.y + (rect.bottom - rect.top),
    };
    labelEntry.currentConnector = connector;
    labelEntry.visible = true;

    labelEntry.element.classList.remove("is-hidden");
    labelEntry.element.dataset.placement = placementResult.placement;
    labelEntry.element.style.opacity = String(
      hoveredObject && labelEntry.entry && hoveredObject === labelEntry.entry.mesh ? 1 : 0.96
    );

    labelEntry.content.style.left = labelEntry.smoothedPosition.x + "px";
    labelEntry.content.style.top = labelEntry.smoothedPosition.y + "px";
    labelEntry.connector.style.left = connector.left + "px";
    labelEntry.connector.style.top = connector.top + "px";
    labelEntry.connector.style.width = connector.width + "px";
    labelEntry.connector.style.transform = "rotate(" + connector.angle + "rad)";
  }

  function hideLabel(labelEntry) {
    labelEntry.visible = false;
    labelEntry.currentRect = null;
    labelEntry.element.classList.add("is-hidden");
    labelEntry.element.style.opacity = "0";
  }

  function layoutLabels(now) {
    var viewportWidth = renderer.domElement.clientWidth;
    var viewportHeight = renderer.domElement.clientHeight;
    var safeRects = getSafeRects();
    var placedRects = [];
    var freezeActive = now < labelLayoutFreezeUntil;
    var activeLabels = labelEntries
      .slice()
      .sort(function (a, b) {
        return b.layoutPriority - a.layoutPriority;
      });

    activeLabels.forEach(function (labelEntry) {
      if (!labelEntry.isAnchorVisible) {
        hideLabel(labelEntry);
        return;
      }

      if (freezeActive && !shouldKeepLabelDuringFreeze(labelEntry)) {
        hideLabel(labelEntry);
        return;
      }

      var placementResult = selectPlacementForLabel(
        labelEntry,
        viewportWidth,
        viewportHeight,
        safeRects,
        placedRects
      );

      if (!placementResult) {
        hideLabel(labelEntry);
        return;
      }

      applyLabelPlacement(labelEntry, placementResult);
      placedRects.push(labelEntry.currentRect);
    });
  }

  function animate() {
    frameId = window.requestAnimationFrame(animate);

    var now = performance.now();
    updateRevealState(now);
    updatePlanets();
    updateAsteroids();
    updateRipples(now);
    updateTweens(now);

    if (!userInteracting && systemGroup && !selectedPlanet) {
      systemGroup.rotation.y += 0.0008;
    }

    if (sun) {
      sun.rotation.y += 0.002;
    }
    if (sunRing) {
      sunRing.rotation.z -= 0.003;
    }

    controls.update();
    computeLabelAnchors(now);
    layoutLabels(now);
    updateAsteroidCardPosition();
    renderer.render(scene, camera);
  }

  function destroyThreeObjects() {
    if (!scene) {
      return;
    }

    scene.traverse(function (object) {
      if (object.geometry) {
        object.geometry.dispose();
      }

      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(function (material) {
            material.dispose();
          });
        } else {
          object.material.dispose();
        }
      }
    });
  }

  function destroyScene() {
    sceneReady = false;
    userInteracting = false;
    hoveredObject = null;
    selectedPlanet = null;
    tweens = [];
    ripples = [];
    clearTrackedTimers();
    closeAsteroidCard();
    panel.classList.remove("is-visible");
    panel.innerHTML = "";

    cleanupSceneListeners.forEach(function (cleanup) {
      cleanup();
    });
    cleanupSceneListeners = [];

    window.cancelAnimationFrame(frameId);
    frameId = 0;

    labelEntries.forEach(function (labelEntry) {
      labelEntry.element.remove();
    });
    labelEntries = [];

    if (controls) {
      controls.dispose();
    }

    destroyThreeObjects();

    if (renderer) {
      renderer.dispose();
      if (renderer.forceContextLoss) {
        renderer.forceContextLoss();
      }
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }

    renderer = null;
    scene = null;
    camera = null;
    controls = null;
    raycaster = null;
    mouse = null;
    systemGroup = null;
    projectGroup = null;
    sun = null;
    sunRing = null;
    starField = null;
    clickablePlanets = [];
    clickableAsteroids = [];
    planetEntries = [];
    asteroidEntries = [];
    labelLayoutFreezeUntil = 0;
  }

  function openGalaxy() {
    if (isOpen || isClosing) {
      return;
    }

    createRoot();
    createScene();
    isOpen = true;
    triggerButton.classList.add("is-hidden");
    overlay.classList.remove("is-closing");
    trackTimer(
      window.setTimeout(function () {
        overlay.classList.add("is-open");
      }, 16)
    );
  }

  function closeGalaxy(options) {
    if (!isOpen || isClosing) {
      return;
    }

    options = options || {};
    isClosing = true;
    overlay.classList.remove("is-open");
    overlay.classList.add("is-closing");
    panel.classList.remove("is-visible");

    trackTimer(
      window.setTimeout(function () {
        destroyScene();
        overlay.classList.remove("is-closing");
        triggerButton.classList.remove("is-hidden");
        isOpen = false;
        isClosing = false;

        if (typeof options.afterClose === "function") {
          options.afterClose();
        }
      }, CLOSE_DURATION_MS)
    );
  }

  function destroyRoot() {
    if (!root) {
      return;
    }

    triggerButton.removeEventListener("click", openGalaxy);
    root.remove();

    root = null;
    triggerButton = null;
    overlay = null;
    canvasWrapper = null;
    labelLayer = null;
    asteroidCardLayer = null;
    panelShell = null;
    panel = null;
    exitButton = null;
  }

  window.GalaxyPortfolioNavigator = {
    init: function () {
      createRoot();
    },
    destroy: function () {
      clearTrackedTimers();
      if (isOpen || isClosing) {
        destroyScene();
      }
      isOpen = false;
      isClosing = false;
      destroyRoot();
    },
  };
})();
