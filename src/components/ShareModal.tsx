import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
} from 'react-share';
import { Publication } from '../utils/types';

interface ShareModalProps {
  show: boolean;
  onHide: () => void;
  publication: Publication;
}

const ShareModal: React.FC<ShareModalProps> = ({ show, onHide, publication }) => {
  // Usamos el hash (#) para el enlace de la publicación
  const shareUrl = `${window.location.origin}/#${publication.id}`;
  const title = publication.title;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Compartir publicación</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-around">
        <FacebookShareButton url={shareUrl} title={title}>
          <FacebookIcon size={60} round />
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl} title={title}>
          <TwitterIcon size={60} round />
        </TwitterShareButton>
        <WhatsappShareButton url={shareUrl} title={title}>
          <WhatsappIcon size={60} round />
        </WhatsappShareButton>
        <LinkedinShareButton url={shareUrl} title={title}>
          <LinkedinIcon size={60} round />
        </LinkedinShareButton>
        <TelegramShareButton url={shareUrl} title={title}>
          <TelegramIcon size={60} round />
        </TelegramShareButton>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareModal;
