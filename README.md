# Nav Audio Studio

Прототип React-приложения для сценарного планирования YouTube-видео в формате timeline из сцен.

## Запуск

```bash
npm install
npm run dev
```

## Что реализовано в этом шаге

- Базовая модель Script/Scene с narration, graphics checklist, references, duration buffer и версионностью AI.
- Горизонтальная timeline-лента колонок-сцен.
- Drag-and-drop reordering (dnd-kit) с layout-анимациями.
- Segment stepper для ручного буфера длительности.
- Script drawer со статусами Backlog / In progress / Done.
- Recording mode (фокус на активной сцене и увеличенный narration текст).
