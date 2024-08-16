import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './NormativaPage.css'; // Archivo CSS para estilizar el documento

const NormativaPage: React.FC = () => {
  return (
    <Container className="normativa-container my-5">
      <Row>
        <Col>
          <div className="document-header text-center">
            <h1 className="display-4">⚖️ Reglas de Tertulia Literaria ⚖️</h1>
            <p className="lead">
              Este documento establece las normas generales y de convivencia que todos los usuarios deben seguir para asegurar un ambiente respetuoso y armonioso en Tertulia Literaria.
            </p>
          </div>

          <div className="document-section">
            <h2 className="section-title">Reglas Generales</h2>
            <p className="section-paragraph">
              <strong>1.</strong> El servidor se rige por los principios de Discord ToS: no se permite racismo, misoginia, misandria, acosos a la comunidad LGTB, ni material NSFW.
            </p>
            <p className="section-paragraph">
              <strong>2.</strong> Respeto a la Moderación en general, ya que son los encargados de cuidar, mantener y dirigir este espacio del cual disfrutamos todos. La Moderación se reserva el derecho de manejar la situación a su criterio según sea el caso.
            </p>
            <p className="section-paragraph">
              <strong>3.</strong> Debe pedirse permiso a la Moderación para promocionar concursos, invitaciones y publicación de contenido propio redirigido, especialmente si es con intención comercial.
            </p>
            <p className="section-paragraph">
              <strong>4.</strong> No defiendas afirmaciones sin evidencia sólida, tanto desde lo fáctico como desde lo argumentativo. Evita apelar a fuentes no académicas o poco serias.
            </p>
            <p className="section-paragraph">
              <strong>5.</strong> Está prohibido hacer propaganda del consumo de alucinógenos o cualquier tipo de drogas ilegales, sin importar si se disfraza con la idea de "rituales divinos" o un medio de "autoayuda".
            </p>
            <p className="section-paragraph">
              <strong>6.</strong> Las multicuentas están permitidas siempre que se informe a la moderación sobre ellas y no se usen para eludir baneos o mutes.
            </p>
            <p className="section-paragraph">
              <strong>7.</strong> La piratería no está permitida en el servidor, conforme a Discord ToS. Sin embargo, YOUTUBE y STREAM de Videojuegos están totalmente permitidos mientras no sea contenido adulto.
            </p>
          </div>

          <div className="document-section">
            <h2 className="section-title">Reglas de Convivencia</h2>
            <p className="section-paragraph">
              <strong>1.</strong> Molestar a otros usuarios de manera moderada es válido, pero el límite está donde el otro usuario lo disponga. Si alguien o un miembro del staff te pide que te detengas, debes hacerlo. De lo contrario, serás acreedor de un WARN.
            </p>
            <p className="section-paragraph">
              <strong>2.</strong> Cualquier acusación no fundamentada que se utilice solo para incriminar a otro será acreedora de un WARN.
            </p>
            <p className="section-paragraph">
              <strong>3.</strong> Con el fin de mantener un ambiente saludable y evitar la toxicidad, se prohíbe el uso reiterado de insultos y faltas de respeto sin contexto que justifique su uso.
            </p>
            <p className="section-paragraph">
              <strong>4.</strong> Evita el SPAM consecutivo de imágenes, gifs, emojis y comandos.
            </p>
            <p className="section-paragraph">
              <strong>5.</strong> Cualquier caso de acoso demostrado o doxeo resultará en un ban inmediato. No se permiten menciones o alusiones de Raideo ni bromas sobre golpes de estado.
            </p>
            <p className="section-paragraph">
              <strong>6.</strong> A partir del 18 de junio de 2024, Tertulia Literaria solo aceptará a mayores de 15 años.
            </p>
            <p className="section-paragraph">
              <strong>7.</strong> Prohibido grabar en VC o copiar/extraer material de Tertulia Literaria para fines ajenos al servidor sin permiso de la administración. Cualquier material que se saque sin permiso podría ser sancionado y, dependiendo de su gravedad, podría llevar a acciones legales.
            </p>
            <p className="section-paragraph">
              ⚠️ En TL respetamos el derecho de nuestros usuarios a su imagen y voz. La administración avisará de manera pública cuando se realice la grabación de un evento para su posterior difusión. (Esta regla está en vigencia a partir del 18 de mayo de 2024).
            </p>
          </div>

          <div className="document-section">
            <h2 className="section-title">Sistema de Warns</h2>
            <p className="section-paragraph">
              <strong>1.</strong> 🤐 El primer WARN resulta en un Mute de UNA HORA.
            </p>
            <p className="section-paragraph">
              <strong>2.</strong> 🤬 El segundo WARN resulta en un Mute de SEIS HORAS.
            </p>
            <p className="section-paragraph">
              <strong>3.</strong> 🙅‍♀️ El tercer WARN resulta en un BANEO DEL SERVIDOR.
            </p>
          </div>

          <div className="document-footer text-center mt-5">
            <p className="text-muted">
              📚 Tertulia Literaria se esmera en ser un espacio de convivencia armoniosa y tranquila entre los usuarios. Para garantizar este ambiente, es necesario que todos los usuarios respeten unas reglas básicas de interacción.
            </p>
            <p className="text-muted">
              Recuerda: <strong>Trata a los demás como te gustaría ser tratado.</strong>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NormativaPage;
