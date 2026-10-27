// GET
const consultarApi = async () => {
    try {
        const respuesta = await fetch("6ada66727512f497b3ffeb23.mockapi.io/api/v1/fotos");
        if (!respuesta.ok) {
            throw new Error(`Error de red: ${respuesta.status}`);
        }
        const datosComentarios = await respuesta.json();
        console.log("Comentarios obtenidos del servidor", datosComentarios);
        return datosComentarios;
    } catch (error) {
        console.log("fallo en la peticion asincrona", error.message);
        return [];
    }
};

// POST (envía el comentario con la foto)
const enviarComentarioApi = async (comentario) => {
    try {
        const respuesta = await fetch("6ada66727512f497b3ffeb23.mockapi.io/api/v1/fotos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(comentario)
        });
        if (!respuesta.ok) {
            throw new Error(`Error de red: ${respuesta.status}`);
        }
        const comentarioGuardado = await respuesta.json();
        console.log("Comentario guardado en el servidor", comentarioGuardado);
        return comentarioGuardado;
    } catch (error) {
        console.log("fallo al enviar el comentario", error.message);
        return null;
    }
};