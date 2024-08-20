import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { getTemplates, updateTemplate, addTemplate, deleteTemplate } from '../../redux/templates';
import { addNotification } from '../../redux/ui';
import axios from '../../utils/axios';
import TemplateEditModal from './TemplateEditModal';
import { TemplateType } from '../../utils/types';

const TemplatePage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState(TemplateType.NOTES);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const templates = useSelector((state: RootState) => state.templates.templates);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('/template');
        dispatch(getTemplates(response.data));
      } catch (error) {
        dispatch(addNotification({ message: 'Error al cargar plantillas', color: 'danger' }));
      }
    };

    fetchTemplates();
  }, [dispatch]);

  const handleCreateClick = () => {
    setSelectedTemplate(null);
    setTitle('');
    setContent('');
    setType(TemplateType.NOTES);
    setIsEditing(false);
    setShowEditModal(true);
  };

  const handleEditClick = (template: any) => {
    setSelectedTemplate(null);
    setTitle(template.name);
    setContent(template.content);
    setType(template.type);
    setIsEditing(true);
    setShowEditModal(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (isEditing) {
        const response = await axios.patch(`/template/${selectedTemplate.id}`, { name: title, content, type });
        if (response.status === 200) {
          dispatch(updateTemplate({ ...selectedTemplate, name: title, content, type }));
          dispatch(addNotification({ message: 'Plantilla actualizada correctamente', color: 'success' }));
        } else {
          dispatch(addNotification({ message: 'Error al actualizar la plantilla', color: 'danger' }));
        }
      } else {
        const response = await axios.post('/template', { name: title, content, type });
        if (response.status === 201) {
          dispatch(addTemplate(response.data));
          dispatch(addNotification({ message: 'Plantilla creada correctamente', color: 'success' }));
        } else {
          dispatch(addNotification({ message: 'Error al crear la plantilla', color: 'danger' }));
        }
      }
    } catch (error) {
      dispatch(addNotification({ message: 'Error al procesar la solicitud', color: 'danger' }));
    } finally {
      setIsLoading(false);
      setShowEditModal(false);
    }
  };

  const handleDeleteClick = async (templateId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta plantilla?')) {
      try {
        const response = await axios.delete(`/template/${templateId}`);
        if (response.status === 200) {
          dispatch(deleteTemplate(templateId));
          dispatch(addNotification({ message: 'Plantilla eliminada correctamente', color: 'success' }));
        } else {
          dispatch(addNotification({ message: 'Error al eliminar la plantilla', color: 'danger' }));
        }
      } catch (error) {
        dispatch(addNotification({ message: 'Error al eliminar la plantilla', color: 'danger' }));
      }
    }
  };

  const handlePreviewClick = (template: any) => {
    setSelectedTemplate(template);
    setShowEditModal(false);
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col className="text-center">
          <Button variant="success" onClick={handleCreateClick}>
            Crear Nueva Plantilla
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="text-center mb-4">Lista de Plantillas</h2>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id}>
                  <td>{template.id}</td>
                  <td>{template.name}</td>
                  <td>{template.type}</td>
                  <td>
                    <Button style={{ marginInline: 10 }} variant="info" size="sm" onClick={() => handleEditClick(template)}>
                      Editar
                    </Button>
                    <Button style={{ marginInline: 10 }} variant="primary" size="sm" onClick={() => handlePreviewClick(template)}>
                      Previsualizar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteClick(template.id)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={!!selectedTemplate && !showEditModal} onHide={() => setSelectedTemplate(null)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Previsualización de Plantilla</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: selectedTemplate?.content || '' }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedTemplate(null)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <TemplateEditModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        content={content}
        setContent={setContent}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        isEditing={isEditing}
        title={title}
        setTitle={setTitle}
        type={type}
        setType={setType}
      />
    </Container>
  );
};

export default TemplatePage;
