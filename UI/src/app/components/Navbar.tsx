import React from "react";
import { Breadcrumb, BreadcrumbItem, Container } from "reactstrap";
import newGuid from "../../utils/guid";

interface INav {
  name: string;
  href?: string;
}

interface INavbarProps {
  children: React.ReactNode;
  nav?: INav[] | INav;
}

export default function Navbar({ children, nav }: INavbarProps) {
  const navItems = Array.isArray(nav) ? nav : !!nav ? [nav] : [];

  return (
    <>
      <div style={{ height: "10rem" }}>
        <section className="section section-hero section-shaped">
          <div className="shape shape-style-1 shape-default">
            <span className="span-150" />
            <span className="span-50" />
            <span className="span-50" />
            <span className="span-75" />
            <span className="span-100" />
            <span className="span-75" />
            <span className="span-50" />
            <span className="span-100" />
            <span className="span-50" />
            <span className="span-100" />
          </div>
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon className="fill-white" points="2560 0 2560 100 0 100" />
            </svg>
          </div>
        </section>
      </div>
      {(navItems.length > 0 && (
        <div className="position-relative">
          <Container className="mb-5 ">
            <Breadcrumb listClassName="bg-dark">
              <BreadcrumbItem>
                <a href="/">
                  <i className="fa fa-home"></i>
                </a>
              </BreadcrumbItem>
              {navItems.map((x) => (
                <BreadcrumbItem active key={newGuid()}>
                  {!!x.href ? <a href={x.href}>{x.name}</a> : x.name}
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
            {children}
          </Container>
        </div>
      )) ||
        children}
    </>
  );
}
