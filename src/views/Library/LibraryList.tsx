import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Library } from '../../utils/types';
import LibraryCard from './LibraryCard';

interface LibraryListProps {
  libraries: Library[];
  onEdit: (library: Library) => void;
  onDelete: (id: number) => void;
  onNavigate: (library: Library) => void; // Nueva función para manejar la navegación
}

const LibraryList: React.FC<LibraryListProps> = ({ libraries, onEdit, onDelete, onNavigate }) => {
  return (
    <Row>
      <Col md={{ span: 8, offset: 2 }}>
        {libraries.map((library: Library) => (
          <LibraryCard
            key={library.id}
            library={library}
            onEdit={onEdit}
            onDelete={onDelete}
            onClick={() => onNavigate(library)} // Agregar la función de navegación
          />
        ))}
      </Col>
    </Row>
  );
};

export default LibraryList;
