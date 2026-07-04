# skill.md – Klassenraum-Designapp

## 1. Zweck dieser Skill-Datei

Diese Datei beschreibt vollständig die fachlichen, gestalterischen und technischen Anforderungen an eine browserbasierte Designapp zur Planung von Klassenräumen.

Sie dient als verbindliches Hintergrundwissen für ein LLM oder ein Entwicklerteam, das die Anwendung konzipiert, programmiert, testet oder später erweitert.

Die App soll keine allgemeine Innenarchitektur-Software werden. Sie ist speziell für Lehrkräfte, Schulleitungen, Gebäudeverantwortliche und pädagogische Planungsteams gedacht, die rechteckige Klassenräume schnell, maßstäblich und verständlich einrichten möchten.

Arbeitstitel:

**Klassenraumplaner**

Der Arbeitstitel kann später geändert werden.

---

## 2. Leitidee

Die App verbindet vier Aufgaben:

1. **Sitzordnungen schnell ausprobieren**
2. **Klassenräume maßstäblich planen**
3. **Laufwege, Türbereiche und ausgewählte Abstände prüfen**
4. **mehrere Raumvarianten speichern, vergleichen und exportieren**

Die Darstellung erfolgt als klare **2D-Draufsicht im Stil innenarchitektonischer Grundrissskizzen**.

Die Anwendung soll auch für Menschen verständlich sein, die wenig Erfahrung mit digitalen Planungstools haben. Komplexe Funktionen werden nicht versteckt, aber schrittweise angeboten.

Der zentrale Grundsatz lautet:

> Erst den Raum anlegen, dann feste Einbauten definieren, anschließend Möbel stellen und zum Schluss den Plan prüfen und exportieren.

---

## 3. Zielgruppe

Primäre Zielgruppe:

- Lehrkräfte
- Jahrgangs- und Klassenteams
- Schulleitungen
- pädagogische Raumplanungsgruppen
- schulische Gebäudeverantwortliche

Sekundäre Zielgruppe:

- Schulträger
- Innenarchitekt:innen
- Fachkräfte für Arbeitssicherheit
- Schüler:innen in Beteiligungsprozessen

Die Anwendung richtet sich nicht nur an Planungsprofis. Fachbegriffe müssen erklärt oder vermieden werden.

---

## 4. Produktcharakter

Die Anwendung ist eine:

- browserbasierte Webapp
- Single-Page-App
- für GitHub und Vercel geeignet
- vollständig ohne eigenes Backend nutzbar
- offline-fähige Progressive Web App nach dem ersten Laden
- lokal speichernde Anwendung ohne Benutzerkonto
- Anwendung für Desktop, Notebook und iPad

Smartphones werden unterstützt, aber nur eingeschränkt:

- Pläne ansehen
- Warnungen prüfen
- kleinere Positionsänderungen durchführen
- Projekte öffnen und exportieren

Das vollständige Anlegen und komfortable Bearbeiten eines Raumes ist für Desktop, Notebook und iPad optimiert.

---

## 5. Nicht-Ziele

Version 1 soll ausdrücklich nicht leisten:

- freie, polygonale oder L-förmige Raumgrundrisse
- mehrere miteinander verbundene Räume
- dreidimensionale Darstellung
- fotorealistische Visualisierung
- statische oder bauliche Berechnungen
- vollständige Brandschutzplanung
- automatische Genehmigung eines Raumplans
- Mehrbenutzer-Kollaboration in Echtzeit
- Cloud-Konten oder öffentliche Freigabelinks
- individuelle Konstruktion beliebiger Möbel
- freie Skalierung standardisierter Möbelstücke

Die App ist ein Planungshilfsmittel und ersetzt keine Gefährdungsbeurteilung, Brandschutzprüfung, Bauplanung oder fachliche Freigabe.

---

## 6. Grundlegender Arbeitsablauf

### Schritt 1: Neues Projekt

Beim Start kann der Nutzer:

- ein neues Projekt anlegen
- ein lokal gespeichertes Projekt öffnen
- eine Projektdatei importieren
- ein Beispielprojekt laden

Ein neues Projekt erhält:

- Projekttitel
- optionale Raumbezeichnung
- optionale Schule oder Gebäudeangabe
- optionale Notiz
- geplante Schülerzahl
- Option „Rollstuhlplatz berücksichtigen“

### Schritt 2: Raum anlegen

Der Nutzer gibt ein:

- Raumbreite
- Raumlänge

Eingabeformate:

- Meter und Zentimeter
- alternativ Dezimalmeter

Intern werden alle Werte in **Zentimetern** gespeichert.

Der Raum ist immer rechteckig.

Die App zeigt sofort:

- Gesamtfläche in Quadratmetern
- Raummaße an den Außenkanten
- Maßstab der aktuellen Ansicht
- Nordrichtung nur optional, nicht verpflichtend

### Schritt 3: Wände und feste Einbauten

Der Nutzer definiert:

- Türen
- Fenster
- Wandtafeln
- digitale Tafeln
- Heizkörper
- Nassbereiche
- Waschbecken
- Arbeitszeilen
- fest eingebaute Regale oder Schränke

Feste Einbauten können nach der Positionierung gesperrt werden.

### Schritt 4: Möbel platzieren

Möbel werden aus einer Bibliothek auf den Raum gezogen.

Mögliche Aktionen:

- platzieren
- verschieben
- drehen
- duplizieren
- löschen
- sperren
- gruppieren
- Gruppierung lösen
- ausrichten
- gleichmäßig verteilen
- in den Vorder- oder Hintergrund verschieben

### Schritt 5: Sitzordnung erzeugen

Der Nutzer kann eine fertige Sitzordnung auswählen.

Die App:

- berücksichtigt die gewünschte Schülerzahl
- berücksichtigt Tür, Fenster, Tafeln und feste Einbauten
- schlägt eine passende Anordnung vor
- zeigt vor dem Anwenden eine Vorschau
- meldet, wenn die Sitzordnung im Raum nicht sinnvoll untergebracht werden kann

Die automatisch erzeugte Anordnung bleibt anschließend vollständig bearbeitbar.

### Schritt 6: Plan prüfen

Die App prüft:

- Überschneidungen
- Möbel außerhalb des Raumes
- Türschwenkbereich
- freie Wege zur Tür
- Heizkörperbereiche
- Zahl der Lernplätze
- ausgewählte Blickbeziehungen zur Haupttafel
- optional die Erreichbarkeit eines Rollstuhlplatzes

### Schritt 7: Speichern, vergleichen und exportieren

Der Nutzer kann:

