import p5 from 'p5';
import * as brush from 'p5.brush';
import PropTypes from 'prop-types';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import createConfig from './createConfig';
import createRenderer from './createRenderer';

const Art = forwardRef(
  ({ maps, palette, seed, height = window.innerHeight, width = window.innerWidth }, ref) => {
    const p5Ref = useRef(null);
    const metadataRef = useRef({});

    const sketch = (p) => {
      let renderer;

      p.setup = () => {
        p.createCanvas(width, height);

        // Aquí cargamos p5.brush, que se usará en modo de instancia
        brush.register(p);

        const config = createConfig({
          maps: maps,
          palettes: [palette],
          seed,
          height,
          width
        });

        renderer = createRenderer({
          p5Instance: p,
          ...config
        });
      };

      p.draw = () => {
        renderer.clear();
        renderer.step(p.deltaTime);
        if (renderer.debugLuma) {
          renderer.debugLuma();
        }
      };
    };

    useImperativeHandle(ref, () => ({
      stop: () => {
        p5Ref.current.noLoop();
      },
      draw: () => {
        p5Ref.current.loop();
      },
      data: () => {
        return p5Ref.current.canvas.toDataURL('image/png');
      },
      metadata: () => {
        return metadataRef.current;
      },
      ref: () => {
        return p5Ref.current.canvas;
      }
    }));

    React.useEffect(() => {
      p5Ref.current = new p5(sketch);
      return () => {
        p5Ref.current.remove();
      };
    }, []);

    return <div ref={p5Ref}></div>;
  }
);

Art.displayName = 'Art';

Art.propTypes = {
  maps: PropTypes.arrayOf(PropTypes.string).isRequired,
  palette: PropTypes.arrayOf(PropTypes.string).isRequired,
  seed: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number
};

Art.displayName = 'Art';

export default Art;
