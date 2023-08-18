"use client";

import React, { ReactNode } from "react";

import AOS from "aos";

import "aos/dist/aos.css";

if (typeof window !== "undefined") {
  AOS.init();
}

function AOSWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default AOSWrapper;
