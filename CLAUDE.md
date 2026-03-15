# CLAUDE.md — BosqueCR PWA

## Descripción del proyecto

**BosqueCR** es una Progressive Web App (PWA) para colecta de datos de campo orientada a la **determinación de bosque según el Artículo 3 de la Ley Forestal 7575 de Costa Rica**, siguiendo el **protocolo de Jorge Fallas (2019)**: *"Determinación de bosque acorde a la definición de Ley Forestal 7575 de Costa Rica. Manual de procedimientos."*

La app está diseñada para uso en **condiciones de campo reales**: mucha luz solar, dispositivo en estuche impermeable, operación con una sola mano. Se usa en teléfono móvil.

## Archivos del proyecto

La app consta de **4 archivos** que deben mantenerse sincronizados:

| Archivo | Función |
|---|---|
| `index.html` | App PWA completa — es la app real con toda la funcionalidad |
| `manifest.json` | Manifiesto PWA (nombre, colores, ícono, orientación) |
| `sw.js` | Service Worker para cache offline (versión actual: v2) |
| `preview_smartphone.html` | Visor de previsualización — muestra `index.html` embebido dentro de un marco de smartphone simulado (iPhone, Samsung, Pixel) para revisar la UI. Contiene una copia funcional simplificada de la app dentro de un iframe via `srcdoc`. |

## REGLA OBLIGATORIA

**Todo cambio solicitado se debe implementar en TODOS los archivos que componen la app (`index.html`, `manifest.json`, `sw.js`, `preview_smartphone.html`) donde sea pertinente.** Nunca permitir que código, elementos, características o funcionalidades queden resumidas, cortadas, truncadas, simplificadas o incompletas. **Solo modificar/editar lo requerido en cada cambio — no reescribir archivos completos si no es necesario.**

## Contexto del caso actual

La app viene pre-cargada con datos default del expediente **SETENA N° D1-0773-2024**, proyecto *"Condominio Residencial Comercial Turístico de FFPI Místico IV Playa Hermosa"* (Jacó, Garabito, Puntarenas), finca de ~202.18 ha.

### Datos default pre-cargados (NO eliminar):

- **Objetivo**: Determinación de terrenos forestales y verificación de cobertura forestal en atención a SETENA-DT-DEA-0782-2024 y SETENA-DT-DEA-0514-2025
- **Expediente**: D1-0773-2024
- **Permisiario**: Jardines Místico Doce S.A.
- **Cédula**: 3-102-059426 (STRATOS FIDUCIARIA LTDA, fiduciario)
- **Representante Legal**: Manuel Cisneros Guislain / Carlos Quesada Moncada
- **Matrícula**: 6-0019072-000
- **Plano**: P-0006568-1991
- **Área**: 202.18 ha
- **Ubicación**: Puntarenas, Garabito, Jacó, Playa Hermosa
- **CRTM05**: X=437828.066, Y=1058160.567
- **Profesional responsable**: Ing. Pablo César Sánchez Núñez, CIAGRO 5504, Tel 6126-71-23
- **Asist. Dasonomía**: Federico Berrocal Saborío
- **Asist. Registro**: Viviana Arias Quesada

## Estructura de la app (7 secciones)

Corresponden a las 7 actividades del protocolo Fallas:

### Sección 0: Datos Generales (`sec-0`)
- Datos Administrativos (objetivo, expediente, fecha, permisiario, cédula, representante legal, matrícula, plano, área)
- Profesional Responsable (nombre, CIAGRO, teléfono, correo)
- Personal de Campo (Asist. Dasonomía, Asist. Registro — solo nombre; botón para agregar Personal Adicional — solo nombre)
- Representación del Solicitante (botón para agregar representantes — con nombre, cédula, teléfono, anotación)

### Sección 1: Ubicación (`sec-1`)
- División Administrativa (provincia, cantón, distrito, caserío)
- Coordenadas (GPS WGS84 con captura nativa + campos CRTM05 manuales)
- Traslados: 3 segmentos según protocolo Fallas Anexo 1:
  1. Oficina → Finca (salida, llegada, transporte)
  2. Finca → Sitio (salida, llegada, transporte)
  3. Perímetro → Primera parcela (salida, llegada, transporte)

### Sección 2: Entorno (`sec-2`)
- Posición Topográfica — 6 clases (Cuadro 1, Fallas p.74)
- Antigüedad de Asentamientos — 6 categorías (Cuadro 2, Fallas p.74)
- Cobertura del Entorno — 13 tipos con checkbox (Cuadro 2, Fallas p.25)
- Observaciones del Entorno (textarea)
- Fotos del Entorno (captura fotográfica)

