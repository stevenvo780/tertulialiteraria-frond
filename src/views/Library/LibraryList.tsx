import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Library } from '../../utils/types';
import LibraryCard from './LibraryCard';

interface LibraryListProps {
  libraries: Library[];
  onEdit?: (library: Library) => void;
  onDelete?: (library: Library) => void;
  onNavigate: (library: Library) => void;
}

const calculateColSize = (totalLibraries: number) => {
  if (totalLibraries === 1) return 12;
  if (totalLibraries === 2) return 6;
  if (totalLibraries === 3) return 4;
  return 3;
};

const LibraryList: React.FC<LibraryListProps> = ({ libraries, onEdit, onDelete, onNavigate }) => {
  const colSize = calculateColSize(libraries.length);

  return (
    <Row>
      {libraries.map((library: Library) => (
        <Col key={library.id} md={colSize}>
          <LibraryCard
            library={library}
            onEdit={onEdit}
            onDelete={onDelete}
            onClick={() => onNavigate(library)}
          />
        </Col>
      ))}
    </Row>
  );
};

export default LibraryList;
