import React from 'react';
import { Card } from 'react-bootstrap';
import { Library } from '../../utils/types';

interface LatestNotesProps {
  notes: Library[];
}

const LatestNotes: React.FC<LatestNotesProps> = ({ notes }) => {
  return (
    <div>
      <h4 className="mt-4">Últimas Notas</h4>
      {notes.length > 0 ? (
        notes.map((note) => (
          <Card className="mb-3" key={note.id}>
            <Card.Body>
              <Card.Title>{note.title}</Card.Title>
              <div
                style={{
                  maxHeight: '100px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.overflow = 'auto';
                  target.style.whiteSpace = 'normal';
                  target.style.maxHeight = 'none';
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.overflow = 'hidden';
                  target.style.whiteSpace = 'nowrap';
                  target.style.maxHeight = '100px';
                }}
                dangerouslySetInnerHTML={{ __html: note.description }}
              />
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No hay notas recientes</p>
      )}
    </div>
  );
};

export default LatestNotes;
