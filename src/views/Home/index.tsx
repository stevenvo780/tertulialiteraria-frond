import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../utils/axios';
import { getPublications, addPublication, updatePublication, deletePublication } from '../../redux/publications';
import { addNotification } from '../../redux/ui';
import { RootState } from '../../redux/store';
import PublicationsList from './PublicationsList';
import Sidebar from './Sidebar';
import PublicationModal from './PublicationModal';
import { Publication } from '../../utils/types';
import { storage } from '../../utils/firebase';
import { set } from 'date-fns';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.userData);
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
      author: editingPublication?.author,
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
      setEditingPublication(null)
    } catch (error) {
      dispatch(addNotification({ message: 'Error al guardar la publicación', color: 'danger' }));
    }
  };

  const handleEdit = (publication: Publication | null) => {
    if (!publication) {
      setTitle('');
      setContent('');
      setShowModal(true);
      setEditingPublication(null);
      return;
    }
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
      {/* Header Section */}
      <div className="text-center my-4 p-5 bg-light rounded">
        <h1>Bienvenidos a Tertulia Literaria</h1>
        <p>
          Un espacio donde convergen la literatura, la filosofía, el arte, la ciencia y la tecnología para crear un ambiente de diálogo y aprendizaje.
        </p>
      </div>

      <Row>
        <Col md={9}>
          <PublicationsList
            publications={publications}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            user={user}
            setShowModal={setShowModal}
          />
        </Col>
        <Col md={3}>
          <Sidebar />
        </Col>
      </Row>

      <PublicationModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleSubmit={handleSubmit}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        editingPublication={editingPublication}
        uploadImage={uploadImage}
      />
    </Container>
  );
};

export default HomePage;
