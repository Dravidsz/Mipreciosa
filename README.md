# Mi Preciosa 🌺

Web de productividad minimalista con técnicas de gestión del tiempo y tareas.

## Características

### Pomodoro Timer
- Temporizador con modos: Trabajo, Descanso, Descanso Largo
- Seguimiento de pomodoros completados
- Sonido de notificación al completar
- Persistencia de configuración

### Lista de Tareas
- Agregar, completar y eliminar tareas
- Contador de tareas pendientes
- Limpiar tareas completadas
- Guardado automático en LocalStorage

### Matriz de Eisenhower
- 4 cuadrantes: Hacer, Programar, Delegar, Eliminar
- Arrastrar tareas entre cuadrantes
- Persistencia automática

### Kanban
- 3 columnas: Por Hacer, Progreso, Hecho
- Arrastrar tareas entre columnas
- Contador de tareas por columna

### Fondo Dinámico
- Imágenes locales que cambian cada 15 minutos
- Análisis de brillo para ajustar colores del texto
- Transiciones suaves

## Tecnologías

- HTML5, CSS3, JavaScript (Vanilla)
- LocalStorage para persistencia
- Canvas API para análisis de imágenes
- CSS Custom Properties para theming dinámico

## Cómo usar

1. Abre `index.html` en tu navegador
2. O serve con un servidor local:
   ```bash
   python3 -m http.server 3000
   ```
3. Visita `http://localhost:3000`

## Estructura

```
├── index.html      # Página principal
├── css/
│   └── styles.css  # Estilos
├── js/
│   ├── app.js         # Aplicación principal
│   ├── background.js  # Fondo dinámico
│   ├── pomodoro.js    # Timer Pomodoro
│   ├── todo.js        # Lista de tareas
│   ├── eisenhower.js  # Matriz Eisenhower
│   ├── kanban.js      # Tablero Kanban
│   └── storage.js     # Persistencia
└── img/           # Imágenes de fondo
```

## Licencia

MIT
