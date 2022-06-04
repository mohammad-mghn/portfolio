import React, { createContext, Component } from "react";

export const Context = createContext();

class ContextProvider extends Component {
  constructor(props) {
    super(props);
    if (typeof localStorage !== "undefined") {
      this.isLight = JSON.parse(
        localStorage.getItem("vito-mohagheghian-theme-is-light")
      );
      if (this.isLight === null) {
        localStorage.setItem(
          "vito-mohagheghian-theme-is-light",
          JSON.stringify(false)
        );
        this.isLight = false;
      }
      this.state = {
        isLight: this.isLight,
      };
    }
  }

  toggleThemeLocalStorge = () => {
    localStorage.setItem(
      "vito-mohagheghian-theme-is-light",
      JSON.stringify(!this.state.isLight)
    );
  };

  toggleTheme = () => {
    this.setState({ isLight: !this.state.isLight });
    this.toggleThemeLocalStorge();
  };

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          toggleLanguage: this.toggleLanguage,
          toggleTheme: this.toggleTheme,
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}
export default ContextProvider;
