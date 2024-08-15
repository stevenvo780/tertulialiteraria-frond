/* eslint-disable no-multi-str */
import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Modal, Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import { RootState } from '../../redux/store';
import api from '../../utils/axios';
import { getPublications, addPublication, updatePublication, deletePublication } from '../../redux/publications';
import { storage } from '../../utils/firebase';
import { addNotification } from '../../redux/ui';
import { Publication } from '../../utils/types';
import { FaEdit, FaTrash } from 'react-icons/fa';

const PublicationsPage: React.FC = () => {
  const dispatch = useDispatch();
  const publications = useSelector((state: RootState) => state.publications.publications);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>(''); // HTML Content

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await api.get<Publication[]>('/publications');
      dispatch(getPublications(response.data));
    } catch (error) {
      dispatch(addNotification({ message: 'Error al obtener las publicaciones', color: 'danger' }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const publicationData: Omit<Publication, 'id'> = {
      title,
      content: { html: content },
      publicationDate: editingPublication ? editingPublication.publicationDate : new Date(),
      author: editingPublication?.author, // En caso de edición, conservamos el autor
    };

    try {
      if (editingPublication) {
        await api.patch(`/publications/${editingPublication.id}`, publicationData);
        dispatch(updatePublication({ ...editingPublication, ...publicationData }));
        dispatch(addNotification({ message: 'Publicación actualizada correctamente', color: 'success' }));
      } else {
        const response = await api.post<Publication>('/publications', publicationData);
        dispatch(addPublication(response.data));
        dispatch(addNotification({ message: 'Publicación creada correctamente', color: 'success' }));
      }
      setShowModal(false);
      fetchPublications();
    } catch (error) {
      dispatch(addNotification({ message: 'Error al guardar la publicación', color: 'danger' }));
    }
  };

  const handleEdit = (publication: Publication) => {
    setEditingPublication(publication);
    setTitle(publication.title);
    setContent(publication.content.html);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/publications/${id}`);
      dispatch(deletePublication(id));
      dispatch(addNotification({ message: 'Publicación eliminada correctamente', color: 'success' }));
      fetchPublications();
    } catch (error) {
      dispatch(addNotification({ message: 'Error al eliminar la publicación', color: 'danger' }));
    }
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
    <Container>
      {/* Botón para crear publicaciones */}
      <div className="my-4 text-center">
        <Button variant="primary" onClick={() => {
          setShowModal(true)
          setEditingPublication(null)
          setTitle('')
          setContent('')
        }}>
          Crear Publicación
        </Button>
      </div>

      <Row>
        <Col md={{ span: 8, offset: 2 }}>
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
        </Col>
      </Row>

      {/* Modal para crear/editar publicación */}
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
    </Container>
  );
};

export default PublicationsPage;
