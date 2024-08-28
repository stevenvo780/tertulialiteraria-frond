import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Container, Row, Col } from 'react-bootstrap';
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
    setSelectedTemplate(template);
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
        <Col md={4}>
          {templates.map((template) => (
            <Card key={template.id} className="mb-3">
              <Card.Body>
                <Card.Title>{template.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{template.type}</Card.Subtitle>
                <Button variant="secondary" size="sm" onClick={() => handleEditClick(template)}>
                  Editar
                </Button>
                <Button className="mx-2" variant="secondary" size="sm" onClick={() => handlePreviewClick(template)}>
                  Previsualizar
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleDeleteClick(template.id)}>
                  Eliminar
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Col>
        <Col md={8}>
          {selectedTemplate && (
            <Card>
              <Card.Header>Previsualización de Plantilla</Card.Header>
              <Card.Body>
                <div dangerouslySetInnerHTML={{ __html: selectedTemplate.content }} />
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

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
