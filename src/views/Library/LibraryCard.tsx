import React from 'react';
import { Card } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Library } from '../../utils/types';

interface LibraryCardProps {
  library: Library;
  onEdit: (library: Library) => void;
  onDelete: (id: number) => void;
  onClick: () => void; // Función de navegación
}

const LibraryCard: React.FC<LibraryCardProps> = ({ library, onEdit, onDelete, onClick }) => {
  return (
    <Card className="mb-4" key={library.id} onClick={onClick} style={{ cursor: 'pointer' }}>
      <Card.Body>
        <div className="d-flex justify-content-between">
          <Card.Title>{library.title}</Card.Title>
          <div>
            <FaEdit
              onClick={(e) => {
                e.stopPropagation(); // Evitar que el clic en editar dispare la navegación
                onEdit(library);
              }}
              style={{ cursor: 'pointer', marginRight: '10px' }}
              size={20}
            />
            <FaTrash
              onClick={(e) => {
                e.stopPropagation(); // Evitar que el clic en eliminar dispare la navegación
                onDelete(library.id);
              }}
              style={{ cursor: 'pointer' }}
              size={20}
            />
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: library.description }} />
        <div className="text-muted mt-2">
          Referenciado el {new Date(library.referenceDate).toLocaleDateString()}
        </div>
      </Card.Body>
    </Card>
  );
};

export default LibraryCard;
