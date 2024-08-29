import React, { useEffect, useState } from 'react';
import Header from './Header';
import { FaDiscord, FaCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import PuffLoader from 'react-spinners/PuffLoader';
import api from '../utils/axios';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const loading = useSelector((state: RootState) => state.ui.loading);
  const discordInviteLink = process.env.REACT_APP_DISCORD_TL_INVITE as string;
  const [onlineMemberCount, setOnlineMemberCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchOnlineMemberCount = async () => {
      try {
        const response = await api.get<number>('/discord/guild/online');
        setOnlineMemberCount(response.data);
      } catch (error) {
        console.error('Error fetching online member count:', error);
      }
    };

    fetchOnlineMemberCount();
  }, []);

  return (
    <>
      <Header />
      {loading && (
        <div className="loader-overlay">
          <PuffLoader
            color={'var(--primary-color)'}
            loading={loading}
            cssOverride={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            size={100}
            aria-label="Cargando"
            data-testid="loader"
          />
        </div>
      )}
      <main>{children}</main>
      <a 
        href={discordInviteLink} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'var(--discord-color)',
          borderRadius: '50%',
          width: '76px',
          height: '76px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'var(--discord-text)',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          zIndex: 1000,
          flexDirection: 'column',
          padding: '10px',
        }}
      >
        <FaDiscord size={48} color="var(--discord-text)" />
        {onlineMemberCount !== null && (
          <span style={{ color: 'var(--discord-text)', fontSize: '18px'}}>
            {onlineMemberCount} <FaCircle size={15} color="var(--online-color)" style={{ marginInline: 1 }} />
          </span>
        )}
      </a>
    </>
  );
};

export default Layout;
