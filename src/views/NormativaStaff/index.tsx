import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './NormativaStaff.css';

const NormativaStaff: React.FC = () => {
  return (
    <Container className="staff-normativa-container my-5">
      <Row>
        <Col>
          <div className="document-header text-center">
            <h1 className="display-4">📋 Reglamento Interno del Staff 📋</h1>
            <p className="lead">
              Este documento establece las normas y responsabilidades que todos los miembros del staff deben seguir para asegurar un ambiente de trabajo eficiente y justo en Tertulia Literaria.
            </p>
          </div>

          <div className="document-section">
            <h2 className="section-title">Reglas del Staff</h2>
            <p className="section-paragraph">
              <strong>1.</strong> El voto del owner vale doble, dada su mayor responsabilidad y trabajo en el servidor.
            </p>
            <p className="section-paragraph">
              <strong>2.</strong> Los miembros del staff deben dar ejemplo de comportamiento, manteniendo el respeto y evitando comentarios ofensivos.
            </p>
            <p className="section-paragraph">
              <strong>3.</strong> La falta de comportamiento será sancionada con advertencias (warns) y, en caso de gravedad, puede llevar al baneo.
            </p>
            <p className="section-paragraph">
              <strong>4.</strong> No se debe jugar con advertencias o baneos, estos deben usarse solo en situaciones reales y justificadas.
            </p>
            <p className="section-paragraph">
              <strong>5.</strong> Los roles de staff pueden ser reasignados en caso de inactividad prolongada de un miembro.
            </p>
            <p className="section-paragraph">
              <strong>6.</strong> Los baneos y sanciones serán decididos por el conjunto del staff basado en las evidencias.
            </p>
          </div>

          <div className="document-section">
            <h2 className="section-title">Anexo a las Reglas del Staff</h2>
            <p className="section-paragraph">
              <strong>1.</strong> Está prohibido hacer difamación al staff o a Tertulia Literaria. Las críticas constructivas deben realizarse en los canales internos.
            </p>
            <p className="section-paragraph">
              <strong>2.</strong> En caso de conflicto de intereses personales, el staff involucrado debe apartarse de la toma de decisiones.
            </p>
            <p className="section-paragraph">
              <strong>3.</strong> Las acciones relacionadas con temas sensibles, como el abuso de menores, deben ser aprobadas por el staff superior (Owner o Co-Owners).
            </p>
            <p className="section-paragraph">
              <strong>4.</strong> Las evidencias delicadas deben ser subidas a los canales internos para que el staff pueda analizarlas con rapidez y eficacia.
            </p>
            <p className="section-paragraph">
              <strong>5.</strong> No se deben discutir o dar explicaciones extensivas a los usuarios sobre las reglas; una explicación concisa es suficiente.
            </p>
            <p className="section-paragraph">
              <strong>6.</strong> No se permite tener un rol de administrador mientras se es staff de otro servidor de características similares.
            </p>
          </div>

          <div className="document-section">
            <h2 className="section-title">Guía de Procedimientos para el Staff</h2>
            <p className="section-paragraph">
              Usamos el bot <strong>@Dyno</strong> [d!] para realizar las acciones de ban, kick y warn. Los permisos básicos de Discord para estas acciones están desactivados para los moderadores, pero pueden hacerlo a través de Dyno por motivos de seguridad.
            </p>
            <p className="section-paragraph">
              <strong>Comandos de Dyno:</strong>
            </p>
            <ul className="section-paragraph">
              <li><strong>Warn:</strong> d!warn [usuario] [razón] o /warn [usuario] [razón]</li>
              <li><strong>Kick:</strong> d!kick [usuario] [razón] o /kick [usuario] [razón]</li>
              <li><strong>Ban:</strong> d!ban [usuario] (tiempo) (razón) o /ban [usuario] (tiempo) (razón)</li>
              <li><strong>Softban:</strong> d!softban [usuario] (razón) o /softban [usuario] (razón)</li>
              <li><strong>Mute:</strong> d!mute [usuario] (tiempo) (razón) o /mute [usuario] (tiempo) (razón)</li>
              <li><strong>Unmute:</strong> d!unmute [usuario]</li>
            </ul>
          </div>

          <div className="document-section">
            <h2 className="section-title">Protocolo de Depresión y Suicidio</h2>
            <p className="section-paragraph">
              La depresión es un trastorno emocional común que puede afectar gravemente las actividades cotidianas. Los síntomas incluyen tristeza, irritabilidad, pérdida de motivación, insomnio y ansiedad.
            </p>
            <p className="section-paragraph">
              Para ayudar a un usuario con depresión, se recomienda:
            </p>
            <ul className="section-paragraph">
              <li>Sugerir que busque ayuda profesional.</li>
              <li>Evitar frases como "anímate" o "no tienes motivo para estar así".</li>
              <li>Estar alerta ante cualquier signo de suicidio y tratar el tema abiertamente.</li>
            </ul>
            <p className="section-paragraph">
              En casos graves, orientar al usuario hacia un psicólogo y obtener la información necesaria para contactar a las autoridades si es necesario.
            </p>
          </div>

          <div className="document-section">
            <h2 className="section-title">Protocolo de Jardineros</h2>
            <p className="section-paragraph">
              Los tickets abiertos por el público serán para consultas, sugerencias y quejas. Los miembros de la administración deberán responder y resolver los tickets a la brevedad.
            </p>
            <p className="section-paragraph">
              Las alianzas serán evaluadas por la administración, y las sanciones serán registradas con fecha y sustento, pudiendo incluir advertencias, expulsión o prohibición de ingreso.
            </p>
          </div>

          <div className="document-section">
            <h2 className="section-title">Estructura y Funciones del Staff</h2>
            <p className="section-paragraph">
              <strong>Administración:</strong>
            </p>
            <ul className="section-paragraph">
              <li><strong>Propietario/a del Servidor:</strong> Responsable de decisiones estratégicas y establecimiento de normas.</li>
              <li><strong>Administradores:</strong> Gestión técnica, moderación y resolución de conflictos.</li>
            </ul>
            <p className="section-paragraph">
              <strong>Moderación y Gestión de Contenido:</strong>
            </p>
            <ul className="section-paragraph">
              <li><strong>Moderadores de Literatura:</strong> Moderación de discusiones literarias y gestión de contenido literario.</li>
              <li><strong>Moderadores de Filosofía:</strong> Moderación de discusiones filosóficas y gestión de contenido filosófico.</li>
            </ul>
            <p className="section-paragraph">
              <strong>Promoción y Comunicaciones:</strong>
            </p>
            <ul className="section-paragraph">
              <li><strong>Publicistas:</strong> Encargados de la promoción del servidor y publicidad de eventos.</li>
              <li><strong>Gestores de Eventos:</strong> Organización de eventos especiales en el servidor.</li>
            </ul>
            <p className="section-paragraph">
              <strong>Soporte y Atención al Usuario:</strong>
            </p>
            <ul className="section-paragraph">
              <li><strong>Asistentes de Soporte:</strong> Ayuda técnica y moderación.</li>
              <li><strong>Recepcionistas:</strong> Bienvenida a nuevos miembros y asistencia en la orientación dentro del servidor.</li>
            </ul>
          </div>

          <div className="document-section">
            <h2 className="section-title">Reuniones</h2>
            <p className="section-paragraph">
              A partir del 13 de julio de 2024, la responsabilidad de la actividad y manejo de áreas será delegada en los responsables de cada área. Las reuniones generales se realizarán solo si es necesario, mientras que las reuniones interdepartamentales serán organizadas según las necesidades de cada área.
            </p>
            <p className="section-paragraph">
              <strong>Responsables de Moderadores:</strong> Stev y Miguel.
            </p>
            <p className="section-paragraph">
              <strong>Responsables de Recepcionistas:</strong> Tony y Wassita.
            </p>
            <p className="section-paragraph">
              <strong>Responsables de Publicistas:</strong> Mika y Deby.
            </p>
          </div>

          <div className="document-footer text-center mt-5">
            <p className="text-muted">
              📚 El staff de Tertulia Literaria debe actuar de manera profesional y ejemplar, asegurando el buen funcionamiento del servidor y el bienestar de sus usuarios.
            </p>
            <p className="text-muted">
              Recuerda: <strong>Ser parte del staff implica responsabilidad y compromiso.</strong>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NormativaStaff;
