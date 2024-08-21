// src/components/Layout.tsx

import React from 'react';
import Header from './Header';
import { FaDiscord } from 'react-icons/fa';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const discordInviteLink = 'https://discord.gg/tu-enlace-de-invitacion';

  return (
    <>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <a href={discordInviteLink} target="_blank" rel="noopener noreferrer">
          <button style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', backgroundColor: '#7289DA', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
            <FaDiscord style={{ marginRight: '10px' }} />
            Join our Discord
          </button>
        </a>
      </div>
      {children}
    </>
  );
};

export default Layout;
