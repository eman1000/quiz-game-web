import React from "react";
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink } from "reactstrap";
import moment from "moment";
import classnames from "classnames";
import "./Header.scss";


interface IHeaderLinkProps {
  to: string,
  text: string,
  isButton: boolean,
  current: string
}

interface IHeaderProps {
  isAuthenticated: boolean,
  authenticatedUser: {
    username: string
  },
  current: string
}

interface IHeaderState{
  isOpen: boolean
}
const links:Array<Object> = [
  /**{
    to: "/login",
    text: "Login",
    auth: false,
    isButton:true
  },
  {
    to: "/campaigns",
    text: "My Campaigns",
    auth: true
  },
  {
    to: "/logout",
    text: "Logout",
    auth: true
  }
  /*{
    to: '/this-is-broken',
    text: 'Broken Page'
  }*/
];

const isCurrent = (to: string, current:string): boolean => {
  if (to === "/" && current === to) {
    return true;
  } else if (to !== "/" && current.includes(to)) {
    return true;
  }
  return false;
};

const navItemClasses = (to:string, current:string, isButton:boolean) => classnames({
  current:isCurrent(to, current),
  btn: isButton,
  "btn-gradient": isButton
});

export default class Header extends React.PureComponent<IHeaderProps, IHeaderState> {
  constructor(props:IHeaderProps) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  getGreetingTime (m){
    var g = ""; //return g
    
    if(!m || !m.isValid()) { return; } //if we can't find a valid or filled moment, we return.
    
    var split_afternoon = 12 //24hr time to split the afternoon
    var split_evening = 17 //24hr time to split the evening
    var currentHour = parseFloat(m.format("HH"));
    
    if(currentHour >= split_afternoon && currentHour <= split_evening) {
      g = "afternoon";
    } else if(currentHour >= split_evening) {
      g = "evening";
    } else {
      g = "morning";
    }
    return g;
  }
  //export default ({ isAuthenticated, current }) => (

  render(){
    return (
      <Navbar color="dark" dark expand="md" fixed="top">
        <NavbarBrand href="/">
          <span className="logo">
            {/**<img src={logo} alt="Homepage"/>**/}
            <span>App</span>
          </span>

        </NavbarBrand>
        <Nav className="ml-auto" navbar>
     
        </Nav>
      </Navbar>
    );
  }
}
