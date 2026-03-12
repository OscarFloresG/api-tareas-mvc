# Informe Técnico: API REST Gestión de Tareas

## 1. Estructura MVC Implementada
La aplicación se ha organizado siguiendo el patrón de arquitectura **Modelo-Vista-Controlador (MVC)** para garantizar la escalabilidad y el mantenimiento del código. En el contexto de esta API REST, la "Vista" se representa mediante las respuestas en formato JSON.

* **Modelo (`src/models/`):** Contiene la lógica de negocio y la estructura de los datos. Gestiona un arreglo en memoria y expone funciones que encapsulan la manipulación directa de los datos, protegiendo la integridad de la lista de tareas.
* **Controlador (`src/controllers/`):** Actúa como intermediario. Recibe las peticiones HTTP del router, procesa los datos de entrada (parámetros, consultas, cuerpo), solicita información al modelo y envía la respuesta adecuada al cliente.
* **Rutas (`src/routes/`):** Define los puntos de entrada (endpoints) de la API y vincula cada verbo HTTP con su función correspondiente en el controlador.



---

## 2. Diferencia entre PUT y PATCH
Se implementaron ambos métodos para entender las distintas formas de actualización de recursos:

* **PUT:** Se utiliza para una **sustitución completa**. El cliente envía el objeto completo para reemplazar el recurso existente. Si un campo no se incluye en la petición, los datos anteriores se pierden o se resetean.
* **PATCH:** Se utiliza para una **actualización parcial**. Es más eficiente cuando solo se desea modificar un atributo específico (como marcar una tarea como completada) sin necesidad de enviar el objeto entero.

---

## 3. Códigos de Estado HTTP Utilizados
Se utilizaron códigos estandarizados para asegurar que la comunicación entre el servidor y el cliente sea clara y profesional:

| Código | Nombre | Justificación de uso |
| :--- | :--- | :--- |
| **200** | OK | Para peticiones exitosas de obtención, actualización y eliminación. |
| **201** | Created | Exclusivo para el método **POST**, confirmando que la tarea fue creada con éxito. |
| **400** | Bad Request | Cuando el cliente envía datos inválidos (ej. falta el título o el ID no es numérico). |
| **404** | Not Found | Cuando se solicita un recurso o ID que no existe en el sistema. |
| **500** | Internal Server Error | Para capturar fallos inesperados y evitar que la aplicación colapse. |