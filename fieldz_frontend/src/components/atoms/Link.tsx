import React, { FC } from 'react';
import './style/link.css';

type LinkProps = {
  href: string;
  children: React.ReactNode;
};

const Link: FC<LinkProps> = ({ href, children }) => (
  <a className="atom-link" href={href}>
    {children}
  </a>
);

export default Link;
