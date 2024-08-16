import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';
import { storage } from '../../utils/firebase';
import { Library, CreateLibraryDto, UpdateLibraryDto } from '../../utils/types';

interface LibraryFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (libraryData: CreateLibraryDto | UpdateLibraryDto) => void;
  editingLibrary: Library | null;
  libraries: Library[];
}

const LibraryFormModal: React.FC<LibraryFormModalProps> = ({
  show,
  onHide,
  onSubmit,
  editingLibrary,
  libraries,
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>(''); // HTML Content
  const [parentNoteId, setParentNoteId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (editingLibrary) {
      setTitle(editingLibrary.title);
      setDescription(editingLibrary.description);
      setParentNoteId(editingLibrary.parent?.id || undefined);
    } else {
      setTitle('');
      setDescription('');
      setParentNoteId(undefined);
    }
  }, [editingLibrary]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const libraryData: CreateLibraryDto | UpdateLibraryDto = {
      title,
      description,
      referenceDate: editingLibrary ? editingLibrary.referenceDate : new Date(),
      parentNoteId: parentNoteId,
    };

    onSubmit(libraryData);
    onHide();
  };

  const uploadImage = async (blobInfo: any): Promise<string> => {
    try {
      const file = blobInfo.blob();
      const storageRef = storage.ref();
      const fileRef = storageRef.child(`images/${file.name}`);

      const uploadTaskSnapshot = await fileRef.put(file);
      const fileUrl = await uploadTaskSnapshot.ref.getDownloadURL();
      return fileUrl;
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      throw new Error("Error al subir la imagen");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{editingLibrary ? 'Editar Referencia' : 'Crear Referencia'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formLibraryTitle">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formLibraryDescription">
            <Form.Label>Descripción</Form.Label>
            <Editor
              apiKey='ide9bzali9973f0fmbzusywuxlpp3mxmigqoa07eddfltlrj'
              value={description}
              init={{
                height: 300,
                menubar: false,
                plugins: 'powerpaste casechange searchreplace autolink directionality visualblocks visualchars image link media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker editimage help formatpainter permanentpen charmap linkchecker emoticons advtable export autosave advcode fullscreen',
                toolbar: "undo redo spellcheckdialog formatpainter | blocks fontfamily fontsize | bold italic underline forecolor backcolor | link image | alignleft aligncenter alignright alignjustify | code",
                images_upload_handler: uploadImage,
              }}
              onEditorChange={(newContent: any) => setDescription(newContent)}
            />
          </Form.Group>
          <br/>
          <Button variant="primary" type="submit">
            {editingLibrary ? 'Actualizar' : 'Crear'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LibraryFormModal;
