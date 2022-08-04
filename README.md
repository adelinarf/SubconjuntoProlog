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
