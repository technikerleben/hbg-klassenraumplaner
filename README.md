# Klassenraumplaner

Eine maßstäbliche 2D-Webapp zur Planung rechteckiger Klassenräume. Die Anwendung arbeitet ohne Benutzerkonto, speichert Projekte lokal im Browser und ist für Desktop und iPad ausgelegt.

## Funktionen

- Raummaße in Zentimetern festlegen
- Türen mit veränderbarem Anschlag und Schwenkbereich
- Fenster, Heizkörper, digitale Tafeln, Wandtafeln und Nassbereiche
- Möbelkatalog mit realistischen festen Maßen
- Drag-and-drop, Touchbedienung, Drehen, Sperren, Duplizieren und Löschen
- zwölf automatische Sitzordnungen für eine vorgegebene Schülerzahl
- Kollisionen, Türbereiche, Lernplätze, Heizkörperzonen, Tafelwinkel und Laufwege prüfen
- Varianten anlegen, kopieren und vergleichen
- automatisches lokales Speichern
- Projektdateien importieren und exportieren
- PNG-, JPG-, A4-/A3-PDF- und Druckausgabe
- PWA-Unterstützung für die Offline-Nutzung nach dem ersten Laden


## HBG Corporate Design

Diese Version nutzt das offizielle HBG-Farbsystem mit Rot `#791D22`, Blau `#245688` und Grün `#3F6B4D`. Gagalin wird für Titel und Glacial Indifference für Fließtext, Formulare und Planbeschriftungen verwendet. Beide Schriften sind datenschutzfreundlich direkt in das Stylesheet eingebettet und benötigen keine Verbindung zu einem externen Schriftendienst.

Da keine offizielle Logo-Bilddatei vorlag, nutzt der Kopfbereich einen deutlich erkennbaren HBG-Platzhalter. Für eine offizielle Veröffentlichung kann dieser später durch die unveränderte rechteckige Logo-Datei der Schule ersetzt werden. Druckansicht, PDF-Kopf, PWA-Symbol und Möbelpalette verwenden ebenfalls das HBG-Farbsystem.

## Lokal starten

Voraussetzung: Node.js 20 oder neuer.

```bash
npm install
npm run dev
```

Anschließend die von Vite angezeigte lokale Adresse öffnen.

## Produktions-Build

```bash
npm run build
npm run preview
```

Der fertige Build liegt im Ordner `dist`.

## Tests

```bash
npm test
```

Die Tests prüfen derzeit Geometrie, Kollisionen, Türschwenkbereiche, Lernplatzzählung und Sitzordnungsvorlagen.

## Deployment mit Vercel

1. Den Projektordner in ein GitHub-Repository übertragen.
2. Das Repository in Vercel importieren.
3. Vercel erkennt Vite automatisch. Alternativ sind Build-Befehl und Ausgabeordner bereits in `vercel.json` eingetragen.
4. Deployment starten.

Es werden keine Umgebungsvariablen und kein Backend benötigt.

## Projektstruktur

- `src/data` – Möbelkatalog
- `src/lib` – Geometrie, Analyse, Vorlagen, Speicherung und Projektmodell
- `src/store` – zentraler Zustand mit Undo/Redo
- `src/components` – Oberfläche und Canvas-Editor
- `src/test` – automatisierte Tests
- `docs/skill-klassenraum-designapp.md` – vollständige fachliche und technische Planung

## Hinweis zur Analyse

Die App ist eine geometrische Planungshilfe. Warnungen zu Wegen, Abständen und Barrierefreiheit ersetzen keine Brandschutzplanung, Gefährdungsbeurteilung, bauliche Prüfung oder fachliche Freigabe.
