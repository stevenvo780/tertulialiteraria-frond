import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Library } from '../../utils/types';

interface LibraryCardProps {
  library: Library;
  onEdit?: (library: Library) => void; // Hacer que onEdit y onDelete sean opcionales
  onDelete?: (id: number) => void;
  onClick: () => void;
}

const LibraryCard: React.FC<LibraryCardProps> = ({ library, onEdit, onDelete, onClick }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="mb-4" key={library.id} onClick={onClick} style={{ cursor: 'pointer' }}>
      <Card.Body>
        <div className="d-flex justify-content-between">
          <Card.Title>{library.title}</Card.Title>
          <div>
            {onEdit && (
              <FaEdit
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(library);
                }}
                style={{ cursor: 'pointer', marginRight: '10px' }}
                size={20}
              />
            )}
            {onDelete && (
              <FaTrash
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(library.id);
                }}
                style={{ cursor: 'pointer' }}
                size={20}
              />
            )}
          </div>
        </div>
        <div
          style={{
            maxHeight: expanded ? 'none' : '150px',
            overflow: 'hidden',
          }}
          dangerouslySetInnerHTML={{ __html: library.description }}
        />
        <Button
          variant="link"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? 'Ver menos' : 'Ver más'}
        </Button>
        <div className="text-muted mt-2">
          Referenciado el {new Date(library.referenceDate).toLocaleDateString()}
        </div>
      </Card.Body>
    </Card>
  );
};

export default LibraryCard;
