import PropTypes from 'prop-types';
import createLoop from 'raf-loop';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import createConfig from './createConfig';
import createRenderer from './createRenderer';

const Art = forwardRef(
  ({ maps, palette, seed, height = window.innerHeight, width = window.innerWidth, debug }, ref) => {
    const canvasRef = useRef(null);
    const loopRef = useRef(null);
    const metadataRef = useRef({});

    const refresh = (config) => {
      if (loopRef.current) loopRef.current.stop();

      loopRef.current = createLoop();

      const context = canvasRef.current.getContext('2d');
      const background = new window.Image();

      const opts = {
        backgroundImage: background,
        context,
        ...config
      };

      const pixelRatio = typeof opts.pixelRatio === 'number' ? opts.pixelRatio : 1;

      canvasRef.current.width = opts.width * pixelRatio;
      canvasRef.current.height = opts.height * pixelRatio;

      background.onload = () => {
        const renderer = createRenderer(opts);

        renderer.clear();

        if (opts.debugLuma) {
          renderer.debugLuma();
        }
        loopRef.current.on('tick', () => {
          renderer.step(opts.interval);
        });

        loopRef.current.start();
      };

      background.src = config.backgroundSrc;
    };

    const letterbox = useCallback((element, parent) => {
      const aspectRatio = element.width / element.height;
      const [parentWidth, parentHeight] = parent;

      const canvasWidth = parentWidth;
      const canvasHeight = Math.round(canvasWidth / aspectRatio);
      const yOffset = Math.floor((parentHeight - canvasHeight) / 2);

      element.style.top = `${yOffset}px`;
      element.style.width = `${canvasWidth}px`;
      element.style.height = `${canvasHeight}px`;
    }, []);

    const draw = () => {
      const config = createConfig({
        maps: maps,
        palettes: [palette],
        debug: debug,
        seed,
        height,
        width
      });

      refresh(config);
      letterbox(canvasRef.current, [width, height]);

      metadataRef.current = {
        seed: config.seedName,
        map: config.backgroundSrc,
        palette: config.palette
      };
    };

    useImperativeHandle(ref, () => ({
      stop: () => {
        if (loopRef.current) loopRef.current.stop();
      },
      draw: () => {
        draw();
      },
      data: () => canvasRef.current.toDataURL('image/png'),
      metadata: () => metadataRef.current,
      ref: () => canvasRef.current
    }));

    return <canvas ref={canvasRef} />;
  }
);

Art.displayName = 'Art';

Art.propTypes = {
  maps: PropTypes.arrayOf(PropTypes.string).isRequired,
  palette: PropTypes.arrayOf(PropTypes.string).isRequired,
  seed: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  debug: PropTypes.bool
};

export default Art;
