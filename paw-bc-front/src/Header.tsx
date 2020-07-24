import React from "react";
import {Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";

interface HeaderProps {

}

const Header: React.FC<HeaderProps> = () => (
    <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="">Боевой калькулятор</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link as={Link} to="calc/0">Расчет</Nav.Link>
                <Nav.Link as={Link} to="army">Армии</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);

export default Header;