### Sección 3: Parcelas (`sec-3`)
Cada parcela contiene:
- Botón **⏱ INICIAR PARCELA** (captura hora actual, cambia a verde "INICIADA: HH:MM")
- Tipo parcela (Circular r=12.6m / Rectangular 20×25m)
- GPS de parcela (captura nativa)
- Ecosistema Nativo/Autóctono (Cuadro 3, Fallas p.76-77): 5 items "nativo" + 13 items "intervenido", cada uno con Sí/No
- Regeneración Natural (Cuadro 4, Fallas p.78): 10 items con Sí/No
- Árboles DAP ≥ 15 cm (Cuadro 5, Fallas p.78): tabla dinámica (Nº, DAP, Dosel 1-5, Especie)
- Renovales DAP 2–14.9 cm (Cuadro 6, Fallas p.79): tabla dinámica (Nº, DAP, Dosel 1-3, Especie)
- Cobertura de copas GLAMA (Cuadro 8, Fallas p.80): 5 puntos (Centro, NO, NE, SO, SE) + media calculada automáticamente
- Fotos de dosel + Fotos generales
- Observaciones de parcela
- Botón **⏱ FINALIZAR PARCELA** (captura hora actual, cambia a verde "FINALIZADA: HH:MM")
- Botón eliminar parcela

### Sección 4: Árboles Grandes (`sec-4`)
- Cuadro 7 (Fallas p.80): árboles DAP ≥ 40-50 cm fuera de parcelas pero dentro del polígono 2 ha
- Cada árbol: DAP, Dosel (4-5), Especie, GPS, Foto

### Sección 5: Síntesis (`sec-5`)
- 7 Variables Diagnósticas del Art. 3 Ley 7575 (cada una Sí/No):
  1. Ecosistema nativo o autóctono, intervenido o no
  2. Regenerado por sucesión natural u otras técnicas forestales
  3. Ocupa superficie de dos o más hectáreas
  4. Presencia de árboles maduros de diferentes edades, especies y porte variado
  5. Uno o más doseles
  6. Cobertura del dosel > 70% de la superficie
  7. Densidad ≥ 15 cm DAP > 60 árboles/ha
- Decisión final (Es bosque / No es bosque / Requiere más datos)
- Observaciones/Recomendaciones

### Sección 6: Exportar (`sec-6`)
- Descarga ZIP con: datos JSON, 4 CSVs (árboles, renovales, árboles grandes, cobertura copas), GeoJSON de puntos GPS, fotos organizadas por carpeta, dictamen resumen .txt
- Compartir (Web Share API)
- Guardar/Cargar/Borrar borrador (localStorage)

## Navegación (3 sistemas redundantes para uso en campo)

1. **Barra inferior fija** (bottom-nav): 7 iconos con etiquetas en la zona del pulgar, siempre visible
2. **Botones Anterior/Siguiente** (nav-arrow): al final de cada sección, botones grandes con nombre de destino
3. **Swipe horizontal**: deslizar izquierda/derecha cambia sección (umbral 80px)
4. **Step dots**: barra de progreso tocable en el top-bar

## Stack técnico

- HTML/CSS/JS puro (sin frameworks)
- Fuentes: DM Sans + Playfair Display (Google Fonts)
- JSZip v3.10.1 (CDN cloudflare)
- GPS: Navigator.geolocation API
- Fotos: File API con `capture="environment"`
- Almacenamiento: localStorage para borradores
- Offline: Service Worker con cache-first strategy
- PWA: manifest.json con display standalone

## Diseño para campo

- Inputs con `min-height: 48px`, `font-size: 16px`, `border: 2px`
- Botones con `min-height: 50px`, `border-radius: 12px`
- Toggles con `min-height: 42px`, alto contraste (verde/rojo para Sí/No)
- `font-size: 16px` en inputs para evitar zoom en iOS
- Colores de alta visibilidad: primario verde oscuro `#14321f`, acento dorado `#d4a017`
- Grids colapsan a 1 columna en ≤480px
- `overscroll-behavior-y: contain` para evitar pull-to-refresh
- `safe-area-inset-bottom` para la barra inferior en dispositivos con notch

## Fuentes documentales del protocolo

Los formularios de campo están basados textualmente en:
- **Fallas, Jorge. 2019.** Manual de procedimientos. Anexo 1: Formularios de campo (págs. 69-80)
- **Cuadros 1-8** del protocolo (posición topográfica, asentamientos, ecosistema, regeneración, árboles DAP≥15, renovales, árboles grandes, fobertura dosel)
- **Formulario de Informe** (Fallas 2019, documento complementario de 28 páginas)
- **Formulario KoboToolbox** (xlsx con sheets survey/choices/settings — campos administrativos y de árboles)

## Variables JavaScript principales

- `S` — objeto de estado global con: `general`, `ubicacion`, `entorno`, `parcelas[]`, `arbolesGrandes[]`, `personalAdicional[]`, `representantes[]`, `sintesis`
- `photoStore` — almacén de fotos base64 organizado por clave (entorno, dosel_N, parcela_N, ag_N)
- `currentSection` — índice de sección activa (0-6)
- Funciones clave: `goTo()`, `collect()`, `exportZIP()`, `saveDraft()`, `loadDraft()`, `renderParcela()`, `capTime()`, `captureGPS()`, `capParcelaGPS()`
