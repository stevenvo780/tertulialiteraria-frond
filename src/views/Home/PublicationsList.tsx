import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { FaEdit, FaTrash, FaThumbsUp, FaThumbsDown, FaShareAlt, FaUser } from 'react-icons/fa';
import { Publication, Like, UserRole, User } from '../../utils/types';
import { getRoleInSpanish } from '../../utils/roleTranslation';

interface PublicationsListProps {
  publications: Publication[];
  handleEdit: (publication: Publication | null) => void;
  handleDelete: (id: number) => void;
  handleLikeToggle: (publicationId: number, isLike: boolean) => void;
  handleShare: (publication: Publication) => void;
  likesData: Record<number, { likes: number; dislikes: number; userLike: Like | null }>;
  user: User | null;
  setShowModal: (show: boolean) => void;
  publicationRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>; // Nueva referencia
}

const PublicationsList: React.FC<PublicationsListProps> = ({
  publications,
  handleEdit,
  handleDelete,
  handleLikeToggle,
  handleShare,
  likesData,
  user,
  setShowModal,
  publicationRefs,
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
          <Card
            className="mb-4"
            key={publication.id}
            style={{ overflow: 'hidden' }}
            ref={(el: HTMLDivElement | null) => (publicationRefs.current[publication.id] = el)}
          >
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
              {publication.author && (
                <div className="text-muted mb-2 d-flex align-items-center">
                  <FaUser style={{ marginRight: '8px' }} />
                  {`${publication.author.name} - ${getRoleInSpanish(publication.author.role)}`}
                </div>
              )}
              <div
                style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                dangerouslySetInnerHTML={{ __html: publication.content }}
              />
              <div className="text-muted mt-2">
                {publication.createdAt ? new Date(publication.createdAt).toLocaleDateString() : ''}
              </div>
              <div className="d-flex align-items-center mt-3">
                <span
                  style={{ cursor: 'pointer', marginInline: '10px' }}
                  onClick={() => handleLikeToggle(publication.id, true)}
                >
                  <FaThumbsUp
                    style={{ cursor: 'pointer', marginInline: '3px', color: likeData.userLike?.isLike ? '#B1801D' : '#BBBBBB' }}
                    size={27}
                  />
                  {likeData.likes}
                </span>
                <span
                  style={{ cursor: 'pointer', marginInline: '10px' }}
                  onClick={() => handleLikeToggle(publication.id, false)}
                >
                  <FaThumbsDown
                    style={{ cursor: 'pointer', marginInline: '3px', color: likeData.userLike && !likeData.userLike.isLike ? '#B1801D' : '#BBBBBB' }}
                    size={27}
                  />
                  {likeData.dislikes}
                </span>
                <span
                  style={{ cursor: 'pointer', marginInline: '10px' }}
                  onClick={() => handleShare(publication)}
                >
                  <FaShareAlt
                    style={{ cursor: 'pointer', marginInline: '10px', color: '#BBBBBB' }}
                    size={27}
                  />
                </span>
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
};

export default PublicationsList;
