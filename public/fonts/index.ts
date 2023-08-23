import localFont from "next/font/local";

export const IranYekan = localFont({
  src: [
    {
      path: "./IRANYekanWebThin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./IRANYekanWebLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./IRANYekanWebRegular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./IRANYekanWebMedium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./IRANYekanWebBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./IRANYekanWebExtraBold.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-iranyekan",
});
