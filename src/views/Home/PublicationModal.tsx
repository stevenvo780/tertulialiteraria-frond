import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';

interface PublicationModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  editingPublication: any;
  uploadImage: (blobInfo: any) => Promise<string>;
}

const PublicationModal: React.FC<PublicationModalProps> = ({
  showModal,
  setShowModal,
  handleSubmit,
  title,
  setTitle,
  content,
  setContent,
  editingPublication,
  uploadImage,
}) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{editingPublication ? 'Editar Publicación' : 'Crear Publicación'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formPublicationTitle">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPublicationContent">
            <Form.Label>Contenido</Form.Label>
            <Editor
              apiKey='ide9bzali9973f0fmbzusywuxlpp3mxmigqoa07eddfltlrj'
              value={content}
              init={{
                advcode_inline: true,
                height: 500,
                menubar: false,
                plugins: 'powerpaste casechange searchreplace autolink directionality visualblocks visualchars image link media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker editimage help formatpainter permanentpen charmap linkchecker emoticons advtable export autosave advcode fullscreen',
                toolbar: "undo redo spellcheckdialog formatpainter | blocks fontfamily fontsize | bold italic underline forecolor backcolor | link image | alignleft aligncenter alignright alignjustify | code",
                images_upload_handler: uploadImage,
              }}
              onEditorChange={(newContent: any) => setContent(newContent)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {editingPublication ? 'Actualizar' : 'Publicar'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PublicationModal;
