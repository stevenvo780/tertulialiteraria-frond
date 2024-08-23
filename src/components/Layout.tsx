import React from 'react';
import Header from './Header';
import { FaDiscord } from 'react-icons/fa';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const discordInviteLink = 'https://discord.gg/JcEJp3uu';

  return (
    <>
      <Header />
      {children}
      <a 
        href={discordInviteLink} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#7289DA',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        <FaDiscord size={30} color='white' />
      </a>
    </>
  );
};

export default Layout;
