import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Publication } from '../../utils/types';

interface PublicationsListProps {
  publications: Publication[];
  handleEdit: (publication: Publication) => void;
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
      <h2 className="text-center mb-4">Publicaciones Recientes</h2>
      {user && (
        <div className="d-flex justify-content-end mb-4">
          <Button variant="primary" onClick={() => {
            handleEdit({ id: 0, title: '', content: { html: '' }, publicationDate: new Date() })
            setShowModal(true)
          }}>
            Crear Publicación
          </Button>
        </div>
      )}
      {publications.map((publication: Publication) => (
        <Card className="mb-4" key={publication.id}>
          <Card.Body>
            <div className="d-flex justify-content-between">
              <Card.Title>{publication.title}</Card.Title>
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
            </div>
            <div dangerouslySetInnerHTML={{ __html: publication.content.html }} />
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