- automatisch im Browser speichern
- Varianten duplizieren
- Varianten benennen
- zwei bis vier Varianten vergleichen
- eine Projektdatei herunterladen
- eine Projektdatei wieder öffnen
- als PNG exportieren
- als PDF exportieren
- drucken
- eine Möbelliste erzeugen

---

## 7. Bedienoberfläche

### 7.1 Grundlayout

Die Desktopansicht besteht aus fünf Bereichen:

#### Kopfzeile

Enthält:

- Projektname
- Speichern-Status
- Rückgängig
- Wiederholen
- Zoom
- Raster
- Analyse ein/aus
- Export
- Hilfe

#### Linke Seitenleiste

Enthält die Objektbibliothek:

- Tische
- Sitzmöbel
- Aufbewahrung
- Präsentation
- flexible Lernmöbel
- feste Einbauten
- Nassbereich
- Dekoration und Sonstiges

Elemente können per Drag-and-drop auf die Zeichenfläche gezogen werden.

#### Zentrale Zeichenfläche

Enthält:

- Raumgrundriss
- Wände
- Raster
- Möbel
- Maßlinien
- Hilfslinien
- Auswahlrahmen
- Warnmarkierungen

#### Rechte Eigenschaftsleiste

Zeigt abhängig von der Auswahl:

- Objektname
- Maße
- Position
- Drehwinkel
- Wandzuordnung
- Türanschlag
- Sperrstatus
- Gruppenzugehörigkeit
- Platznummer oder Lernplatzzuordnung
- Hinweise und Warnungen

#### Untere Statusleiste

Zeigt:

- Schülerplätze vorhanden / benötigt
- Anzahl kritischer Warnungen
- Anzahl Empfehlungen
- aktuelle Auswahl
- Zoomstufe
- Status des Plans

Beispiel:

**30 von 30 Lernplätzen · 0 kritische Warnungen · 3 Hinweise**

---

## 8. Bedienmodi

Die App besitzt klar getrennte Modi.

### 8.1 Raummodus

Für:

- Raummaße
- Wände
- Türen
- Fenster
- Tafeln
- Heizkörper
- Nassbereiche
- feste Einbauten

### 8.2 Möbelmodus

Für:

- Möbel hinzufügen
- Möbel verschieben
- Möbel drehen
- gruppieren
- duplizieren
- ausrichten

### 8.3 Vorlagenmodus

Für:

- Sitzordnung auswählen
- Schülerzahl festlegen
- Vorschau anzeigen
- Vorlage anwenden

### 8.4 Analysemodus

Für:

- Warnungen
- Laufwege
- Türschwenkbereiche
- Tafel-Sichtbeziehungen
- Rollstuhlbewegungsfläche
- Flächenauswertung

### 8.5 Vergleichsmodus

Für:

- zwei bis vier Varianten nebeneinander
- gemeinsame Zoomstufe
- Kennzahlenvergleich
- Export einer Vergleichsübersicht

---

## 9. Maßeinheiten, Raster und Maßstab

### 9.1 Interne Einheit

Alle Maße werden intern als ganze Zentimeter gespeichert.

### 9.2 Raster

Standard:

- sichtbares Hauptraster: 10 cm
- Einrasten: 5 cm

Optionen:

- Raster ausblenden
- Einrasten deaktivieren
- Einrasten auf 1 cm, 5 cm oder 10 cm umstellen

### 9.3 Präzise Eingabe

Jedes ausgewählte Objekt kann zusätzlich über Zahlenfelder positioniert werden:

- Abstand von linker Raumkante
- Abstand von oberer Raumkante
- Breite
- Tiefe
- Drehwinkel

Standardmöbel dürfen in Version 1 nicht frei skaliert werden.

### 9.4 Drehung

Standard:

- Drehung in 15-Grad-Schritten
- Schnellschaltflächen für 0°, 90°, 180° und 270°
- freie Drehung nur nach Aktivierung einer Option

Wandgebundene Objekte richten sich automatisch an der Wand aus.

---

## 10. Raum und Wände

### 10.1 Rechteckiger Raum

Pflichtfelder:

- Breite
- Länge

Empfohlene Eingabegrenzen:

- mindestens 300 cm
- höchstens 3000 cm je Seite

Diese Grenzen dienen der Bedienbarkeit und sind keine baurechtlichen Vorgaben.

### 10.2 Wandbezeichnungen

Intern werden die Wände bezeichnet als:

- Nord
- Ost
- Süd
- West

Die sichtbare Oberfläche kann stattdessen anzeigen:

- oben
- rechts
- unten
- links

### 10.3 Wandobjekte

Es können beliebig viele Wandobjekte angelegt werden:

- Türen
- Fenster
- Heizkörper
- Wandtafeln
- digitale Tafeln
- Pinnwände
- Garderoben
- Waschbecken
- Arbeitszeilen

---

## 11. Türen

### 11.1 Eigenschaften

Eine Tür besitzt:

- Breite
- Position an einer Wand
- Türanschlag links oder rechts
- Öffnungswinkel
- Öffnungsrichtung immer in den Raum
- optionale Bezeichnung
- Sperrstatus

Standardbreite beim Einfügen:

- 100 cm

Die Breite ist veränderbar.

### 11.2 Darstellung

Die Tür wird wie in einem Grundriss dargestellt:

- Wandöffnung
- Türblatt
- Kreisbogen für den Schwenkbereich
- Anschlagpunkt

Der Türanschlag kann mit einer Schaltfläche gespiegelt werden.

### 11.3 Prüfung

Kritische Warnungen:

- Türblatt schneidet ein Möbel
- Schwenkbereich ist blockiert
- Tür liegt teilweise außerhalb der Wand
- zwei Türen überschneiden sich

Die App darf nicht behaupten, die Türbreite sei normgerecht. Sie zeigt lediglich den eingegebenen Wert.

---

## 12. Fenster und Heizkörper

### 12.1 Fenster

Eigenschaften:

- Breite
- Position an der Wand
- optionale Bezeichnung
- Heizkörper darunter: ja oder nein

Die Brüstungshöhe oder Brüstungstiefe wird nicht erfasst.

### 12.2 Heizkörper

Ein Heizkörper kann:

- automatisch unter einem Fenster erzeugt werden
- unabhängig als eigenes Wandobjekt platziert werden

Eigenschaften:

- Breite
- Tiefe in den Raum
- Position
- empfohlene Freizone
- Warnung aktiv oder deaktiviert

Standardmäßige Freizone der App:

- 20 cm vor dem Heizkörper

