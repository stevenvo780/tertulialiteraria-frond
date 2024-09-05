import React, { useEffect, useState } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import EditorCode from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import TemplateSlider from './TemplateSlider';
import { Button, ButtonGroup } from 'react-bootstrap';
import CustomImageUpload from './CustomImageUpload';

interface CustomEditorProps {
  content: { html: string; css: string };
  setContent: (content: { html: string; css: string }) => void;
  templateType?: string;
  height?: number;
}

const CustomEditor: React.FC<CustomEditorProps> = ({
  content,
  setContent,
  templateType = null,
  height = 500,
}) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [viewMode, setViewMode] = useState<'editor' | 'html' | 'css'>('editor');
  const [htmlContent, setHtmlContent] = useState(content.html);
  const [cssContent, setCssContent] = useState(content.css);

  useEffect(() => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState);
    setHtmlContent(htmlContent);
  }, [editorState]);

  const handleApplyHtmlChanges = () => {
    const contentBlock = htmlToDraft(htmlContent);
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks, contentBlock.entityMap);
    setEditorState(EditorState.createWithContent(contentState));
    setContent({ html: htmlContent, css: cssContent });
  };

  const handleApplyCssChanges = () => {
    setContent({ html: htmlContent, css: cssContent });
  };

  return (
    <>
      {viewMode === 'editor' ? (
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={setEditorState}
          toolbarCustomButtons={[<CustomImageUpload editorState={editorState} onEditorStateChange={setEditorState} />]}
          toolbar={{
            options: [
              'inline',
              'blockType',
              'fontSize',
              'fontFamily',
              'list',
              'textAlign',
              'colorPicker',
              'link',
              'emoji',
              'history',
            ],
            inline: { inDropdown: true },
          }}
          editorStyle={{ height: `${height}px`, border: "1px solid #F1F1F1", padding: "10px" }}
        />
      ) : viewMode === 'html' ? (
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
      ) : (
        <EditorCode
          value={cssContent}
          onValueChange={setCssContent}
          highlight={code => Prism.highlight(code, Prism.languages.css, 'css')}
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
      <br />
      <div className="d-flex justify-content-between mb-3">
        <ButtonGroup>
          <Button variant="primary" onClick={() => setViewMode('editor')} size='sm'>
            Ver Editor
          </Button>
          <Button variant="info" onClick={() => setViewMode('html')} size='sm'>
            Ver HTML
          </Button>
          <Button variant="secondary" onClick={() => setViewMode('css')} size='sm'>
            Ver CSS
          </Button>
        </ButtonGroup>
        {viewMode === 'html' && (
          <Button variant="success" onClick={handleApplyHtmlChanges} size='sm'>
            Aplicar Cambios HTML
          </Button>
        )}
        {viewMode === 'css' && (
          <Button variant="success" onClick={handleApplyCssChanges} size='sm'>
            Aplicar Cambios CSS
          </Button>
        )}
      </div>
      <TemplateSlider
        templateType={templateType || ''}
        onTemplateClick={(templateContent: string) => {
          const contentBlock = htmlToDraft(templateContent);
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks, contentBlock.entityMap);
          setEditorState(EditorState.createWithContent(contentState));
        }}
      />
    </>
  );
};

export default CustomEditor;
