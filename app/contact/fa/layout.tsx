import React from "react";

import FaLayout from "@/components/layout/faLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <FaLayout>{children}</FaLayout>;
}
