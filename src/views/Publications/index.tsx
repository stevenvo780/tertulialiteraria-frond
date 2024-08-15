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
    <>
      {/* Sección fija para crear publicaciones */}
      <div style={{
        position: 'fixed',
        top: '60px',
        width: '100%',
        zIndex: 1000,
        backgroundColor: '#f8f9fa',
        padding: '10px 0',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
      }}>
        <Container className="d-flex justify-content-center">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Crear Publicación
          </Button>
        </Container>
      </div>

      {/* Espaciado para no sobreponer la barra fija */}
      <div style={{ marginTop: '120px' }}>
        <Container>
          <Row>
            <Col md={{ span: 8, offset: 2 }}>
              {/* Listado de publicaciones */}
              {publications.map((publication: Publication) => (
                <Card className="mb-4" key={publication.id}>
                  <Card.Body>
                    <Card.Title>{publication.title}</Card.Title>
                    <div dangerouslySetInnerHTML={{ __html: publication.content.html }} />
                    <div className="d-flex justify-content-between mt-2">
                      <div>
                        <Button variant="warning" onClick={() => handleEdit(publication)} className="mr-2">
                          Editar
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(publication.id)}>
                          Eliminar
                        </Button>
                      </div>
                      <div className="text-muted">
                        Publicado el {new Date(publication.publicationDate).toLocaleDateString()}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modal para crear/editar publicación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" >
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
                init={{
                  height: 400,
                  menubar: false,
                  plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
                  toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | image',
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
    </>
  );
};

export default PublicationsPage;
