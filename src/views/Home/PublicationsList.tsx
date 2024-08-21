import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Publication } from '../../utils/types';
import { UserRole } from '../../utils/types';

interface PublicationsListProps {
  publications: Publication[];
  handleEdit: (publication: Publication | null) => void;
  handleDelete: (id: number) => void;
  user: any;
  setShowModal: (show: boolean) => void;
}

const PublicationsList: React.FC<PublicationsListProps> = ({
  publications,
  handleEdit,
  handleDelete,
  user,
  setShowModal,
}) => {
  return (
    <>
      {user && (
        <div className="d-flex justify-content-end mb-4">
          <Form.Control
            type="text"
            placeholder="Publicar algo..."
            className="form-control"
            onClick={() => {
              handleEdit(null);
              setShowModal(true);
            }}
            readOnly
            style={{ cursor: 'pointer' }}
          />
        </div>
      )}
      {publications.map((publication: Publication) => (
        <Card className="mb-4" key={publication.id} style={{ overflow: 'hidden' }}>
          <Card.Body>
            <div className="d-flex justify-content-between">
              <Card.Title>{publication.title}</Card.Title>
              {(user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) && (
                <div>
                  <FaEdit
                    onClick={() => handleEdit(publication)}
                    style={{ cursor: 'pointer', marginRight: '10px' }}
                    size={20}
                  />
                  <FaTrash
                    onClick={() => handleDelete(publication.id)}
                    style={{ cursor: 'pointer' }}
                    size={20}
                  />
                </div>
              )}
            </div>
            <div
              style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
              dangerouslySetInnerHTML={{ __html: publication.content.html }}
            />
            <div className="text-muted mt-2">
              Publicado el {new Date(publication.publicationDate).toLocaleDateString()}
            </div>
          </Card.Body>
        </Card>
      ))}
    </>
  );
};

export default PublicationsList;
