import React from 'react';
import { SvgXml } from 'react-native-svg';

const AccountNotVerified = () => {
  const svgMarkup = `
  <svg width="107" height="108" viewBox="0 0 107 108" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="53.4899" cy="53.7269" rx="53.4899" ry="53.5087" fill="#02A7FD"/>
<path d="M48.9989 33.3H57.9659V62.519H48.9989V33.3ZM56.6849 75.329C54.9769 77.037 52.0489 77.037 50.2799 75.329C48.5719 73.621 48.5719 70.571 50.2799 68.863C52.0489 67.155 54.9769 67.155 56.6849 68.863C58.4539 70.571 58.4539 73.621 56.6849 75.329Z" fill="white"/>
</svg>

  `; 

  return <SvgXml xml={svgMarkup} />;
};

export default AccountNotVerified;