Diese Freizone ist eine konfigurierbare Planungshilfe und keine allgemeingültige gesetzliche Vorgabe.

Warnung:

- Möbel steht im Heizkörper oder in dessen eingestellter Freizone

---

## 13. Tafeln und Präsentationsflächen

### 13.1 Digitale Tafel

Eigenschaften:

- Breite
- Position an der Wand
- Haupttafel: ja oder nein
- Sichtbereich anzeigen: ja oder nein

Standardbreite:

- 200 cm

### 13.2 Wandtafel

Eigenschaften:

- Breite
- Position an der Wand
- Typ:
  - einfache Wandtafel
  - Klapptafel
  - Whiteboard
  - Pinnwand

### 13.3 Hauptpräsentationsrichtung

Eine digitale Tafel oder Wandtafel kann als Haupttafel markiert werden.

Diese Markierung dient:

- Sitzrichtungsprüfung
- Sichtwinkelanzeige
- automatischer Ausrichtung von Sitzordnungen
- Festlegung der Raumfront

Es kann jeweils nur eine Haupttafel aktiv sein. Weitere Präsentationsflächen bleiben möglich.

---

## 14. Nassbereich

Der Nassbereich wird in Version 1 in drei Formen angeboten.

### 14.1 Waschbecken

Voreinstellung:

- 60 × 55 cm

Eigenschaften:

- Wandposition
- Breite
- Tiefe
- Bewegungsfläche anzeigen
- sperrbar

### 14.2 Arbeitszeile mit Waschbecken

Voreinstellung:

- 120 × 60 cm

Alternativen:

- 180 × 60 cm
- 240 × 60 cm

Die Arbeitszeile ist ein fester Einbau.

### 14.3 Freie Nasszone

Eine rechteckige Fläche kann eingezeichnet werden.

Sie dient zum Markieren von:

- Fliesenbereich
- Spritzwasserbereich
- Experimentierbereich
- Reinigungszone

Die freie Nasszone zählt nicht automatisch als Hindernis. Der Nutzer kann festlegen:

- Möbel dürfen darin stehen
- nur dafür geeignete Möbel dürfen darin stehen
- Zone muss vollständig frei bleiben

Nassbereiche werden standardmäßig nach dem Platzieren gesperrt.

---

## 15. Möbelkatalog

Alle Maße sind feste Startwerte der App. Sie sind als praxisnahe Planungsvorgaben zu verstehen, nicht als Aussage, dass alle Schulen exakt diese Möbel besitzen.

### 15.1 Schülertische

| Objekt | Breite | Tiefe | Lernplätze |
|---|---:|---:|---:|
| Doppeltisch, Standard | 130 cm | 50 cm | 2 |
| Doppeltisch, tief | 130 cm | 55 cm | 2 |
| Doppeltisch, groß | 130 cm | 65 cm | 2 |
| Einzeltisch, Standard | 70 cm | 50 cm | 1 |
| Einzeltisch, tief | 70 cm | 55 cm | 1 |
| Einzeltisch, groß | 70 cm | 65 cm | 1 |
| Trapeztisch | 140 cm | 70 cm | 2 |
| quadratischer Gruppentisch | 140 cm | 140 cm | 4 |
| runder Gruppentisch | 120 cm Durchmesser | – | 4 |
| Stehtisch | 120 cm | 60 cm | 2 |

Der Standard beim Einfügen ist:

**Doppeltisch 130 × 50 cm mit zwei zugeordneten Stühlen**

Die recherchierten Schülertischgrößen 70 cm für Einsitzer und 130 cm für Zweisitzer sowie Tiefen von 50 cm und 55 cm kommen bei Schulmöbelherstellern regelmäßig vor. Größere 65-cm-Tiefen werden als zusätzliche Variante angeboten.

### 15.2 Lehrkraft und Präsentation

| Objekt | Breite | Tiefe |
|---|---:|---:|
| Lehrertisch | 140 cm | 70 cm |
| kleines Lehrerpult | 80 cm | 60 cm |
| Medienpult | 80 cm | 60 cm |
| Präsentationstisch | 120 cm | 60 cm |
| mobile Tafel | 120 cm | 60 cm Stellfläche |
| Pinnwand mobil | 120 cm | 50 cm Stellfläche |

### 15.3 Sitzmöbel

| Objekt | Breite | Tiefe |
|---|---:|---:|
| Schülerstuhl | 45 cm | 50 cm |
| Drehstuhl | 60 cm | 60 cm |
| Hocker | 35 cm Durchmesser | – |
| Sitzbank | 120 cm | 40 cm |
| kleine Sitzbank | 80 cm | 40 cm |
| Sitzsack | 80 cm | 80 cm |
| Bodenkissen | 50 cm | 50 cm |

### 15.4 Aufbewahrung

| Objekt | Breite | Tiefe |
|---|---:|---:|
| niedriges Regal | 100 cm | 40 cm |
| hohes Regal | 100 cm | 45 cm |
| niedriger Schrank | 100 cm | 45 cm |
| hoher Schrank | 100 cm | 50 cm |
| Materialwagen | 80 cm | 50 cm |
| Ladestation | 80 cm | 50 cm |
| Garderobe | 100 cm | 40 cm |
| Druckerstation | 80 cm | 60 cm |

### 15.5 Flexible Lernmöbel

| Objekt | Breite | Tiefe |
|---|---:|---:|
| Raumteiler | 120 cm | 40 cm |
| Lerninsel | 160 cm | 80 cm |
| Akustiksofa, 2-sitzig | 140 cm | 75 cm |
| Teppich klein | 200 cm | 200 cm |
| Teppich groß | 300 cm | 200 cm |
| Präsentationsfläche | frei wählbar | frei wählbar |

### 15.6 Sonstige Objekte

- Pflanze klein
- Pflanze groß
- Mülleimer
- Papierkorb
- Erste-Hilfe-Punkt als Symbol
- Feuerlöscher als Symbol
- Rollstuhlplatz-Markierung
- freie Textnotiz
- Maßlinie
- farbige Zone

Dekorative Objekte werden bei der Laufweganalyse nur berücksichtigt, wenn sie als Hindernis markiert sind.

---

## 16. Tische, Stühle und Lernplätze

### 16.1 Automatische Stühle

Beim Einfügen eines Schülertisches werden passende Stühle automatisch mit angelegt.

- Einzeltisch: ein Stuhl
- Doppeltisch: zwei Stühle
- Gruppentisch: entsprechend der vorgesehenen Plätze

### 16.2 Gruppierung

Tisch und Stühle bilden zunächst eine Gruppe.

Der Nutzer kann:

