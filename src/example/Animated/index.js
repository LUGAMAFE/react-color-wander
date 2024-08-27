import 'animate.css';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const Animated = ({
  children,
  disabled = false,
  enter,
  exit,
  item = false,
  items = false,
  preset,
  timeout = 1000
}) => {
  const [inProp, setInProp] = useState(false);

  useEffect(() => {
    if (!item) {
      setInProp(true);
    }
  }, [item]);

  if (disabled) return children;

  if (items) {
    return <TransitionGroup>{children}</TransitionGroup>;
  }

  const classNames = preset || {
    appear: 'animate__animated',
    appearActive: enter,
    enter: 'animate__animated',
    enterActive: enter,
    exit: 'animate__animated',
    exitActive: exit
  };

  let timeoutValue;

  if (!enter && exit) {
    timeoutValue = { enter: 0, exit: timeout };
  } else if (enter && !exit) {
    timeoutValue = { enter: timeout, exit: 0 };
  } else {
    timeoutValue = timeout;
  }

  return (
    <CSSTransition
      in={!item ? inProp : undefined}
      classNames={classNames}
      timeout={timeoutValue}>
      {children}
    </CSSTransition>
  );
};

Animated.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  enter: PropTypes.string,
  exit: PropTypes.string,
  item: PropTypes.bool,
  items: PropTypes.bool,
  preset: PropTypes.string,
  timeout: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      enter: PropTypes.number,
      exit: PropTypes.number
    })
  ])
};

Animated.defaultProps = {
  disabled: false,
  enter: undefined,
  exit: undefined,
  item: false,
  items: false,
  preset: undefined,
  timeout: 1000
};

export default Animated;
