import React, { useEffect, useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { storage } from '../utils/firebase';
import axios from '../utils/axios';
import { Button, Carousel, Container } from 'react-bootstrap';

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
        let response = null;
        if (templateType) {
          response = await axios.get(`/template?type=${templateType}`);
        } else {
          response = await axios.get('/template');
        }
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
        <h5>Selecciona una plantilla haciendo clic:</h5>
        <Carousel>
          {templates.map((template) => (
            <Carousel.Item key={template.id}>
              <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                <Button variant="primary" onClick={() => handleTemplateClick(template.content)}>
                  {template.name}
                </Button>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </>
  );
};

export default CustomEditor;
