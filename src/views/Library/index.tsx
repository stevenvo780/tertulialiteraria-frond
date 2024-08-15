import React, { useState, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import api from '../../utils/axios';
import { getLibraries, addLibrary, updateLibrary } from '../../redux/library';
import { addNotification } from '../../redux/ui';
import { Library, CreateLibraryDto, UpdateLibraryDto } from '../../utils/types';
import LibraryList from './LibraryList';
import LibraryFormModal from './LibraryFormModal';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';

const LibraryPage: React.FC = () => {
  const dispatch = useDispatch();
  const libraries = useSelector((state: RootState) => state.library.libraries);
  const [currentNote, setCurrentNote] = useState<Library | null>(null);
  const [navigationStack, setNavigationStack] = useState<Library[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingLibrary, setEditingLibrary] = useState<Library | null>(null);

  useEffect(() => {
    fetchLibraries();
  }, []);

  const fetchLibraries = async () => {
    try {
      const response = await api.get<Library[]>('/library');
      dispatch(getLibraries(response.data));
    } catch (error) {
      dispatch(addNotification({ message: 'Error al obtener las referencias', color: 'danger' }));
    }
  };

  const fetchNoteById = async (noteId: number) => {
    try {
      const response = await api.get<Library>(`/library/${noteId}`);
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
      setCurrentNote(fetchedNote);
    }
  };

  const handleGoBack = () => {
    const previousNote = navigationStack.pop();
    setCurrentNote(previousNote || null);
    setNavigationStack([...navigationStack]);
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

  return (
    <Container>
      <div className="my-4 text-center">
        {currentNote ? (
          <>
            <Button variant="secondary" onClick={handleGoBack} className="mr-2">
              <FaArrowLeft /> Volver
            </Button>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <FaPlus /> Crear Subnota
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FaPlus /> Crear Nota
          </Button>
        )}
      </div>

      {currentNote ? (
        <>
          <h4 className="text-center">{currentNote.title}</h4>
          <p className="text-center">{currentNote.description}</p>
          {currentNote.children && currentNote.children.length > 0 ? (
            <LibraryList
              libraries={currentNote.children}
              onEdit={handleEdit}
              onDelete={() => {}}
              onNavigate={handleNoteClick}
            />
          ) : (
            <p className="text-center text-muted">No hay subnotas.</p>
          )}
        </>
      ) : (
        <LibraryList
          libraries={libraries}
          onEdit={handleEdit}
          onDelete={() => {}}
          onNavigate={handleNoteClick}
        />
      )}

      <LibraryFormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleCreateOrUpdate}
        editingLibrary={editingLibrary}
        libraries={libraries}
      />
    </Container>
  );
};

export default LibraryPage;
