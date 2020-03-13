import { useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { APP_NAME } from "../config";
import { isAuth, signout } from "../actions/auth";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from "reactstrap";
const Header = props => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const handleSignOut = () => {
    signout(() => Router.push("/signin"));
  };
  const handleDashboardRedirect = () => {
    if (isAuth().role === 1) {
      Router.push("/admin");
    } else {
      Router.push("/user");
    }
  };
  return (
    <div>
      <Navbar color="light" light expand="md">
        <Link href="/">
          <NavLink style={{ cursor: "pointer" }} className="font-weight-bold">
            {APP_NAME}
          </NavLink>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            {!isAuth() && (
              <React.Fragment>
                <NavItem>
                  <Link href="/signin">
                    <NavLink style={{ cursor: "pointer" }}>Sign In</NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/signup">
                    <NavLink style={{ cursor: "pointer" }}>Sign Up</NavLink>
                  </Link>
                </NavItem>
              </React.Fragment>
            )}
          </Nav>
          {isAuth() ? (
            <React.Fragment>
              {!(Router.pathname === "/user" ||
                Router.pathname === "/admin") && (
                <NavLink
                  onClick={handleDashboardRedirect}
                  style={{ cursor: "pointer" }}
                >
                  {isAuth().name}'s Dashboard
                </NavLink>
              )}
              <NavLink style={{ cursor: "pointer" }} onClick={handleSignOut}>
                Sign Out
              </NavLink>
            </React.Fragment>
          ) : (
            <NavbarText>Welcome Guest!!</NavbarText>
          )}
        </Collapse>
      </Navbar>
    </div>
  );
};
export default Header;
