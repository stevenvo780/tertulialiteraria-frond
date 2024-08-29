import React, { useEffect, useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { storage } from '../utils/firebase';
import axios from '../utils/axios';
import { Container, Col, Card } from 'react-bootstrap';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


interface CustomEditorProps {
  content: string;
  setContent: (content: string) => void;
  height?: number;
  menubar?: boolean;
  toolbar?: string;
  plugins?: string;
  apiKey?: string;
  contentCss?: string;
  templateType?: string;
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
  height = 500,
  menubar = false,
  toolbar = "undo redo fullscreen spellcheckdialog formatpainter | blocks fontfamily fontsize | bold italic underline forecolor backcolor | link image | alignleft aligncenter alignright alignjustify | code",
  plugins = 'fullscreen powerpaste casechange searchreplace autolink directionality visualblocks visualchars image link media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount editimage help formatpainter permanentpen charmap linkchecker emoticons advtable export autosave advcode fullscreen',
  apiKey = 'ide9bzali9973f0fmbzusywuxlpp3mxmigqoa07eddfltlrj',
  contentCss = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
  templateType = null,
}) => {
  const editorRef = useRef<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);

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

  const handleTemplateClick = (templateContent: string) => {
    setContent(templateContent);
  };

  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

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
      <Editor
        apiKey={apiKey}
        value={content || ''}
        onInit={(evt, editor) => {
          editorRef.current = editor;
        }}
        init={{
          height: height,
          menubar: menubar,
          plugins: plugins,
          toolbar: toolbar,
          images_upload_handler: uploadImage,
          content_css: contentCss,
          advcode_inline: true,
        }}
        onEditorChange={(newContent: string) => setContent(newContent)}
      />
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
                      <Card.Title style={{ color: 'var(--primary-text)', }} >{template.name}</Card.Title>
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