- die Gruppe gemeinsam verschieben
- die Gruppe gemeinsam drehen
- die Gruppierung lösen
- einzelne Stühle entfernen
- Stühle neu zuordnen

### 16.3 Zählung eines Lernplatzes

Ein Lernplatz zählt nur, wenn:

- ein Stuhl vorhanden ist
- der Stuhl einem Tisch oder Lernmöbel zugeordnet ist
- der Stuhl nicht außerhalb des Raumes steht
- Stuhl und Tisch nicht kritisch mit anderen Objekten kollidieren

Ein Sitzplatz ohne Tisch kann als Lernplatz zählen, wenn er ausdrücklich als Sitzkreisplatz oder Präsentationsplatz markiert wurde.

### 16.4 Schülerzahl

Im Projekt wird eine Zielzahl festgelegt.

Die App zeigt:

- benötigte Plätze
- vorhandene Plätze
- gültige Plätze
- Sitzplätze ohne Tisch
- überzählige Plätze

---

## 17. Fertige Sitzordnungen

Alle Vorlagen berücksichtigen die eingestellte Schülerzahl.

### 17.1 Vorlagen in Version 1

1. klassische Reihen
2. versetzte Reihen
3. Prüfungsordnung mit Einzeltischen
4. Partnerreihen
5. Vierergruppen
6. Sechsergruppen
7. U-Form
8. Doppel-U
9. Halbkreis zur Haupttafel
10. Sitzkreis ohne Tische
11. Fischgräten-Anordnung
12. Lernlandschaft
13. Präsentation mit freier Mitte
14. Gruppenarbeit mit Randzonen
15. individuelle Arbeitsplätze am Rand und Gruppen in der Mitte

### 17.2 Automatische Erzeugung

Die App berechnet:

- Anzahl benötigter Tische
- Anzahl der Reihen oder Gruppen
- gleichmäßige Abstände
- Ausrichtung zur Haupttafel
- Startposition hinter der Präsentationszone

### 17.3 Vorschau

Vor dem Anwenden wird angezeigt:

- Miniaturansicht
- benötigte Fläche
- Zahl der Lernplätze
- mögliche Konflikte
- voraussichtliche Warnungen

### 17.4 Verhalten bei Platzmangel

Wenn eine Anordnung nicht passt:

- wird sie nicht stillschweigend verzerrt
- Möbel werden nicht verkleinert
- die App zeigt die problematische Richtung
- sie schlägt Alternativen vor

Beispiel:

> Für 30 Plätze ist die Prüfungsordnung mit Einzeltischen in diesem Raum nicht ohne Überschneidungen möglich. Versuche versetzte Reihen oder reduziere die Mindestabstände der Vorlage manuell.

---

## 18. Ausrichten und Verteilen

Mehrere ausgewählte Objekte können:

- links ausgerichtet werden
- rechts ausgerichtet werden
- oben ausgerichtet werden
- unten ausgerichtet werden
- horizontal zentriert werden
- vertikal zentriert werden
- horizontal gleichmäßig verteilt werden
- vertikal gleichmäßig verteilt werden
- an der Haupttafel ausgerichtet werden
- in ein regelmäßiges Raster gebracht werden

Zusätzlich:

- Duplizieren als Reihe
- Duplizieren als Spalte
- Duplizieren als Gruppe
- Anzahl und Abstand vor dem Erzeugen festlegen

---

## 19. Auswahl und Bearbeitung

### 19.1 Einzelauswahl

Klick oder Tippen wählt ein Objekt aus.

### 19.2 Mehrfachauswahl

Möglichkeiten:

- Umschalttaste plus Klick
- Auswahlrahmen
- auf dem iPad Schaltfläche „Mehrfachauswahl“

### 19.3 Kontextmenü

Enthält:

- duplizieren
- löschen
- sperren
- entsperren
- gruppieren
- Gruppierung lösen
- nach vorne
- nach hinten
- exakt positionieren

### 19.4 Tastaturkürzel

- Entf: löschen
- Strg/Cmd + Z: rückgängig
- Strg/Cmd + Umschalt + Z: wiederholen
- Strg/Cmd + D: duplizieren
- Strg/Cmd + G: gruppieren
- Pfeiltasten: 1 cm bewegen
- Umschalt + Pfeiltasten: 10 cm bewegen
- R: um 90 Grad drehen
- L: sperren oder entsperren

---

## 20. Warnsystem

Das Warnsystem hat drei Stufen.

### 20.1 Rot – kritisch

Beispiele:

- Möbel überschneiden sich
- Möbel steht außerhalb des Raumes
- Türblatt kollidiert mit einem Objekt
- Türschwenkbereich ist blockiert
- keine Tür ist vorhanden
- ein Lernplatz liegt außerhalb des Raumes
- ein festes Objekt überschneidet ein anderes festes Objekt

Rote Warnungen verhindern nicht das Speichern oder Exportieren.

### 20.2 Orange – sicherheitsrelevant oder funktional problematisch

Beispiele:

- kein durchgehender Weg mit der eingestellten Mindestbreite zur Tür
- Heizkörperbereich ist verstellt
- Hauptzugang zu einer Schranktür ist blockiert
- Rollstuhlplatz ist nicht erreichbar
- Bewegungsfläche vor einem aktiv geprüften Waschbecken ist blockiert
- mehrere Lernplätze sind nur über sehr enge Zwischenräume erreichbar

### 20.3 Blau – pädagogischer oder planerischer Hinweis

Beispiele:

- ungünstiger Blickwinkel zur Haupttafel
- Stuhl zeigt deutlich von der Haupttafel weg
- sehr ungleichmäßige Entfernungen zur Haupttafel
- zu wenige Lernplätze
- deutlich mehr Lernplätze als benötigt
- keine freie Präsentationsfläche
- Sitzgruppe erschwert die direkte Sicht auf die Tafel
- Lehrertisch steht weit vom Hauptpräsentationsbereich entfernt

### 20.4 Planstatus

Mögliche Statusanzeigen:

- **Kritische Probleme vorhanden**
- **Plan mit Empfehlungen**
- **Plan ohne erkannte kritische Warnungen**

Die Formulierung „Plan ohne erkannte kritische Warnungen“ darf niemals durch „sicher“, „normgerecht“ oder „genehmigt“ ersetzt werden.

---

## 21. Kollisionsprüfung

Jedes Objekt besitzt eine geometrische Grundform:

- Rechteck
- Kreis
- Polygon

Die Kollisionsprüfung berücksichtigt:

- Drehung
- tatsächliche Objektgrenzen
- Gruppen
- festgelegte Freizonen

