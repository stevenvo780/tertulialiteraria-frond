import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import api from '../../utils/axios';
import { getPublications, addPublication, updatePublication, deletePublication } from '../../redux/publications';
import { addNotification } from '../../redux/ui';
import { RootState } from '../../redux/store';
import PublicationsList from './PublicationsList';
import Sidebar from './Sidebar';
import PublicationModal from './PublicationModal';
import { Publication, Events, CreatePublicationDto, Like, LikeTarget } from '../../utils/types';
import ScrollableEvents from '../../components/ScrollableEvents';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.userData);
  const publications = useSelector((state: RootState) => state.publications.publications);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [repetitiveEvents, setRepetitiveEvents] = useState<Events[]>([]);
  const [likesData, setLikesData] = useState<Record<number, { likes: number; dislikes: number; userLike: Like | null }>>({});
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const limit = 4; // Número de publicaciones por solicitud

  useEffect(() => {
    fetchPublications();
    fetchRepetitiveEvents();
  }, []);

  const fetchPublications = async () => {
    if (!hasMore) return;

    try {
      const response = await api.get<Publication[]>('/publications', {
        params: { limit, offset },
      });

      if (response.data.length === 0) {
        setHasMore(false); // No hay más publicaciones para cargar
      } else {
        dispatch(getPublications(response.data)); // Añadir nuevas publicaciones sin sobrescribir
        fetchLikesDataAsync(response.data);
        setOffset(offset + limit);
      }
    } catch (error) {
      dispatch(addNotification({ message: 'Error al obtener las publicaciones', color: 'danger' }));
    }
  };

  const fetchRepetitiveEvents = async () => {
    try {
      const response = await api.get<Events[]>('/events/home/upcoming?limit=31');
      const repetitive = response.data.filter(event => event.repetition);
      setRepetitiveEvents(repetitive);
    } catch (error) {
      dispatch(addNotification({ message: 'Error al obtener los eventos repetitivos', color: 'danger' }));
    }
  };

  const fetchLikesDataAsync = (publications: Publication[]) => {
    publications.forEach(async (publication) => {
      try {
        const [countResponse, userLikeResponse] = await Promise.all([
          api.get(`/likes/publication/${publication.id}/count`),
          api.get(`/likes/publication/${publication.id}/user-like`),
        ]);
        setLikesData(prevLikesData => ({
          ...prevLikesData,
          [publication.id]: {
            likes: countResponse.data.likes,
            dislikes: countResponse.data.dislikes,
            userLike: userLikeResponse.data || null,
          },
        }));
      } catch (error) {
        dispatch(addNotification({ message: `Error al obtener los likes de la publicación ${publication.id}`, color: 'danger' }));
      }
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const publicationData: CreatePublicationDto = {
      title,
      content,
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
    setContent(publication.content);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/publications/${id}`);
      dispatch(deletePublication(id));
      dispatch(addNotification({ message: 'Publicación eliminada correctamente', color: 'success' }));
    } catch (error) {
      dispatch(addNotification({ message: 'Error al eliminar la publicación', color: 'danger' }));
    }
  };

  const handleLikeToggle = async (publicationId: number, isLike: boolean) => {
    try {
      const currentLike = likesData[publicationId]?.userLike;

      if (currentLike && currentLike.isLike === isLike) {
        await api.delete(`/likes/${currentLike.id}`);
      } else {
        await api.post('/likes', { targetType: LikeTarget.PUBLICATION, targetId: publicationId, isLike });
      }

      fetchLikesDataAsync(publications);
    } catch (error) {
      dispatch(addNotification({ message: 'Error al dar like o dislike', color: 'danger' }));
    }
  };

  return (
    <>
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
          <Col md={9} style={{ marginTop: 40 }}>
            <InfiniteScroll
              dataLength={publications.length}
              next={fetchPublications}
              hasMore={hasMore}
              loader={<h4>Cargando más publicaciones...</h4>}
              scrollableTarget="scrollableDiv"
            >
              <div id="scrollableDiv" style={{ height: '45vw', overflowY: 'auto' }}>
                <PublicationsList
                  publications={publications}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  handleLikeToggle={handleLikeToggle}
                  likesData={likesData}
                  user={user}
                  setShowModal={setShowModal}
                />
              </div>
            </InfiniteScroll>
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
