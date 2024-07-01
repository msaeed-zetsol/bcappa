import React from 'react';
import { SvgXml } from 'react-native-svg';

const CreateBc = () => {
  const svgMarkup = `
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="64" height="64" rx="15" fill="#02A7FD"/>
<path d="M33.8462 21.8462C33.8462 20.825 33.0212 20 32 20C30.9788 20 30.1538 20.825 30.1538 21.8462V30.1538H21.8462C20.825 30.1538 20 30.9788 20 32C20 33.0212 20.825 33.8462 21.8462 33.8462H30.1538V42.1538C30.1538 43.175 30.9788 44 32 44C33.0212 44 33.8462 43.175 33.8462 42.1538V33.8462H42.1538C43.175 33.8462 44 33.0212 44 32C44 30.9788 43.175 30.1538 42.1538 30.1538H33.8462V21.8462Z" fill="white"/>
</svg>

  `; 

  return <SvgXml xml={svgMarkup} width="64" height="64" />;
};

export default CreateBc;