Zonen können unterschiedlich behandelt werden:

- harte Kollision
- Warnbereich
- nur visuelle Markierung
- ohne Prüfung

Kollisionen werden live beim Verschieben angezeigt.

Darstellung:

- rote Kontur
- halbtransparente rote Schnittfläche
- kurze Erklärung im Eigenschaftenbereich

---

## 22. Laufwegprüfung

### 22.1 Grundlage

Die App verwendet standardmäßig eine empfohlene freie Längsgangbreite von:

**100 cm**

Dieser Wert wird als Planungshilfe verwendet, weil die Unfallkasse NRW für Unterrichtsräume einen nutzbaren Längsgang von mindestens 1 m empfiehlt.

### 22.2 Einstellbarkeit

Der Nutzer kann die Prüfdistanz ändern:

- 80 cm
- 90 cm
- 100 cm
- 120 cm
- eigener Wert

Bei Werten unter 100 cm zeigt die App einen Hinweis, dass die Standardempfehlung unterschritten wird.

### 22.3 Technisches Prüfverfahren

Für die Analyse wird ein internes Navigationsraster verwendet.

Empfehlung:

- Zellgröße: 10 cm
- Hindernisse werden um die halbe gewünschte Wegbreite erweitert
- die Türschwelle bildet das Ziel
- für jeden Lernplatz wird ein erreichbarer Startpunkt hinter oder neben dem Stuhl gesucht
- ein Pfadsuchalgorithmus prüft die Verbindung zur Tür

Geeignet ist A* oder Breadth-First Search.

### 22.4 Ergebnisdarstellung

- grüne Linie: gefundener Weg
- orange Linie: nur mit geringerer Breite möglicher Weg
- rote Markierung: kein plausibler Weg gefunden
- Heatmap optional

Die App muss erklären, dass die digitale Wegprüfung eine geometrische Näherung ist.

---

## 23. Türschwenkbereich

Der Türschwenkbereich wird als Kreissektor berechnet.

Prüfung gegen:

- Tische
- Stühle
- Schränke
- Regale
- bewegliche Tafeln
- Heizkörper
- andere Türen

Für Objekte, die sich nur kurzfristig im Schwenkbereich befinden könnten, bleibt die Warnung dennoch bestehen.

---

## 24. Tafel- und Blickprüfung

### 24.1 Ziel

Die Prüfung soll Lehrkräften sichtbar machen, welche Plätze ungünstig zur Haupttafel ausgerichtet sind.

### 24.2 Daten

Jeder Stuhl besitzt:

- Position
- Drehwinkel
- Blickrichtung

Die Haupttafel besitzt:

- Mittelpunkt
- Breite
- Wandrichtung

### 24.3 Bewertung

Die App verwendet heuristische Kategorien:

- gute Ausrichtung
- seitliche Ausrichtung
- ungünstige Ausrichtung
- Blick von der Tafel weg

Die Schwellenwerte müssen in einer zentralen Konfigurationsdatei liegen und dürfen später geändert werden.

Vorschlag für Version 1:

- bis 30° Abweichung: gut
- 31° bis 60°: seitlich
- über 60°: ungünstig
- über 120°: Blick überwiegend von der Tafel weg

Diese Werte sind pädagogische Heuristiken und keine Normwerte.

### 24.4 Sichtlinien

Optional können Sichtlinien eingeblendet werden.

Hohe Schränke und hohe Regale können Sichtlinien blockieren. Tische und Stühle blockieren sie nicht.

---

## 25. Rollstuhlplatz und Barrierefreiheit

### 25.1 Optionale Aktivierung

Beim Projekt kann aktiviert werden:

**Rollstuhlplatz berücksichtigen**

### 25.2 Funktionen

Die App fügt hinzu oder prüft:

- markierten Rollstuhlplatz
- erreichbaren Weg zur Tür
- Bewegungsfläche
- Zugang zum Tisch
- optionalen Zugang zum Waschbecken
- Türbreite als angezeigten Messwert

### 25.3 Bewegungsfläche

Standard:

- 150 × 150 cm für eine Wendefläche

Alternative:

- 120 × 150 cm für eine gerichtete Bewegungsfläche ohne Wenden

Diese Werte dienen als Planungshilfe in Anlehnung an gängige Angaben zur DIN 18040-1.

### 25.4 Wichtiger Hinweis

Die App prüft keine vollständige Barrierefreiheit. Sie unterstützt nur die räumliche Vorplanung ausgewählter Bewegungsflächen.

---

## 26. Bereiche und Zonen

Der Nutzer kann farbige Zonen einzeichnen:

- Präsentation
- Einzelarbeit
- Gruppenarbeit
- Rückzug
- Material
- Verkehr
- Nassbereich
- Lehrkraft
- freie Fläche

Zonen besitzen:

- Namen
- Farbe
- Transparenz
- Prüfverhalten
- Sperrstatus

Eine Zone kann festlegen:

- Möbel erlaubt
- nur bestimmte Möbel erlaubt
- muss freibleiben
- bei Belegung nur Hinweis anzeigen

---

## 27. Variantenverwaltung

Ein Projekt kann mehrere Varianten enthalten.

Beispiele:

- Klassenunterricht
- Gruppenarbeit
- Prüfung
- Elternabend
- Projektarbeit

Funktionen:

- Variante duplizieren
- Variante umbenennen
- Notiz ergänzen
- Favorit markieren
- Kennzahlen anzeigen
- Variante löschen
- Variante aus einer Sitzordnung neu erzeugen

Vergleichskennzahlen:

- Lernplätze
- freie Fläche
- Zahl kritischer Warnungen
- Zahl weiterer Hinweise
- durchschnittliche Tafeldistanz
- längste Tafeldistanz
- Zahl erreichbarer Lernplätze
- Zahl der Möbelstücke

---

## 28. Speichern

### 28.1 Automatisches Speichern

Die App speichert lokal:

- nach jeder abgeschlossenen Aktion
- zusätzlich in regelmäßigen Abständen
- vor dem Schließen der Seite, soweit technisch möglich

Anzeige:

- gespeichert
- wird gespeichert
- nicht gespeichert
- Speicherfehler

### 28.2 Lokale Datenbank

Projekte werden in IndexedDB gespeichert.

Es ist kein Benutzerkonto erforderlich.

### 28.3 Projektdatei

Dateiendung:

**.klassenraum.json**

Die Datei enthält:

- Schema-Version
- Projektdaten
- Varianten
- Raummaße
- Objekte
- Einstellungen
- Warnkonfiguration
- Metadaten

