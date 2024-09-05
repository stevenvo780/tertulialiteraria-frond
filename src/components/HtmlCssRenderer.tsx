import React from 'react';

interface HtmlCssRendererProps {
  content: {
    html: string;
    css: string;
  } | null;
}

const HtmlCssRenderer: React.FC<HtmlCssRendererProps> = ({ content }) => {
  if (!content) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ color: '#888', fontStyle: 'italic', fontSize: '18px', textAlign: 'center' }}>
          Cargando contenido...
        </div>
      </div>
    );
  }

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: content.css }} />
      <div dangerouslySetInnerHTML={{ __html: content.html }} />
    </div>
  );
};

export default HtmlCssRenderer;
