# Sistema de Rifas — ASECCSS Huetar Norte

Aplicación web para realizar sorteos de forma instantánea o progresiva, con exportación de resultados a PDF y Excel.

## Funcionalidades

- Carga de participantes y premios mediante archivos CSV
- Dos modos de sorteo: instantáneo y progresivo (ganador por ganador)
- Exportación de resultados en PDF y Excel con logo personalizado
- Validación de archivos CSV con mensajes de error descriptivos
- Botón "Nueva Rifa" para reiniciar sin recargar la página

## Formato CSV

**Participantes** — dos columnas: `cédula,nombre`

**Premios** — dos columnas: `id,descripción`

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
