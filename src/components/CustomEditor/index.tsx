import React, { useEffect, useState } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from '../../utils/axios';
import { Container, Col, Card, Button } from 'react-bootstrap';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import EditorCode from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import ImageUploadModal from './ImageUploadModal';
import { Modifier } from 'draft-js';

interface CustomEditorProps {
  content: string;
  setContent: (content: string) => void;
  templateType?: string;
  height?: number;
}

const CustomPrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <FaChevronLeft
      className={className}
      style={{ ...style, display: "block", fontSize: "40px", color: "var(--primary-color)" }}
      onClick={onClick}
    />
  );
};

const CustomNextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <FaChevronRight
      className={className}
      style={{ ...style, display: "block", fontSize: "40px", color: "var(--primary-color)" }}
      onClick={onClick}
    />
  );
};

const CustomEditor: React.FC<CustomEditorProps> = ({
  content,
  setContent,
  templateType = null,
  height = 500,
}) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [templates, setTemplates] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'editor' | 'html'>('editor');
  const [htmlContent, setHtmlContent] = useState(content);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(`/template?type=${templateType || ''}`);
        if (response.data) {
          setTemplates(response.data);
        } else {
          console.error('Error al cargar templates:', response);
        }
      } catch (error) {
        console.error('Error al cargar templates:', error);
      }
    };

    fetchTemplates();
  }, [templateType]);

  const handleImageUpload = (url: string) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src: url });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newContentState = Modifier.insertText(
      contentStateWithEntity,
      editorState.getSelection(),
      ' ',
      undefined,
      entityKey
    );
    const newEditorState = EditorState.set(editorState, { currentContent: newContentState });
    setEditorState(EditorState.forceSelection(newEditorState, editorState.getSelection()));
  };

  const handleTemplateClick = (templateContent: string) => {
    const contentBlock = htmlToDraft(templateContent);
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks, contentBlock.entityMap);
    setEditorState(EditorState.createWithContent(contentState));
  };

  useEffect(() => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState);
    setHtmlContent(htmlContent);
    setContent(htmlContent);
  }, [editorState, setContent]);

  const handleApplyChanges = () => {
    const contentBlock = htmlToDraft(htmlContent);
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks, contentBlock.entityMap);
    setEditorState(EditorState.createWithContent(contentState));
  };

  const sliderSettings = {
    dots: templates.length > 1,
    infinite: templates.length > 1,
    speed: 500,
    slidesToShow: Math.min(templates.length, 3),
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(templates.length, 2),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <ImageUploadModal
        show={showImageModal}
        handleClose={() => setShowImageModal(false)}
        insertImage={handleImageUpload}
      />

      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => setViewMode(viewMode === 'editor' ? 'html' : 'editor')} size='sm'>
          {viewMode === 'editor' ? 'Ver HTML' : 'Ver Editor'}
        </Button>
        {viewMode === 'html' && (
          <Button variant="success" onClick={handleApplyChanges} size='sm'>
            Aplicar Cambios
          </Button>
        )}
      </div>

      {viewMode === 'editor' ? (
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={setEditorState}
          toolbar={{
            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'link', 'image', 'emoji', 'history'],
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            image: {
              icon: undefined,
              className: undefined,
              component: undefined,
              popupClassName: undefined,
              urlEnabled: false,
              uploadEnabled: false,
              alignmentEnabled: true,
              inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
              alt: { present: true, mandatory: false },
              defaultSize: {
                height: 'auto',
                width: 'auto',
              },
              onOpenModal: () => {
                console.log('onOpenModal');
                setShowImageModal(true);
              },
            },
          }}
          editorStyle={{ height: `${height}px`, border: "1px solid #F1F1F1", padding: "10px" }}
        />
      ) : (
        <EditorCode
          value={htmlContent}
          onValueChange={setHtmlContent}
          highlight={code => Prism.highlight(code, Prism.languages.html, 'html')}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            border: "1px solid #F1F1F1",
            borderRadius: "4px",
            height: `${height}px`,
            overflow: 'auto',
            backgroundColor: "#f5f5f5"
          }}
        />
      )}

      <Container className="mt-4">
        <h5>Selecciona una plantilla</h5>
        {templates.length > 0 ? (
          <Slider {...sliderSettings}>
            {templates.map((template) => (
              <div key={template.id}>
                <Col
                  style={{
                    cursor: 'pointer',
                    padding: 15,
                  }}
                  onClick={() => handleTemplateClick(template.content)}
                >
                  <Card style={{
                    minWidth: '100%',
                    marginBottom: '10px',
                    backgroundColor: 'var(--primary-color)',
                  }}>
                    <Card.Body className="d-flex flex-column align-items-center" style={{ padding: 10 }}>
                      <Card.Title style={{ color: 'var(--primary-text)' }}>{template.name}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              </div>
            ))}
          </Slider>
        ) : (
          <p>No hay plantillas disponibles</p>
        )}
      </Container>
    </>
  );
};

export default CustomEditor;