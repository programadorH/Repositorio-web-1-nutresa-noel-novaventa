# Módulo Comunidad y Valoraciones

## Documentación de Historias de Usuario (HU)

---

### **Estudiante:** Johann Felipe Hincapié Usuga
* **Módulo asignado:** Comunidad y Valoraciones (Célula 6).
* **Historia de Usuario 1:** Calificación de una receta con estrellas
* **Código de Rama:** `feature/comunidad/G6-COM-F01`

#### **Historia de usuario:**
**Como** usuario autenticado del recetario, **quiero** calificar una receta eligiendo de 1 a 5 estrellas, **para** expresar qué tan buena me pareció y ayudar a otros a decidir qué cocinar.

#### **Descripción del entregable:**
Desarrollar la sección visual y lógica en JavaScript imperativo (Vanilla JS) que permita calificar una receta con estrellas dentro de la interfaz "Valoraciones". La funcionalidad debe capturar la estrella seleccionada por el usuario, reflejarla visualmente y mostrar la puntuación elegida.

#### **Criterios de aceptación:**
1. **Representación del valor:** Cada una de las cinco estrellas porta su valor (1 a 5) en un atributo `data-valor`, que el código lee mediante `dataset` y convierte a número. El estado inicial es sin calificación (valor `0`).
2. **Manipulación del DOM imperativa:** La selección de elementos se realiza estrictamente con `document.querySelector` y `document.querySelectorAll`, y la interacción con `addEventListener('click', ...)`, sin librerías ni frameworks.
3. **Comportamiento de la selección:** Al hacer click en la estrella *n*, las estrellas de la 1 a la *n* se marcan en amarillo (`bi-star-fill`) y las restantes quedan vacías (`bi-star`). Un nuevo click en otra estrella reemplaza la selección y no la acumula.
4. **Visualización de la puntuación:** La puntuación elegida se muestra en pantalla con el formato "*n* de 5", actualizada mediante `textContent`.
5. **Estructura y maquetación:** Marcado semántico con cinco elementos `<button type="button">` dentro de un contenedor propio, con el ícono de Bootstrap Icons y un `aria-label` descriptivo en cada uno (por ejemplo, "Calificar con 4 estrellas").
6. **Estilos e integración modular:** `assets/css/sazon.css` se mantiene intacto. El color amarillo de la estrella marcada (`#F1C85C`, del kit de marca) y cualquier ajuste visual se definen en `modulos/comunidad/comunidad.css`, importado desde `modulos/comunidad/index.html`.
7. **Scripts clásicos y alcance del código:** La lógica vive en `modulos/comunidad/index.js`, cargado con `<script src>` sin `import`/`export`, y se encapsula en una función para no contaminar el ámbito global.

#### **Fuera de alcance (HU siguientes):**
Persistencia de la valoración (servicio asíncrono sobre mock), cálculo del promedio, comentarios y efecto hover.
