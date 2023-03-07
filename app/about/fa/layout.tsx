import FaLayout from "@/components/layout/faLayout";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <FaLayout>{children}</FaLayout>;
}
