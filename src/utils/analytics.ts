import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-0TTTKHRRK3"); // заміни на твій ID
};

export const logPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export const logEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};




