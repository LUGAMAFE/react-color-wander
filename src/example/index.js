import * as brush from 'p5.brush';
import SimplexNoise from 'simplex-noise';
import createPixels from './createPixels';
import createRange from './createRange';
import createSphere from './createSphere';

export default (opt = {}) => {
  const p = opt.p5Instance; // Obtenemos la instancia de p5.js
  const randFunc = opt.random || Math.random;
  const random = createRange(randFunc);

  const simplex = new SimplexNoise(randFunc);
  const { width, height } = p;
  const count = opt.count || 0;
  const palette = opt.palette || ['#fff', '#000'];
  const { backgroundImage } = opt;

  const maxRadius = typeof opt.maxRadius === 'number' ? opt.maxRadius : 10;
  const startArea = typeof opt.startArea === 'number' ? opt.startArea : 0.5;
  const pointilism = p.lerp(0.000001, 0.5, opt.pointilism);
  const noiseScalar = opt.noiseScalar || [0.00001, 0.0001];
  const globalAlpha = typeof opt.globalAlpha === 'number' ? opt.globalAlpha : 1;

  const heightMapImage = createPixels(p, backgroundImage, {
    scale: opt.backgroundScale,
    fillStyle: opt.backgroundFill
  });

  const heightMap = heightMapImage.data;
  let time = 0;

  // Crear una instancia de p5.brush usando el modo instancia
  const myBrush = new brush.Brush(p, {
    color: palette[0],
    size: maxRadius,
    mode: 'normal',
    dynamic: false
  });

  const resetParticle = (particle = {}) => {
    const p = particle;
    const scale = Math.min(width, height) / 2;

    p.position = createSphere([], random(0, scale * startArea), randFunc);
    p.position[0] += width / 2;
    p.position[1] += height / 2;
    p.radius = random(0.01, maxRadius);
    p.duration = random(1, 500);
    p.time = random(0, p.duration);
    p.velocity = [random(-1, 1), random(-1, 1)];
    p.speed = random(0.5, 2);

    p.color = palette[Math.floor(random(palette.length))];

    return p;
  };

  const particles = Array.from({ length: count }, () => resetParticle());

  const clear = () => {
    const [firstPaletteColor] = palette;
    p.background(firstPaletteColor);
  };

  const step = (dt) => {
    time += dt;

    particles.forEach((particle) => {
      const p = particle;
      const x = p.position[0];
      const y = p.position[1];

      const fx = p.constrain(Math.round(x), 0, width - 1);
      const fy = p.constrain(Math.round(y), 0, height - 1);

      const heightIndex = fx + fy * width;
      const heightValue = heightMap[heightIndex * 4] / 255;

      const pS = p.lerp(noiseScalar[0], noiseScalar[1], heightValue);
      const n = simplex.noise3D(fx * pS, fy * pS, p.duration + time);

      const angle = n * Math.PI * 2;
      const speed = p.speed + p.lerp(0.0, 2, 1 - heightValue);

      p.velocity[0] += Math.cos(angle);
      p.velocity[1] += Math.sin(angle);

      const move = p.createVector(p.velocity[0], p.velocity[1]).mult(speed);

      p.position[0] += move.x;
      p.position[1] += move.y;

      const s2 = pointilism;

      let r = p.radius * simplex.noise3D(x * s2, y * s2, p.duration + time);
      r *= p.lerp(0.01, 1.0, heightValue);

      // Usar p5.brush para dibujar en lugar de stroke/line
      myBrush.color = p.color;
      myBrush.size = r * (p.time / p.duration);

      // Aplicar globalAlpha usando p.tint() para el pincel
      myBrush.opacity = globalAlpha; // Aquí usamos la opacidad global

      myBrush.draw(x, y, p.position[0], p.position[1]);

      p.time += dt;

      if (p.time > p.duration) resetParticle(p);
    });
  };

  const debugLuma = () => {
    p.push();
    p.tint(255, opt.lumaAlpha * 255);
    p.image(backgroundImage, 0, 0, width, height);

    p.blendMode(p.MULTIPLY);
    const [firstPaletteColor] = palette;
    p.fill(firstPaletteColor);
    p.rect(0, 0, width, height);
    p.pop();
  };

  return {
    clear,
    step,
    debugLuma
  };
};
