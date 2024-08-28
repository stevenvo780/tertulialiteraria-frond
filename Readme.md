# Tertulia Literaria - Proyecto Next.js

**Tertulia Literaria** es un grupo digital cultural cuyo propósito es fomentar el diálogo y el aprendizaje en áreas como la literatura, los debates, la filosofía, el arte y la ciencia, incluyendo la tecnología. Nuestro objetivo es crear un espacio inclusivo donde las ideas y el conocimiento puedan florecer a través de interacciones significativas y respetuosas.

## Descripción del Proyecto

Este proyecto es una plataforma web de código abierto construida con [Next.js](https://nextjs.org/), diseñada para apoyar la misión de Tertulia Literaria al proporcionar un espacio para la participación de la comunidad, el intercambio de contenidos y la organización de eventos. La plataforma actúa como un centro para el intercambio intelectual y cultural, dando la bienvenida a profesionales, maestros, estudiantes y cualquier persona interesada en ampliar sus horizontes.

### Características Principales

- **Gestión de Eventos**: Programar y gestionar eventos culturales e intelectuales como debates, lecturas y conferencias.
- **Publicación de Contenidos**: Publicar y compartir artículos, ensayos y discusiones en un formato de estilo blog.
- **Interacción Comunitaria**: Fomentar conversaciones significativas y colaboraciones dentro de un entorno seguro y respetuoso.
- **Código Abierto**: El proyecto está abierto para contribuciones de la comunidad con el fin de mejorar y ampliar su funcionalidad.

## Primeros Pasos

### Requisitos Previos

- Node.js 18.x
- npm >= 6.x o yarn >= 1.x
- Git
- Docker

### Instalación

1. Clona el repositorio:

    ```bash
    git clone https://github.com/stevenvo780/tertulialiteraria-frond.git
    cd tertulia-literaria
    ```

2. Instala las dependencias:

    ```bash
    npm install
    ```

    o

    ```bash
    yarn install
    ```

3. Crea un archivo `.env.local` en el directorio raíz y configura tus variables de entorno:

    ```bash
    NEXT_PUBLIC_API_URL=<Tu URL de la API>
    NEXT_PUBLIC_FIREBASE_API_KEY=<Tu clave API de Firebase>
    # Añade otras variables de entorno según sea necesario
    ```

4. Ejecuta el servidor de desarrollo:

    ```bash
    npm run dev
    ```

    o

    ```bash
    yarn dev
    ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

### Usando Docker

1. Construye la imagen de Docker:

    ```bash
    docker build -t tertulia-literaria .
    ```

2. Ejecuta el contenedor:

    ```bash
    docker run -p 3000:3000 tertulia-literaria
    ```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación corriendo en Docker.

### Construcción para Producción

Para crear una compilación optimizada para producción:

```bash
npm run build
```

o

```bash
yarn build
```

Luego, inicia el servidor:

```bash
npm start
```

o

```bash
yarn start
```

### Despliegue

Para el despliegue, puedes usar plataformas como [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/) o cualquier servicio de alojamiento que soporte aplicaciones Node.js. Asegúrate de configurar tus variables de entorno en la plataforma de alojamiento tal como lo hiciste en el archivo `.env.local`.

## Contribuciones

¡Damos la bienvenida a contribuciones de la comunidad! Si estás interesado en contribuir, por favor haz un fork del repositorio y crea un pull request con tus cambios. Antes de enviar un pull request, asegúrate de que tu código sigue nuestros estándares de codificación y pasa todas las pruebas.

1. Haz un fork del repositorio
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un nuevo Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Para preguntas, comentarios o contribuciones, no dudes en ponerte en contacto con el equipo de Tertulia Literaria.