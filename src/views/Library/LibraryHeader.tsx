import React, { useEffect } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import { IoIosArrowBack } from "react-icons/io";
import { BsFileEarmarkPlusFill, BsSearch } from "react-icons/bs";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Library } from '../../utils/types';

interface LibraryHeaderProps {
  currentNote: Library | null;
  onGoBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCreate: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  permissionsEditable: boolean;
}

const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  currentNote,
  onGoBack,
  onEdit,
  onDelete,
  onCreate,
  searchQuery,
  setSearchQuery,
  handleSearch,
  permissionsEditable,
}) => {
  const isMobile = window.innerWidth < 768;

  return (
    <Row>
      {!currentNote && (
        <Col xs={permissionsEditable ? 9 : 10} md={permissionsEditable ? 11 : 12}>
          <Form className="mb-4" onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}>
            <Form.Group controlId="searchQuery">
              <Form.Control
                type="text"
                placeholder="Buscar en la biblioteca"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Col>
      )}
      {currentNote && (
        <Col xs={4} md={10}>
          <Button variant="secondary" onClick={onGoBack} className="p-0">
            <IoIosArrowBack size={30} />
          </Button>
        </Col>
      )}
      {permissionsEditable && (
        <Col xs={currentNote ? 8 : 3} md={currentNote ? 2 : 1} style={(isMobile && currentNote) ? {
          display: 'inline-flex',
          justifyContent: 'flex-end',
        } : {}}>
          <div style={{
            display: 'inline-flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: 'var(--white-color)',
            borderRadius: '10px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            padding: '10px',
          }}>
            <BsFileEarmarkPlusFill
              onClick={onCreate}
              size={27}
              style={{
                cursor: 'pointer',
                marginInline: 8,
                color: 'var(--secondary-color)',
              }}
            />
            {currentNote && (
              <>
                <FaEdit
                  onClick={onEdit}
                  size={27}
                  style={{
                    cursor: 'pointer',
                    marginInline: 8,
                    color: 'var(--secondary-color)',
                  }}
                />
                <FaTrash
                  onClick={onDelete}
                  size={27}
                  style={{
                    cursor: 'pointer',
                    marginInline: 8,
                    color: 'var(--secondary-color)',
                  }}
                />
              </>
            )}
          </div>
        </Col>
      )}
    </Row>
  );
};

export default LibraryHeader;