Beim Import wird die Datei validiert.

Fehlerhafte oder ältere Dateien werden nicht ungeprüft geladen.

---

## 29. Export

### 29.1 PNG

Optionen:

- aktuelle Ansicht
- vollständiger Raum
- mit oder ohne Raster
- mit oder ohne Maße
- mit oder ohne Warnungen
- transparente oder weiße Außenfläche

### 29.2 PDF

Formate:

- A4 Hochformat
- A4 Querformat
- A3 Hochformat
- A3 Querformat

Skalierung:

- automatisch auf Seite
- Maßstab 1:50
- Maßstab 1:100
- benutzerdefiniert

Inhalt:

- Projekttitel
- Variantenname
- Raumplan
- Raummaße
- Legende
- Schülerzahl
- Möbelliste
- Notiz
- optional Warnübersicht

Standardmäßig wird eine **saubere Planansicht ohne Warnflächen** exportiert.

Optional:

- Warnungen einblenden
- Laufwege einblenden
- Prüfbericht als zweite Seite ergänzen

### 29.3 Druckansicht

Die Druckansicht vermeidet:

- Bedienleisten
- Auswahlrahmen
- Hover-Effekte
- unnötige Hintergründe

### 29.4 Möbelliste

Die Liste enthält:

- Möbeltyp
- Anzahl
- Einzelmaß
- Gesamtzahl der Lernplätze
- gesperrt oder beweglich

---

## 30. Vergleichsexport

Zwei bis vier Varianten können auf einer PDF-Seite oder als mehrseitiges PDF ausgegeben werden.

Zusätzlich wird eine kleine Tabelle erzeugt:

| Variante | Lernplätze | kritische Warnungen | Hinweise | freie Fläche |
|---|---:|---:|---:|---:|

Die freie Fläche ist eine grobe geometrische Kennzahl und darf nicht als tatsächlich nutzbare Bewegungsfläche bezeichnet werden.

---

## 31. Visuelle Gestaltung

### 31.1 Stil

Die App soll wirken wie eine Mischung aus:

- moderner Innenarchitektur-Skizze
- verständlichem Schulwerkzeug
- ruhiger professioneller Planungssoftware

Keine verspielte Kinderoptik.

### 31.2 HBG-Corporate-Design

Die App verwendet das offizielle Corporate Design der Heinrich-Böll-Gesamtschule Dortmund. Das interne Schieferblau-/Rostorange-/Salbeigrün-System wird nicht mit diesem Auftritt gemischt.

Leitfarben:

- HBG-Rot: `#791D22`
- HBG-Blau: `#245688`
- HBG-Grün: `#3F6B4D`
- dunkles Blau: `#163A5C`
- heller Seitenhintergrund: `#F7F5F2`
- Karten und Planfläche: `#FFFFFF`
- Fließtext: `#2B2B2B`
- dezente Rahmen: `#D9D5CF`

Semantische Farben:

- Fehler und kritische Kollisionen: `#A62B2B`
- Warnungen: `#B8791E`
- Erfolg und bestätigte Zustände: `#2E6E6E`

Nutzung:

- Rot führt Haupttitel, zentrale Aktionen, Auswahlrahmen und Markenakzente.
- Blau strukturiert Navigation, Raumkonturen, technische Funktionen und Informationsebenen.
- Grün ergänzt Möbelkategorien und positive Bereiche, bleibt aber gegenüber Rot und Blau nachrangig.
- Semantikfarben werden ausschließlich für Fehler, Warnungen und Bestätigungen verwendet.

### 31.3 Typografie

- `Gagalin` für App-Titel, Bereichsüberschriften und prägnante Aussagen
- `Glacial Indifference` für Fließtext, Formulare, Beschriftungen und Canvas-Texte
- Fallbacks: `Anton`/`Archivo Black` für Titel sowie `Jost`/`Mulish`/Arial für Fließtext
- Die Schriftarten werden für die Webapp lokal und datenschutzfreundlich eingebunden.
- Im Kopfbereich wird bis zur Bereitstellung einer offiziellen Logo-Datei ein klar gekennzeichneter HBG-Platzhalter verwendet.

### 31.4 Grundrissdarstellung

- heller Hintergrund
- dunkle Außenwände
- dünne Innenlinien
- dezente Schatten nur bei schwebenden UI-Elementen
- Möbel als vereinfachte Draufsicht
- eindeutige Vorderseite bei Stühlen
- sichtbare Tischkanten
- reduzierte Materialtexturen
- keine fotorealistischen Oberflächen

### 31.5 Symbole

Alle Symbole benötigen:

- Tooltip
- Textbezeichnung
- ausreichende Touchgröße
- erkennbare aktive Zustände

---

## 32. Barrierearme Bedienung der App

Die Anwendung soll erfüllen:

- vollständige Tastaturbedienung der wesentlichen Funktionen
- sichtbare Fokusrahmen
- ausreichende Kontraste
- keine Information nur über Farbe
- Textalternative zu Warnsymbolen
- vergrößerbare Oberfläche
- Touchziele von mindestens etwa 44 × 44 Pixel
- reduzierte Animation bei entsprechender Systemeinstellung
- deutschsprachige, klare Fehlermeldungen

Drag-and-drop darf niemals die einzige Möglichkeit sein. Jedes Objekt kann auch über „Hinzufügen“ und Zahlenfelder positioniert werden.

---

## 33. Hilfesystem

Die Hilfe besteht aus:

- kurzem Startassistenten
- Tooltips
- kontextbezogenen Hinweisen
- Hilfe-Seiten
- Beispielprojekten
- Tastaturübersicht

Der Startassistent umfasst höchstens fünf Schritte:

1. Raumgröße eingeben
2. Tür und Fenster setzen
3. Haupttafel markieren
4. Möbel oder Vorlage wählen
5. Plan prüfen und exportieren

Er kann übersprungen und später erneut gestartet werden.

---

## 34. Technische Architektur

### 34.1 Empfohlener Stack

- React
- TypeScript
- Vite
- React Konva / Konva für die Zeichenfläche
- Zustand für den Anwendungszustand
- Dexie für IndexedDB
- Zod für Schema- und Importvalidierung
- clientseitige PDF-Erzeugung
- Vitest für Unit-Tests
- Playwright für End-to-End-Tests
- Vite-PWA-Plugin für Offlinefähigkeit

### 34.2 Begründung

React Konva eignet sich für:

- Canvas-Darstellung
- Drag-and-drop
- Auswahl
- Transformation
- Ebenen
- Export

Zustand eignet sich für:

