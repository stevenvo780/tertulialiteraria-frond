import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../redux/store';
import api from '../../utils/axios';
import { getLibraries, addLibrary, updateLibrary, deleteLibrary } from '../../redux/library';
import { addNotification } from '../../redux/ui';
import { Library, CreateLibraryDto, UpdateLibraryDto } from '../../utils/types';
import LibraryList from './LibraryList';
import LibraryFormModal from './LibraryFormModal';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { UserRole } from '../../utils/types';

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
    } catch (error) {
      dispatch(addNotification({ message: 'Error al obtener las referencias', color: 'danger' }));
    }
  };

  const fetchNoteById = async (id: number) => {
    try {
      const response = await api.get<Library>(`/library/${id}`);
      setCurrentNote(response.data);
      return response.data;
    } catch (error) {
      dispatch(addNotification({ message: 'Error al obtener la nota', color: 'danger' }));
      return null;
    }
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
      <Row>
        {!currentNote && (
          <Col md={currentNote ? 12 : 10} className="text-center">
            <Form onSubmit={handleSearch} className="mb-4">
              <Form.Group controlId="searchQuery">
                <Row>
                  <Col md={10} className="text-center">
                    <Form.Control
                      type="text"
                      placeholder="Buscar por título o descripción"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </Col>
                  <Col md={2} className="text-center">
                    <Button variant="primary" type="submit">
                      Buscar
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          </Col>
        )}
        <Col md={currentNote ? 12 : 2} className="text-center">
          {currentNote ? (
            <>
              <Button variant="secondary" onClick={handleGoBack} className="mr-4" style={{ marginInline: 20 }}>
                <FaArrowLeft /> Volver
              </Button>
              {permissionsEditable && (
                <>
                  <Button variant="primary" onClick={() => setShowModal(true)} style={{ marginInline: 20 }}>
                    <FaPlus /> Crear Subnota
                  </Button>
                  <Button variant="warning" onClick={() => handleEdit(currentNote)} style={{ marginInline: 20 }}>
                    <FaEdit /> Editar Nota
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(currentNote)}>
                    <FaTrash /> Eliminar Nota
                  </Button>
                </>
              )}
            </>
          ) : (permissionsEditable && (
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <FaPlus /> Crear nota
            </Button>
          )
          )}
        </Col>
      </Row>
      <br />
      <Row>
        {currentNote ? (
          <>
            <h4 className="text-center">{currentNote.title}</h4>
            <div dangerouslySetInnerHTML={{ __html: currentNote.description }} />
            {currentNote.children && currentNote.children.length > 0 ? (
              <LibraryList
                libraries={currentNote.children}
                onEdit={permissionsEditable ? handleEdit : undefined}
                onDelete={permissionsEditable ? handleDelete : undefined}
                onNavigate={handleNoteClick}
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
      </Row>
    </Container>
  );
};

export default LibraryPage;
