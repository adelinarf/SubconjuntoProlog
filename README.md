# Lenguaje Subconjunto de Prolog
Intéprete de un lenguaje que es subconjunto de Prolog
Se desea modelar un lenguaje subconjunto de Prolog que cuente con hechos, reglas y consultas.
## Llamadas

    DEF <expresion> [<expresion>]

Si es un hecho

    DEF padre(pedro,juan)

Si es una regla

    DEF abuelo(X, Y) padre(X, Z) padre(Z, Y)

Se pueden hacer consultas por medio de ASK:

    ASK abuelo(juan, X)

#### Nota: El programa no puede manejar las consultas, solo se pueden consultar los hechos ya establecidos, no puede verificar aún las reglas y hechos con variables.

Para salir se introduce:

    SALIR

## Corrida
Se requiere de Node.js para la corrida de este proyecto, por lo que se debe instalar Node.js por medio del sitio web: https://nodejs.org/en/. Junto a Node.js se instala npm que nos ayudará a instalar los demás paquetes necesarios para el proyecto. Se debe realizar la instalación de tsPEG con el comando:

        npm install -g tspeg
        
Instalar el paquete @types/node con el comando:

        npm install @types/node --save-dev
        
Se puede instalar Typescript con el siguiente comando:

        npm install -g typescript

Se corre el programa con los siguiente comandos:

        tspeg gramaticaLexer.peg parser.ts
        tspeg gramaticaInterprete.peg parser2.ts
        tsc -p tsconfig.json
        node subsetPROLOG.js
        
## Librería tspeg
Se utilizó para la creación de las gramáticas que ayudan a leer las expresiones del lenguaje.
