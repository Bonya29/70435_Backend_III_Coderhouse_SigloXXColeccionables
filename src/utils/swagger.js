import swaggerJSDoc from 'swagger-jsdoc'

const opts = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Siglo XX Coleccionables Documentación de Rutas",
            description: "Documentación de las APIs del proyecto."
        }
    },
    apis: ["./src/docs/*.yaml"] // Cambia la ruta según donde estén tus archivos de rutas con comentarios Swagger
}

export const swaggerSpecs = swaggerJSDoc(opts)