import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { storage } from '../../utils/firebase';

interface ImageUploadModalProps {
  show: boolean;
  handleClose: () => void;
  insertImage: (url: string) => void;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ show, handleClose, insertImage }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!imageFile) return;
    
    setUploading(true);

    try {
      const storageRef = storage.ref();
      const fileRef = storageRef.child(`images/${imageFile.name}`);
      await fileRef.put(imageFile);
      const fileUrl = await fileRef.getDownloadURL();

      insertImage(fileUrl);
      handleClose();
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Subir Imagen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Seleccionar imagen</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={uploading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleUpload} disabled={!imageFile || uploading}>
          {uploading ? 'Subiendo...' : 'Subir y Insertar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageUploadModal;
