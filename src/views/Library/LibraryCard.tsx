import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaEdit, FaTrash, FaThumbsUp, FaThumbsDown, FaShareAlt } from 'react-icons/fa';
import { Library, Like } from '../../utils/types';

interface LibraryCardProps {
  library: Library;
  onEdit?: (library: Library) => void;
  onDelete?: (library: Library) => void;
  onClick: () => void;
  likesData: { likes: number; dislikes: number; userLike: Like | null };
  handleLikeToggle: (libraryId: number, isLike: boolean) => void;
  handleShare: (library: Library) => void;
}

const LibraryCard: React.FC<LibraryCardProps> = ({
  library,
  onEdit,
  onDelete,
  onClick,
  likesData,
  handleLikeToggle,
  handleShare,
}) => {

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
                  onDelete(library);
                }}
                style={{ cursor: 'pointer' }}
                size={20}
              />
            )}
          </div>
        </div>
        <div
          style={{
            maxHeight: '150px',
            overflow: 'hidden',
          }}
          dangerouslySetInnerHTML={{ __html: library.description }}
        />
        <div className="d-flex align-items-center mt-3">
          <Button
            variant="link"
            onClick={(e) => { e.stopPropagation(); handleLikeToggle(library.id, true); }}
            className={likesData.userLike?.isLike ? 'text-primary' : ''}
          >
            <FaThumbsUp /> {likesData.likes}
          </Button>
          <Button
            variant="link"
            onClick={(e) => { e.stopPropagation(); handleLikeToggle(library.id, false); }}
            className={likesData.userLike && !likesData.userLike.isLike ? 'text-danger' : ''}
          >
            <FaThumbsDown /> {likesData.dislikes}
          </Button>
          <Button
            variant="link"
            onClick={(e) => { e.stopPropagation(); handleShare(library); }}
            className="text-info"
          >
            <FaShareAlt />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LibraryCard;
