# Proyecto "Siglo XX Coleccionables" 1er pre-entrega

## Pasos para generar products mocks y users mocks

Una vez configuradas las variables de entorno, con el puerto (port) que se utilizara y la URI de la base de datos de mongo (mongoURI) donde se quiere generar los mocks, se debera utilizar una plataforma API, como Postman, para realizar las solicitudes.

### Generar Productos

#### generateMockProducts

```http
  POST http://localhost:<port>/api/mocks/products/:count
```

Resultado Esperado: Generar en la colección "products" de la base de datos de mongo, la cantidad de productos indicados.

### Generar Usuarios

#### generateMockUsers

```http
  POST http://localhost:<port>/api/mocks/users/:count
```

Resultado Esperado: Generar en la colección "users" de la base de datos de mongo, la cantidad de usuarios indicados.

### Aviso

En caso de ingresar letras, simbolos o numeros menores a 1 para indicar la cantidad, ocurrira un error avisando que la cantidad ingresada es invalida.

### Visualizar los productos y usuarios generados en las interfaces

Una vez generados los productos y/o usuarios por medio de las solicitudes, estos se podran visualizar en cards generadas en las intefaces.

#### Productos:

```http
http://localhost:<port>/home
```

#### Usuarios:

```http
http://localhost:<port>/profile
```

## FAQ

#### ¿Como se cual es mi puerto (port)?

Es el que ingresas en la variable de entorno "port" en el archivo .env que crees. Igualmente, al levantar el proyecto, en la terminal se te indicara con etiquetas INFO y HTTP el puerto en el que esta andando el servidor.