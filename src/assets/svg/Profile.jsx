// Profile.tsx
import React from 'react';
import { SvgXml } from 'react-native-svg';

const Profile = () => {
  const svgMarkup = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#EAF8FF"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.8834 23.2465C13.1145 23.2465 10.75 22.8156 10.75 21.09C10.75 19.3644 13.0995 17.7715 15.8834 17.7715C18.6523 17.7715 21.0168 19.349 21.0168 21.0746C21.0168 22.7995 18.6673 23.2465 15.8834 23.2465Z" stroke="#0398E5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.8784 15.38C17.6954 15.38 19.1681 13.9073 19.1681 12.0903C19.1681 10.2732 17.6954 8.7998 15.8784 8.7998C14.0613 8.7998 12.5879 10.2732 12.5879 12.0903C12.5818 13.9012 14.0443 15.3739 15.8552 15.38C15.8634 15.38 15.8709 15.38 15.8784 15.38Z" stroke="#0398E5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  return <SvgXml xml={svgMarkup} width={32} height={32} />;
};

export default Profile;
