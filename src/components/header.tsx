// Header.tsx
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className="bg-blue-500 p-4 text-white text-2xl font-bold">
      {title}
    </div>
  );
}

export default Header;