- zentralen Projektzustand
- Undo/Redo
- Auswahlzustand
- Varianten
- Werkzeugmodi

Dexie vereinfacht:

- lokale Speicherung
- Versionsmigration
- Projektlisten
- Autosave

### 34.3 Kein Backend

Version 1 benötigt kein Backend.

Vorteile:

- keine Anmeldung
- keine personenbezogenen Daten auf einem Server
- einfache Bereitstellung über Vercel
- offline nutzbar
- geringe Betriebskosten

---

## 35. Datenmodell

### 35.1 Projekt

```ts
type Project = {
  id: string;
  schemaVersion: number;
  title: string;
  roomLabel?: string;
  school?: string;
  note?: string;
  targetStudentCount: number;
  wheelchairMode: boolean;
  createdAt: string;
  updatedAt: string;
  activeVariantId: string;
  variants: RoomVariant[];
  settings: ProjectSettings;
};
```

### 35.2 Variante

```ts
type RoomVariant = {
  id: string;
  name: string;
  note?: string;
  room: RoomGeometry;
  objects: PlannerObject[];
  zones: PlannerZone[];
  mainBoardId?: string;
  analysisSettings: AnalysisSettings;
};
```

### 35.3 Raum

```ts
type RoomGeometry = {
  widthCm: number;
  lengthCm: number;
};
```

### 35.4 Planungsobjekt

```ts
type PlannerObject = {
  id: string;
  catalogId: string;
  type: ObjectType;
  name: string;
  xCm: number;
  yCm: number;
  widthCm: number;
  depthCm: number;
  rotationDeg: number;
  locked: boolean;
  wall?: "north" | "east" | "south" | "west";
  groupId?: string;
  parentId?: string;
  collisionMode: "solid" | "warning" | "ignore";
  properties: Record<string, unknown>;
};
```

### 35.5 Sitzplatz

Stühle besitzen zusätzlich:

```ts
type SeatProperties = {
  assignedFurnitureId?: string;
  countsAsLearningPlace: boolean;
  facingDeg: number;
  wheelchairPlace?: boolean;
};
```

### 35.6 Tür

```ts
type DoorProperties = {
  widthCm: number;
  hinge: "left" | "right";
  opensInward: true;
  openingAngleDeg: number;
};
```

---

## 36. Zustandsverwaltung und Undo/Redo

Jede Nutzeraktion wird als nachvollziehbarer Befehl behandelt.

Beispiele:

- Objekt hinzufügen
- Objekt verschieben
- Objekt drehen
- Gruppe erzeugen
- Vorlage anwenden
- Raumgröße ändern

Undo/Redo soll mindestens 100 Schritte speichern.

Drag-Bewegungen werden nicht für jeden Pixel als einzelner Schritt gespeichert. Erst das Loslassen erzeugt einen Verlaufsschritt.

---

## 37. Ebenen

Empfohlene Zeichenebenen:

1. Hintergrund
2. Raster
3. Raum und Wände
4. Wandobjekte
5. Zonen
6. Möbel
7. Sitzplätze
8. Maßlinien
9. Warnungen
10. Auswahl und Transformationsgriffe
11. Tooltips

Warnungen dürfen die Auswahl von Möbeln nicht blockieren.

---

## 38. Performance

Ziel:

- flüssige Bedienung mit mindestens 150 Planungsobjekten
- direkte Reaktion beim Ziehen
- Warnungsberechnung während des Ziehens vereinfacht
- vollständige Analyse nach dem Loslassen
- keine vollständige Neuberechnung bei unveränderten Objekten

Optimierungen:

- Ebenencaching
- geometrische Vorauswahl über Bounding Boxes
- räumlicher Index
- Analyse im Web Worker, falls nötig
- gedrosselte Live-Prüfung

---

## 39. Automatische Anordnungslogik

Vorlagen werden nicht als starre Pixelbilder gespeichert.

Jede Vorlage besitzt:

- benötigten Möbeltyp
- Gruppengröße
- Ausrichtung
- Randabstände
- Reihen- oder Gruppenabstand
- Zielrichtung
- Strategie bei ungerader Schülerzahl

Beispiel Vierergruppen:

1. benötigte Zahl der Doppeltische berechnen
2. jeweils zwei Doppeltische zu einer Gruppe kombinieren
3. Gruppen in Zeilen und Spalten verteilen
4. Ausrichtung zur Haupttafel berücksichtigen
5. verbleibende Einzelplätze ergänzen
6. Kollisionen prüfen
7. alternative Gruppierung versuchen

Die automatische Anordnung soll deterministisch sein: Gleiche Eingaben erzeugen zunächst den gleichen Vorschlag.

---

## 40. Prüfregeln als konfigurierbare Regeln

Alle Prüfungen müssen in einer zentralen Regelsammlung liegen.

Beispiel:

```ts
type PlannerRule = {
  id: string;
  label: string;
  severity: "critical" | "warning" | "info";
  enabledByDefault: boolean;
  configurable: boolean;
  sourceType: "official-guidance" | "heuristic" | "user-setting";
};
```

Jede Meldung zeigt:

- was erkannt wurde
- wo das Problem liegt
- welche Regel verwendet wurde
- ob es sich um Empfehlung oder Heuristik handelt
- wie der Nutzer die Warnung beheben kann

---

## 41. Datenschutz

Die App verarbeitet grundsätzlich keine Namen einzelner Schüler:innen.

Nicht vorgesehen:

- Sitzpläne mit personenbezogenen Namen
- Leistungsdaten
- Förderinformationen
- Cloud-Synchronisierung

Soll später eine Namensfunktion ergänzt werden, muss sie standardmäßig deaktiviert und rein lokal bleiben.

---

## 42. Fehlermeldungen

Fehlermeldungen müssen konkret sein.

Schlecht:

> Ungültige Eingabe.

Gut:

> Die Raumbreite muss zwischen 300 cm und 3000 cm liegen.

Schlecht:

> Export fehlgeschlagen.

Gut:

> Die PDF konnte nicht erstellt werden. Der Plan bleibt gespeichert. Versuche den Export ohne Warnungsebene erneut.

---

## 43. Qualitätssicherung

### 43.1 Unit-Tests

Mindestens für:

- Umrechnung der Maße
- Drehung von Rechtecken
- Kollisionen
- Türschwenkbereich
- Lernplatzzählung
- Vorlagenberechnung
- Projektmigration
- Importvalidierung
- Laufwegraster

### 43.2 End-to-End-Tests

Mindestens:

