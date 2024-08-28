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
        </div>
        <div
          style={{
            maxHeight: '150px',
            overflow: 'hidden',
          }}
          dangerouslySetInnerHTML={{ __html: library.description }}
        />
        <div className="d-flex align-items-center mt-3">
          <span
            style={{ cursor: 'pointer', marginInline: '10px' }}
            onClick={(e) => { e.stopPropagation(); handleLikeToggle(library.id, true); }}
          >
            <FaThumbsUp
              style={{ cursor: 'pointer', marginInline: '3px', color: likesData.userLike?.isLike ? '#B1801D' : '#BBBBBB' }}
              size={27}
            />
            {likesData.likes}
          </span>
          <span
            style={{ cursor: 'pointer', marginInline: '10px' }}
            onClick={(e) => { e.stopPropagation(); handleLikeToggle(library.id, false); }}
          >
            <FaThumbsDown
              style={{ cursor: 'pointer', marginInline: '3px', color: likesData.userLike && !likesData.userLike.isLike ? '#B1801D' : '#BBBBBB' }}
              size={27}
            />
            {likesData.dislikes}
          </span>
          <span
            style={{ cursor: 'pointer', marginInline: '10px' }}
            onClick={(e) => { e.stopPropagation(); handleShare(library); }}
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
};

export default LibraryCard;
