export type localType = {
  navbar: {
    links: {
      home: string;
      about: string;
      contact: string;
      projects: string;
      blog: string;
    };
    other_lang: "En" | "Fa";
    lang: "en" | "fa";
  };
  hero: {
    i_am: string;
    first_name: string;
    last_name: string;
    description: string;
    resume: string;
    get_in_touch: string;
    scroll_down: string;
  };
  about: {
    header: string;
    roles: {
      primary: string;
      freelancer: string;
      "react-dev": string;
      "ui-designer": string;
      "front-end-dev": string;
    };
    github: string;
    description: string;
    autobiography: string;
    autobiography_header: string;
    details_header: string;
    details: {
      name: { header: string; value: string };
      location: { header: string; value: string };
      nick_name: { header: string; value: string };
    };
  };
  skills: {
    header: string;
    description: string;
    pov: string;
  };
  languages: {
    header: string;
    description: string;
  };
  github: {
    header: string;
    quote: string;
    quote_owner: string;
    github: string;
  };
  selected_projects: {
    header: string;
    see_more: string;
  };
  testimonials: {
    header: string;
    description: string;
    pov: string;
  };
  instagram: {
    header: string;
    description: string;
    id: string;
    check_my_page: string;
  };
  devto: {
    header: string;
    description: string;
    profile: string;
  };
  contact: {
    header: string;
    description: string;
    form: {
      title: {
        label: string;
        place_holder: string;
      };
      name: {
        label: string;
        place_holder: string;
      };
      email: {
        label: string;
        place_holder: string;
      };
      body: {
        label: string;
        place_holder: string;
      };
      send: string;
    };
  };
  support: {
    header: string;
    buy_me_a_coffee: string;
    coffee_be_de_button: string;
    tether: string;
    wallet_address: string;
  };
  footer: { copyright: "© Made with ❤️ and lots of ☕ from 2020" };
};
