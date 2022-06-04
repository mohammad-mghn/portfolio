import { createGlobalStyle } from "styled-components";
export const GlobalStyles = createGlobalStyle`
  :root {
    --background: ${({ theme }) => theme.background};
    --h1Color: ${({ theme }) => theme.h1Color};
    --h2Color: ${({ theme }) => theme.h2Color};
    --h3Color: ${({ theme }) => theme.h3Color};
    --titles: ${({ theme }) => theme.titles};
    --paragraphColor: ${({ theme }) => theme.paragraphColor};
    --themeColor: ${({ theme }) => theme.themeColor};
    --lineBackground: ${({ theme }) => theme.lineBackground};
    --orangeColor: ${({ theme }) => theme.orangeColor};
    --darkerRrangeColor: ${({ theme }) => theme.darkerRrangeColor};
    --redColor: ${({ theme }) => theme.redColor};
    --boxShadow:
     ${({ theme }) => theme.boxShadow};
    --fontSize: "Nunito", "lalezar"; 
    --flex-direction: ${({ theme }) => theme.flexDirection};
    --direction: ${({ theme }) => theme.direction};
  }
  body{
    background-color: ${({ theme }) => theme.background};
  }
  `;
