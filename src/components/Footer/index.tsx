import React from "react";
import { Link } from "react-router-dom";

interface IHeaderLinkProps {
  to: string;
  text: string;
  isButton: boolean;
  current: string;
}

interface IFooterProps {
  current: string;
}

const Footer = (props: IFooterProps) => {
 
  return <div className={"footer-b"}>
    <Link to="/logout">Logout</Link>
    <Link to="privacy-policy">Privacy Policy</Link>
  </div>;
};

export default Footer;
