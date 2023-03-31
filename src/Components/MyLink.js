import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { history } from '../App';

export const MyLink = ({ activeClassName = 'activeLink', className = '', to, ...props }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  useEffect(() => history.listen(({ pathname }) => setCurrentPath(pathname)),
    []);
  return (
    <Link className={`${className} ${to === currentPath ? activeClassName : ''}`} to={to} {...props} />
  );
};
