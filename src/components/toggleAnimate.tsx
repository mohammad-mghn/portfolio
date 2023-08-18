import React, { ReactNode } from "react";

import { CSSTransition } from "react-transition-group";

type Props = {
  toggle: boolean;
  className: string;
  children: ReactNode;
};

function ToggleAnimate({ toggle, className, children }: Props) {
  return (
    <CSSTransition in={toggle} timeout={300} classNames={className} unmountOnExit>
      {children}
    </CSSTransition>
  );
}

export default ToggleAnimate;
