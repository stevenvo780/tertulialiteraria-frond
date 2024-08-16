import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

const AboutPage: React.FC = () => {
  return (
    <>
      <div
        className="d-flex align-items-center justify-content-center text-white"
        style={{
          backgroundImage: "url('/images/about.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '300px',
          width: '100vw',
          position: 'relative',
          marginLeft: 'calc(-50vw + 50%)',
        }}
      >
        <div className="text-center" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>
          <h1>Sobre Tertulia Literaria</h1>
        </div>
      </div>
      <Container className="my-5">
        <Row>
          <Col>
            <p>
              <strong>Tertulia Literaria</strong> es un grupo digital cultural cuyo propósito es fomentar el diálogo y el aprendizaje en áreas como la literatura, los debates, la filosofía, el arte y la ciencia, incluyendo la tecnología. Nuestro objetivo es crear un espacio inclusivo donde las ideas y el conocimiento puedan florecer a través de interacciones significativas y respetuosas.
            </p>
            <p>
              Nos guiamos por una iniciativa pedagógica y humana, aspirando a ser un faro de sabiduría y comprensión. Valoramos la humildad y buscamos establecer un contexto real en el que profesionistas, maestros, estudiantes y cualquier persona interesada puedan encontrarse, aprender y descubrir nuevos horizontes. Reconocemos la importancia de las charlas de conferencistas como un medio para enriquecer nuestras elucubraciones y ampliar nuestra perspectiva. Queremos separarnos de las comunidades tóxicas de internet, creando un espacio con personas reales que se respetan y apoyan mutuamente.
            </p>
            <p>
              En este sentido, Tertulia Literaria también se posiciona como un frente contra la desinformación y el ambiente extremista de internet, actuando como un santuario donde las personas pueden disfrutar y cultivarse. Es el espacio idóneo que compartirías con tus amistades, un punto de reunión digital para maestros y alumnos, para profesionales y especialistas en diversas ramas del conocimiento. Juntos, construimos una iniciativa por un internet sano que abrace el ideal de sus orígenes.
            </p>
            <h2 className="mt-5">Metodología</h2>
            <p>
              En Tertulia Literaria abordamos temas que van desde las más altas cumbres de la literatura hasta las profundidades de la ciencia y la tecnología. Entendemos que el verdadero conocimiento no solo proviene de los libros, sino también del intercambio verídico de experiencias y pensamientos. Por ello, promovemos debates y discusiones que no solo informan, sino también transforman a quienes participan.
            </p>
            <p>
              Nos comprometemos a mantener una comunidad libre de toxicidad, donde cada miembro pueda expresar sus ideas sin temor a ser denostado. En un mundo donde el ruido y la desinformación a menudo prevalecen, nosotros aspiramos a un encuentro auténtico y humilde, que refleje el comportamiento normal y las aspiraciones mundanas de aquellos que buscan la verdad y la comprensión.
            </p>
            <p>
              Tertulia Literaria proporciona herramientas y recursos prácticos para el desarrollo intelectual y personal de sus miembros. Ofrecemos talleres y seminarios virtuales que cubren habilidades prácticas como la escritura creativa, el pensamiento crítico, la argumentación lógica y el análisis literario. Además, organizamos sesiones de mentoría donde los miembros pueden recibir orientación profesional y académica de expertos en sus respectivos campos.
            </p>
            <h2 className="mt-5">Fin Último</h2>
            <p>
              Tertulia Literaria es más que un grupo digital; es una comunidad viviente que respira conocimiento y humildad, donde cada interacción es una oportunidad para aprender y crecer, y donde cada individuo es valorado por su contribución única al diálogo colectivo. Aquí, el conocimiento no solo se comparte, sino que se aplica de manera práctica, ayudando a cada miembro a alcanzar sus objetivos personales y profesionales.
            </p>
            <p>
              Es también un espacio donde tú puedes contribuir a crear este sueño en internet, participando activamente y colaborando en la construcción de una comunidad significativa y enriquecedora.
            </p>
            <h2 className="mt-5">Bases</h2>
            <p>
              Nuestra misión se basa en principios filosóficos y pedagógicos de pensadores como Montessori, Gadamer, Russell, Platón, Sócrates y Martin Buber. Adoptamos la metodología Montessori en nuestra pedagogía, promoviendo un aprendizaje autodirigido y colaborativo que fomenta la curiosidad natural y la creatividad de nuestros miembros.
            </p>
            <p>
              Inspirados por Gadamer, creemos en la importancia del diálogo y la hermenéutica como medios para alcanzar una comprensión más profunda y auténtica del mundo. Siguiendo a Russell, defendemos el pensamiento crítico y la lógica como herramientas esenciales para navegar la complejidad del conocimiento. Platón y Sócrates nos inspiran con su énfasis en la dialéctica y la búsqueda de la verdad a través de la conversación.
            </p>
            <p>
              Finalmente, la filosofía de Martin Buber nos recuerda la importancia de las relaciones interpersonales auténticas y el diálogo genuino, elementos fundamentales para construir una comunidad basada en el respeto mutuo y la empatía. En resumen, Tertulia Literaria es un espacio donde convergen la filosofía y la pedagogía para crear un entorno de aprendizaje y crecimiento personal y colectivo, en un ambiente libre de toxicidad y desinformación.
            </p>
          </Col>
        </Row>
        <Row className="mt-5 text-center">
          <Col>
            <h2>Liderado por Karla Nevárez</h2>
            <Image
              src="/images/owner.jpg"
              alt="Karla Nevárez"
              roundedCircle
              style={{ width: '150px', height: '150px', objectFit: 'cover', boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.3)' }}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AboutPage;