1. neues Projekt anlegen
2. Raummaße eingeben
3. Tür mit Anschlag setzen
4. Fenster mit Heizkörper setzen
5. 30 Plätze als Reihen erzeugen
6. Möbel verschieben
7. Warnung auslösen
8. Warnung beheben
9. Variante duplizieren
10. Projekt exportieren und wieder importieren
11. PNG erzeugen
12. PDF erzeugen

### 43.3 Geräteprüfung

Testen auf:

- aktueller Chrome-Desktop
- aktueller Edge-Desktop
- aktueller Safari auf iPad
- Firefox-Desktop
- Smartphone-Browser für Ansicht und Basisbearbeitung

---

## 44. Umsetzung in Etappen

### Etappe 1 – Grundeditor

- Projektstart
- rechteckiger Raum
- Raster
- Türen
- Fenster
- Tafeln
- Möbelbibliothek
- Drag-and-drop
- Drehen
- Gruppieren
- Undo/Redo
- Autosave
- JSON-Import und -Export

### Etappe 2 – Sitzordnungen und Analyse

- Schülerzahl
- Lernplatzzählung
- automatische Sitzordnungen
- Kollisionen
- Türschwenkbereich
- Laufwegprüfung
- Heizkörperwarnung
- Tafelheuristik
- Rollstuhloption

### Etappe 3 – Varianten und Ausgabe

- Variantenverwaltung
- Vergleichsansicht
- PNG
- PDF
- Möbelliste
- Prüfbericht
- Druckansicht

### Etappe 4 – Feinschliff

- PWA
- iPad-Optimierung
- Hilfesystem
- Beispielräume
- Performanceoptimierung
- erweiterte Tastaturbedienung

---

## 45. Abnahmekriterien für Version 1

Version 1 gilt als funktional abgeschlossen, wenn:

1. ein rechteckiger Raum maßstäblich angelegt werden kann
2. mehrere Türen und Fenster platziert werden können
3. Türen nach innen öffnen und der Anschlag geändert werden kann
4. Fenster optional einen Heizkörper erhalten
5. Nassbereiche und Waschbecken platziert werden können
6. der Doppeltisch 130 × 50 cm Standard ist
7. Tische automatisch passende Stühle erhalten
8. mindestens 15 Möbeltypen verfügbar sind
9. Möbel per Maus und Touch verschoben werden können
10. Möbel exakt per Zahleneingabe positioniert werden können
11. Möbel gedreht, dupliziert und gruppiert werden können
12. mindestens zehn Sitzordnungen automatisch erzeugt werden können
13. die Schülerzahl mit den gültigen Lernplätzen verglichen wird
14. Kollisionen erkannt werden
15. Türschwenkbereiche geprüft werden
16. ein konfigurierbarer Weg zur Tür geprüft wird
17. Heizkörperwarnungen funktionieren
18. die Haupttafel markiert und Sitzrichtungen ausgewertet werden können
19. ein optionaler Rollstuhlplatz geprüft werden kann
20. mehrere Varianten gespeichert werden können
21. Projekte lokal automatisch gespeichert werden
22. Projekte als Datei exportiert und wieder importiert werden können
23. PNG- und PDF-Export funktionieren
24. eine Möbelliste erzeugt wird
25. die App auf Desktop und iPad sinnvoll bedienbar ist
26. kein Benutzerkonto erforderlich ist
27. die App klar darauf hinweist, dass sie keine fachliche Sicherheitsprüfung ersetzt

---

## 46. Recherchierte fachliche Grundlage

### Schülertische

Als realistische Startgrößen werden verwendet:

- Einsitzer: 70 × 50 cm oder 70 × 55 cm
- Zweisitzer: 130 × 50 cm oder 130 × 55 cm
- zusätzliche größere Tiefe: 65 cm

Diese Größen werden in Sortimenten deutscher Schulmöbelanbieter angeboten.

Die DIN EN 1729-1 beschreibt Funktionsmaße und Kennzeichnungen für Stühle, Hocker und Tische in Bildungseinrichtungen. Die deutsche Ausgabe DIN EN 1729-1:2016-02 ist weiterhin als aktuelle Norm geführt; zusätzlich existiert ein Entwurf von 2025. Die DIN EN 1729-2:2023-07 behandelt sicherheitstechnische Anforderungen und Prüfverfahren.

### Verkehrswege

Die Unfallkasse NRW weist für Unterrichtsräume darauf hin, dass Verkehrs- und Fluchtwege freizuhalten sind und ein nutzbarer Längsgang mindestens 1 m breit sein sollte.

Die App nutzt 100 cm deshalb als voreingestellte Empfehlung. Der Wert bleibt veränderbar und wird nicht als vollständige Brandschutzprüfung dargestellt.

### Barrierefreiheit

Für das Wenden eines Rollstuhls wird in Planungshilfen zur DIN 18040-1 regelmäßig eine Bewegungsfläche von 150 × 150 cm angegeben. Die App verwendet diese Größe optional als sichtbare und prüfbare Planungsfläche.

---

## 47. Quellen für die weitere Entwicklung

- DIN Media: DIN EN 1729-1 – Möbel, Stühle und Tische für Bildungseinrichtungen, Funktionsmaße
- DIN Media: DIN EN 1729-2 – Sicherheitstechnische Anforderungen und Prüfverfahren
- Unfallkasse NRW / Sichere Schule: Verkehrs- und Fluchtwege im Unterrichtsraum
- Unfallkasse NRW / Sichere Schule: Türen in Unterrichtsräumen
- Unfallkasse NRW / Sichere Schule: Möblierung und flexible Raumnutzung
- Widmann: Schülertische mit Breiten von 70 cm und 130 cm sowie Tiefen von 50 cm und 55 cm
- Widmann: größere Schülertischvarianten mit 65 cm Tiefe
- Planungshilfen zur DIN 18040-1: Bewegungsflächen für Rollstuhlnutzung
- offizielle Dokumentation von Konva und React Konva
- offizielle Dokumentation von Dexie
- offizielle Dokumentation von Zustand
- offizielle Dokumentation des Vite-PWA-Plugins

---

## 48. Grundsatz für spätere Erweiterungen

Neue Funktionen müssen den Kern der App erhalten:

- maßstäblich
- verständlich
- lokal nutzbar
- ohne unnötige Komplexität
- transparent bei Empfehlungen
- klar getrennt zwischen Geometrie, Heuristik und verbindlicher Fachprüfung

Die App soll Lehrkräften nicht vorschreiben, wie ein guter Klassenraum aussehen muss. Sie soll Varianten sichtbar machen, Risiken markieren und begründete Entscheidungen erleichtern.
