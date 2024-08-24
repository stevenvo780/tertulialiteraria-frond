import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Row, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../redux/store';
import api from '../../utils/axios';
import { getLibraries, addLibrary, updateLibrary, deleteLibrary } from '../../redux/library';
import { addNotification } from '../../redux/ui';
import { Library, CreateLibraryDto, UpdateLibraryDto, Like, LikeTarget } from '../../utils/types';
import LibraryList from './LibraryList';
import LibraryFormModal from './LibraryFormModal';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaThumbsUp, FaThumbsDown, FaShareAlt } from 'react-icons/fa';
import { UserRole } from '../../utils/types';
import ShareNoteModal from './ShareNoteModal';
import { getRoleInSpanish } from '../../utils/roleTranslation';

const LibraryPage: React.FC = () => {
  const { noteId } = useParams<{ noteId: string | undefined }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const libraries = useSelector((state: RootState) => state.library.libraries);
  const userRole = useSelector((state: RootState) => state.auth.userData?.role);
  const [currentNote, setCurrentNote] = useState<Library | null>(null);
  const [navigationStack, setNavigationStack] = useState<Library[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingLibrary, setEditingLibrary] = useState<Library | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [likesData, setLikesData] = useState<Record<number, { likes: number; dislikes: number; userLike: Like | null }>>({});
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false);
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);

  useEffect(() => {
    if (noteId) {
      fetchNoteById(parseInt(noteId));
    } else {
      fetchLibraries();
    }
  }, [noteId]);

  const fetchLibraries = async () => {
    try {
      const response = await api.get<Library[]>('/library');
      dispatch(getLibraries(response.data));
      setCurrentNote(null);
      fetchLikesDataAsync(response.data);
    } catch (error) {
      dispatch(addNotification({ message: 'Error al obtener las referencias', color: 'danger' }));
    }
  };

  const fetchNoteById = async (id: number) => {
    try {
      const response = await api.get<Library>(`/library/${id}`);
      setCurrentNote(response.data);
      fetchLikesDataAsync([response.data]);
      return response.data;
    } catch (error) {
      dispatch(addNotification({ message: 'Error al obtener la nota', color: 'danger' }));
      return null;
    }
  };

  const fetchLikesDataAsync = (libraries: Library[]) => {
    libraries.forEach(async (library) => {
      if (!library || !library.id) return;
      try {
        const [countResponse, userLikeResponse] = await Promise.all([
          api.get(`/likes/library/${library.id}/count`),
          api.get(`/likes/library/${library.id}/user-like`),
        ]);
        setLikesData(prevLikesData => ({
          ...prevLikesData,
          [library.id]: {
            likes: countResponse.data.likes,
            dislikes: countResponse.data.dislikes,
            userLike: userLikeResponse.data || null,
          },
        }));
      } catch (error) {
        dispatch(addNotification({ message: `Error al obtener los likes de la nota ${library.id}`, color: 'danger' }));
      }
    });
  };

  const handleLikeToggle = async (noteId: number, isLike: boolean) => {
    if (!userRole) {
      dispatch(addNotification({ message: 'Debes iniciar sesión para dar like o dislike', color: 'warning' }));
      return;
    }
    try {
      const currentLike = likesData[noteId]?.userLike;
      if (currentLike && currentLike.isLike === isLike) {
        await api.delete(`/likes/${currentLike.id}`);
      } else {
        await api.post('/likes', { targetType: LikeTarget.LIBRARY, targetId: noteId, isLike });
      }
      const noteById = libraries.find((note) => note.id === noteId);
      fetchLikesDataAsync([noteById as Library]);
    } catch (error) {
      dispatch(addNotification({ message: 'Error al dar like o dislike', color: 'danger' }));
    }
  };

  const handleShare = (library: Library) => {
    setSelectedLibrary(library);
    setShareModalVisible(true);
  };

  const handleNoteClick = async (note: Library) => {
    if (currentNote) {
      setNavigationStack([...navigationStack, currentNote]);
    }
    const fetchedNote = await fetchNoteById(note.id);
    if (fetchedNote) {
      navigate(`/library/${note.id}`);
    }
  };

  const handleGoBack = async () => {
    const previousNote = navigationStack.pop();
    setCurrentNote(previousNote || null);
    setNavigationStack([...navigationStack]);

    if (!previousNote) {
      navigate('/library');
      await fetchLibraries();
    } else {
      navigate(`/library/${previousNote.id}`);
      await fetchNoteById(previousNote.id);
    }
  };

  const handleCreateOrUpdate = async (libraryData: CreateLibraryDto | UpdateLibraryDto) => {
    try {
      if (editingLibrary) {
        await api.patch(`/library/${editingLibrary.id}`, libraryData as UpdateLibraryDto);
        dispatch(updateLibrary({ ...editingLibrary, ...libraryData } as Library));
        dispatch(addNotification({ message: 'Referencia actualizada correctamente', color: 'success' }));
      } else {
        const response = await api.post<Library>('/library', {
          ...libraryData,
          parentNoteId: currentNote?.id || undefined,
        } as CreateLibraryDto);
        dispatch(addLibrary(response.data));
        dispatch(addNotification({ message: 'Referencia creada correctamente', color: 'success' }));

        currentNote ? fetchNoteById(currentNote.id) : fetchLibraries();
      }
      setShowModal(false);
    } catch (error) {
      dispatch(addNotification({ message: 'Error al guardar la referencia', color: 'danger' }));
    }
  };

  const handleEdit = (library: Library) => {
    setEditingLibrary(library);
    setShowModal(true);
  };

  const handleDelete = async (library: Library) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta referencia?')) {
      try {
        await api.delete(`/library/${library.id}`);
        dispatch(deleteLibrary(library.id));
        dispatch(addNotification({ message: 'Referencia eliminada correctamente', color: 'success' }));

        currentNote ? fetchNoteById(currentNote.id) : fetchLibraries();
      } catch (error) {
        dispatch(addNotification({ message: 'Error al eliminar la referencia', color: 'danger' }));
      }
    }
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (searchQuery && searchQuery.length > 3) {
        const response = await api.get<Library[]>('/library/view/search', {
          params: { query: searchQuery },
        });
        dispatch(getLibraries(response.data));
        setCurrentNote(null);
      } else {
        fetchLibraries();
      }
    } catch (error) {
      dispatch(addNotification({ message: 'Error al realizar la búsqueda', color: 'danger' }));
    }
  };

  const permissionsEditable = (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN || userRole === UserRole.EDITOR);

  return (
    <Container>
      <Row className="align-items-center mb-4">
        {!currentNote && (
          <Col md={(currentNote) ? 12 : 11}>
            <Form onSubmit={handleSearch} className="mb-4">
              <Form.Group controlId="searchQuery">
                <Row>
                  <Col md={10} xs={9}>
                    <Form.Control
                      type="text"
                      placeholder="Buscar por título o descripción"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </Col>
                  <Col md={2} xs={2} className="text-right">
                    <Button variant="primary" type="submit">
                      Buscar
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          </Col>
        )}
        {currentNote && (
          <Col xs={2} md={9}>
            <Button variant="secondary" onClick={handleGoBack} className="p-0" >
              <FaArrowLeft size={44} />
            </Button>
          </Col>
        )}
        <Col xs={10} md={currentNote ? 3 : 1} className="text-right">
          {permissionsEditable && (
            <>
              <Button variant="link" onClick={() => setShowModal(true)} className="p-0" style={{ marginInline: 20 }}>
                <FaPlus size={44} />
              </Button>
              {currentNote && (
                <>
                  <FaEdit onClick={() => handleEdit(currentNote)} size={44} style={{ cursor: 'pointer', marginInline: 20 }} />
                  <FaTrash onClick={() => handleDelete(currentNote)} size={44} style={{ cursor: 'pointer', marginInline: 20 }} />
                </>
              )}
            </>
          )}
        </Col>
      </Row>
      {currentNote && (
        <>
          <Row className="align-items-center mb-3">
            <Col md={9} >
              <h4 className="m-0">{currentNote.title}</h4>
              {currentNote.author && (
                <p className="text-muted m-0">{`${currentNote.author.name} - ${getRoleInSpanish(currentNote.author.role)}`}</p>
              )}
            </Col>
            <Col md={3} className="text-right">
              <Button
                variant="link"
                onClick={() => handleLikeToggle(currentNote.id, true)}
                className={likesData[currentNote.id]?.userLike?.isLike ? 'text-primary' : ''}
              >
                <FaThumbsUp /> {likesData[currentNote.id]?.likes || 0}
              </Button>
              <Button
                variant="link"
                onClick={() => handleLikeToggle(currentNote.id, false)}
                className={likesData[currentNote.id]?.userLike?.isLike === false ? 'text-danger' : ''}
              >
                <FaThumbsDown /> {likesData[currentNote.id]?.dislikes || 0}
              </Button>
              <Button
                variant="link"
                onClick={() => handleShare(currentNote)}
                className="text-info"
              >
                <FaShareAlt /> Compartir
              </Button>
            </Col>
          </Row>
        </>
      )}

      <Row>
        {currentNote ? (
          <>
            <div dangerouslySetInnerHTML={{ __html: currentNote.description }} />
            {currentNote.children && currentNote.children.length > 0 ? (
              <LibraryList
                libraries={currentNote.children}
                onEdit={permissionsEditable ? handleEdit : undefined}
                onDelete={permissionsEditable ? handleDelete : undefined}
                onNavigate={handleNoteClick}
                likesData={likesData}
                handleLikeToggle={handleLikeToggle}
                handleShare={handleShare}
              />
            ) : (
              <p className="text-center text-muted">No hay subnotas.</p>
            )}
          </>
        ) : (
          <LibraryList
            libraries={libraries}
            onEdit={permissionsEditable ? handleEdit : undefined}
            onDelete={permissionsEditable ? handleDelete : undefined}
            onNavigate={handleNoteClick}
            likesData={likesData}
            handleLikeToggle={handleLikeToggle}
            handleShare={handleShare}
          />
        )}

        {permissionsEditable && (
          <LibraryFormModal
            show={showModal}
            onHide={() => setShowModal(false)}
            onSubmit={handleCreateOrUpdate}
            editingLibrary={editingLibrary}
            showModal={showModal}
          />
        )}

        {selectedLibrary && (
          <ShareNoteModal
            show={shareModalVisible}
            onHide={() => setShareModalVisible(false)}
            note={selectedLibrary}
          />
        )}
      </Row>
    </Container>
  );
};

export default LibraryPage;
