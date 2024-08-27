import React from 'react';
import { Card } from 'react-bootstrap';
import { FaUsers } from 'react-icons/fa';

type DiscordMemberCardProps = {
  guildMemberCount: number | null;
};

const DiscordMemberCard: React.FC<DiscordMemberCardProps> = ({ guildMemberCount }) => {
  const discordInviteLink = 'https://discord.gg/JcEJp3uu';
  return (
    <a
      href={discordInviteLink}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        cursor: 'pointer',
      }}
    >
      <Card style={{ marginBlock: 10, textAlign: 'center', backgroundColor: "#3374A7" }}>
        <Card.Body style={{ padding: 7, margin: 5, paddingTop: 5 }}>
          <Card.Text style={{ fontSize: '1.5rem', color: "white" }}>
            <h4 style={{ padding: 0, margin: 0 }} >¡YA SOMOS!</h4>
            <p style={{ padding: 0, margin: 0 }} >
              <FaUsers size={30} color="white" style={{ marginInline: 5 }} />  {guildMemberCount !== null ? guildMemberCount : 'Cargando...'}
            </p>
          </Card.Text>
        </Card.Body>
      </Card>
    </a>
  );
};

export default DiscordMemberCard;
