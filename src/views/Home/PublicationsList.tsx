import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { FaEdit, FaTrash, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { Publication, Like, UserRole, User } from '../../utils/types';

interface PublicationsListProps {
  publications: Publication[];
  handleEdit: (publication: Publication | null) => void;
  handleDelete: (id: number) => void;
  handleLikeToggle: (publicationId: number, isLike: boolean) => void;
  likesData: Record<number, { likes: number; dislikes: number; userLike: Like | null }>;
  user: User | null;
  setShowModal: (show: boolean) => void;
}

const PublicationsList: React.FC<PublicationsListProps> = ({
  publications,
  handleEdit,
  handleDelete,
  handleLikeToggle,
  likesData,
  user,
  setShowModal,
}) => {
  return (
    <>
      {(user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) && (
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
      {publications.map((publication: Publication) => {
        const likeData = likesData[publication.id] || { likes: 0, dislikes: 0, userLike: null };

        return (
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
                dangerouslySetInnerHTML={{ __html: publication.content }}
              />
              <div className="text-muted mt-2">
                {publication.createdAt ? new Date(publication.createdAt).toLocaleDateString() : ''}
              </div>
              <div className="d-flex align-items-center mt-3">
                <Button
                  variant="link"
                  onClick={() => handleLikeToggle(publication.id, true)}
                  className={likeData.userLike?.isLike ? 'text-primary' : ''}
                >
                  <FaThumbsUp /> {likeData.likes}
                </Button>
                <Button
                  variant="link"
                  onClick={() => handleLikeToggle(publication.id, false)}
                  className={likeData.userLike && !likeData.userLike.isLike ? 'text-danger' : ''}
                >
                  <FaThumbsDown /> {likeData.dislikes}
                </Button>

              </div>
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
};

export default PublicationsList;
