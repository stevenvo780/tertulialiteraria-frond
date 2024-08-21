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
import { Publication, Events } from '../../utils/types';
import ScrollableEvents from '../../components/ScrollableEvents';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.userData);
  const publications = useSelector((state: RootState) => state.publications.publications);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>(''); // HTML Content
  const [repetitiveEvents, setRepetitiveEvents] = useState<Events[]>([]);

  useEffect(() => {
    fetchPublications();
    fetchRepetitiveEvents();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await api.get<Publication[]>('/publications');
      dispatch(getPublications(response.data));
    } catch (error) {
      dispatch(addNotification({ message: 'Error al obtener las publicaciones', color: 'danger' }));
    }
  };

  const fetchRepetitiveEvents = async () => {
    try {
      const response = await api.get<Events[]>('/events/home/upcoming?limit=5');
      const repetitive = response.data.filter(event => event.repetition);
      setRepetitiveEvents(repetitive);
    } catch (error) {
      dispatch(addNotification({ message: 'Error al obtener los eventos repetitivos', color: 'danger' }));
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
      setEditingPublication(null);
    } catch (error) {
      console.error("Error al guardar la publicación:", error);
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

  return (
    <>
      <div
        className="d-flex align-items-center justify-content-center text-white"
        style={{
          backgroundImage: "url('/images/banner.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '300px',
          width: '100vw',
          position: 'relative',
          marginLeft: 'calc(-50vw + 50%)',
        }}
      >
        <div className="text-center" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>
          <h1>Bienvenidos a Tertulia Literaria</h1>
          <p>
            Un espacio donde convergen la literatura, la filosofía, el arte, la ciencia y la tecnología para crear un ambiente de diálogo y aprendizaje.
          </p>
        </div>
      </div>

      <Container className="p-0">
        <Row className="m-0">
          <Col md={12}>
            {repetitiveEvents.length > 0 && <ScrollableEvents events={repetitiveEvents} />}
          </Col>
        </Row>
        <Row className="m-0">
          <Col md={3}>
            <Sidebar />
          </Col>
          <Col md={9} style={{ marginTop: 60 }}>
            <PublicationsList
              publications={publications}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              user={user}
              setShowModal={setShowModal}
            />
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
        />
      </Container>
    </>
  );
};

export default HomePage;
