---
name: hbg-corporate-design
description: "Offizielles Corporate Design (CD) und Corporate Identity (CI) der Heinrich-Böll-Gesamtschule Dortmund für ALLE nach außen gerichteten Digital- und Printmedien: Flyer, Broschüren, Plakate, Social-Media-Posts (Instagram/Facebook), Präsentationsvorlagen, Jahrbuch, Homepage-Inhalte, Pressetexte und Elternbriefe. Verwende diesen Skill IMMER, wenn Materialien im offiziellen Schul-Corporate-Design erstellt werden sollen – auch ohne explizite Nennung von 'Corporate Design', z. B. bei 'Flyer für die Schule', 'Instagram-Post für die HBG', 'Plakat für Schulfest', 'offizielle Präsentation', 'Elternbrief', 'Pressemitteilung' oder 'Post für den Instagram-Kanal der Schule'. Farbleitsystem: Rot und Blau als Primär-/Sekundärfarbe (offiziell), Grün als feste Tertiärfarbe (Erweiterung dieses Skills). WICHTIG: Dieser Skill ist NICHT identisch mit hbg-srl-colors (Schieferblau/Rostorange/Salbeigrün) – jener gilt nur für interne SRL-Unterrichtsmaterialien. Bei Unsicherheit, ob offizielles Schul-CD oder SRL-Farbschema gemeint ist, nachfragen oder aus dem Kontext ableiten (nach außen gerichtet/offiziell → dieser Skill; Unterricht/SRL-Projekt → hbg-srl-colors)."
---

# HBG Corporate Design (Rot/Blau/Grün) – Offizielle Schulidentität

Dieser Skill kapselt das verbindliche Corporate Design & die Corporate Identity der Heinrich-Böll-Gesamtschule Dortmund (Stand: Konzept Team Öffentlichkeitsarbeit, 25.11.2024). Er gilt für **alle Produkte, die nach außen wirken oder das offizielle Schulbild transportieren**.

**Abgrenzung:** Für interne SRL-Projektmaterialien (Unterrichts-HTML, Arbeitsblätter, Tafelboard, "Kurs ins Unbekannte" etc.) gilt stattdessen der Skill `hbg-srl-colors` mit dem Schieferblau/Rostorange/Salbeigrün-Schema. Die beiden Systeme **nicht mischen**.

---

## 1. Grundprinzip

Ziel ist ein klares, einheitliches, professionelles Erscheinungsbild, das die Werte des Leitbildes ("Für dich. Für mich. Für uns.") transportiert und die HBG von anderen Schulen abgrenzbar macht. Betroffene Produkte: Schulhomepage, Social Media (Facebook: *Heinrich-Böll-Gesamtschule Dortmund*, Instagram: *hbg_dortmund*), Flyer & Broschüren, Plakate, Jahrbuch, Videos, Präsentationen.

Zielgruppen, die bei Tonalität und Inhalt mitgedacht werden sollten: aktuelle/zukünftige/ehemalige Schüler\*innen, Erziehungsberechtigte, Kooperationspartner\*innen, Kolleg\*innen, Politik/Verwaltung, Presse, Menschen vor Ort in Lütgendortmund.

---

## 2. Logo

**Regeln:**
- Logo nie in Form oder Farbe verändern; ausreichend Abstand zu anderen Elementen einhalten.
- Rechteckiges Logo ist Standard (Version mit ausgeschriebenem Schulnamen "HEINRICH-BÖLL-GESAMTSCHULE").
- **Farbpriorität bei Logoauswahl:** 1. Rot (Standardversion) → 2. Schwarz → 3. Blau → 4. Weiß (nur auf dunklem/grauem Hintergrund).
- **Mit oder ohne Motto?** Motto "FÜR DICH. FÜR MICH. FÜR UNS." im Logo verwenden, *außer* das Motto steht bereits an anderer Stelle im Produkt – dann reicht das Logo ohne Motto.
- Immer die Logoversion wählen, die die **beste Sichtbarkeit/Kontrast** zum Hintergrund garantiert.
- Quadratisches Logo "mit Ecken" (oben) ist **letzte Wahl**, nur wenn Platzverhältnisse ein rechteckiges Logo ausschließen.
- Andere Logovarianten (z. B. weitere Farben) müssen beim Team Öffentlichkeitsarbeit angefragt werden – im generierten Artefakt ggf. als Platzhalter/Hinweis kennzeichnen, wenn die konkrete Logodatei nicht vorliegt.

**Für generierte Artefakte:** Wenn keine Logo-Bilddatei vorliegt, im HTML/DOCX/PPTX eine klar markierte Logo-Platzhalterfläche ("HEINRICH-BÖLL-GESAMTSCHULE" in Blockschrift, ggf. mit Motto-Zeile) in Rot oder Schwarz vorsehen und den Nutzer darauf hinweisen, dass die echte Logodatei eingesetzt werden sollte.

---

## 3. Schriftarten

| Schrift | Verwendung |
|---|---|
| **Gagalin** | Haupttitel, Überschriften, prägnante Aussagen (Blockschrift-Charakter, offizielle Titelschrift) |
| **Glacial Indifference** | Fließtext, Detailinformationen – klar, serifenlos, leserfreundlich |

Beide Schriften liegen im Kollegium nicht standardmäßig auf jedem Gerät vor. Für Web-Artefakte (HTML/CSS) daher immer mit sinnvollem Fallback-Stack arbeiten:

```css
--font-title: 'Gagalin', 'Anton', 'Archivo Black', sans-serif;
--font-body:  'Glacial Indifference', 'Jost', 'Mulish', 'Helvetica Neue', Arial, sans-serif;
```

Für PPTX/DOCX: Wenn die Schriftarten lokal nicht installiert sind, **Gagalin durch eine kräftige, kondensierte Grotesk** (z. B. Anton, Archivo Black) und **Glacial Indifference durch eine klare humanistische Sans** (z. B. Jost, Mulish) ersetzen und dies kurz erwähnen.

---

## 4. Farbschema

Die Hauptfarben leiten sich von den Fenster-/Türelementen des Schulgebäudes ab; Grün wurde als feste dritte Leitfarbe ergänzt (Herleitung: Baumbestand auf dem Schulgelände, vgl. Titelbild des CD-Dokuments):

| Farbe | Hex | RGB |
|---|---|---|
| **Rot** (Primärfarbe, offiziell) | `#791D22` | R121 G29 B34 |
| **Blau** (Sekundärfarbe, offiziell) | `#245688` | R36 G86 B136 |
| **Grün** (Tertiärfarbe, Erweiterung) | `#3F6B4D` | R63 G107 B77 |

Rot und Blau stammen aus dem offiziellen CD-Dokument und bleiben **unverändert die Leitfarben** für Logo, Markenauftritt und Primärstruktur. Grün ist als **feste dritte Farbe** Teil dieses Skills – gleichwertig einsetzbar für Struktur, Diagramme, Kategorien und Naturbezug, aber **nachrangig zu Rot/Blau**: Logo und Haupttitel bleiben immer Rot (siehe Abschnitt 2). Die folgenden Abstufungen sind eine konsistente Erweiterung aus allen drei Grundfarben (keine beliebigen Fremdfarben) und schließen die im offiziellen Dokument fehlende Ebene für Hintergründe, Hover-Zustände, Warnungen etc.

### Erweiterte Farbfamilien (Dark/Base/Mid/Pale/Ghost)

**Rot-Familie**

| Token | Hex | Verwendung |
|---|---|---|
| `--hbg-rot-dunkel` | `#571015` | Aktive/gedrückte Zustände, Text auf hellem Grund |
| `--hbg-rot` (Base) | `#791D22` | Primärfarbe, Standard-Logo, CTA-Flächen |
| `--hbg-rot-mittel` | `#B14C52` | Dekorative Linien, sekundäre Akzente – **kein** Fließtext |
| `--hbg-rot-blass` | `#E8C9CB` | Hintergrundtönung, Info-/Aufgabenboxen |
| `--hbg-rot-ghost` | `#F8EEEE` | Sehr helle Flächen, Social-Media-Hintergrund |

**Blau-Familie**

| Token | Hex | Verwendung |
|---|---|---|
| `--hbg-blau-dunkel` | `#163A5C` | Aktive Zustände, kräftige Header |
| `--hbg-blau` (Base) | `#245688` | Sekundärfarbe, Navigation, Struktur |
| `--hbg-blau-mittel` | `#6C93B8` | Icons, Borders – **kein** Fließtext |
| `--hbg-blau-blass` | `#CBDBE9` | Hintergrundtönung |
| `--hbg-blau-ghost` | `#EFF4F9` | Sehr helle Flächen |

**Grün-Familie** (Tertiärfarbe, feste Ergänzung dieses Skills)

| Token | Hex | Verwendung |
|---|---|---|
| `--hbg-gruen-dunkel` | `#2F4A38` | Aktive Zustände, kräftige Flächen |
| `--hbg-gruen` (Base) | `#3F6B4D` | Dritte Leitfarbe, Diagramme, Kategorien, Naturbezug |
| `--hbg-gruen-mittel` | `#7C9C82` | Icons, Borders – **kein** Fließtext |
| `--hbg-gruen-blass` | `#D6E3D2` | Hintergrundtönung |
| `--hbg-gruen-ghost` | `#EFF5EE` | Sehr helle Flächen |

> ⚠️ **Abgrenzung zu internen Farbschemata:** Dieses Grün ist bewusst deutlich dunkler, kühler und entsättigter gewählt als andere an der Schule verwendete grüne Projektfarben (z. B. helles, warmes Sage-/Salbeigrün in projektspezifischen Farbschemata wie `hbg-srl-colors`). Bei Materialien, die *ausschließlich* für ein bestimmtes internes Projekt entstehen, gilt weiterhin dessen eigenes Farbschema statt dieses Grüns.

### Neutralsystem (bewusst kein reines Schwarz/Weiß im Fließtext)

| Token | Rolle | Hex |
|---|---|---|
| `--hbg-text` | Fließtext (Anthrazit statt reinem Schwarz) | `#2B2B2B` |
| `--hbg-text-muted` | Meta-Text, Bildunterschriften, Trennlinien | `#6B6B6B` |
| `--hbg-border` | Rahmen, dezente Trennlinien | `#D9D5CF` |
| `--hbg-bg` | Seitenhintergrund (Off-White) | `#F7F5F2` |
| `--hbg-weiss` | Karten, Logo-Hintergrund, Text auf Rot/Blau | `#FFFFFF` |
| `--hbg-schwarz` | Nur für Standard-Logo (schwarze Variante) | `#000000` |
| `--hbg-grau-dunkel` | Dunkler Hintergrund für weißes Logo | `#4D4D4D` |

### Semantische Farben (Warnung/Fehler/Erfolg)

Bewusst **nicht** identisch mit Marken-Rot gewählt, damit "Fehler" nicht mit dem HBG-Rot verwechselt wird:

| Token | Rolle | Hex |
|---|---|---|
| `--hbg-warnung` | Hinweis, Vorsicht | `#B8791E` (gedecktes Ocker) |
| `--hbg-fehler` | Fehler, kritischer Hinweis | `#A62B2B` |
| `--hbg-erfolg` | Erfolg, Bestätigung | `#2E6E6E` (gedecktes Petrol/Blaugrün) |

> **Hinweis Erfolgsfarbe:** `#2E6E6E` wurde bewusst *blaugrün/petrol* statt klassisch grün gewählt, um Verwechslungen mit anderen an der Schule verwendeten grünen Akzentfarben in projektspezifischen Farbschemata zu vermeiden.

### Optionaler vierter Akzent (situativ, nicht fest)

| Token | Rolle | Hex | Herleitung |
|---|---|---|---|
| `--hbg-sandstein` | Zusätzlicher Akzent für Diagramme/Badges mit warmem, gebäudebezogenem Charakter, wenn Rot/Blau/Grün allein nicht ausreichen (z. B. vierte Kategorie in einer Grafik) | `#C9A876` | Klinker-/Natursteintöne der Schulfassade |

Im Unterschied zu Rot, Blau und Grün ist Sandstein **kein fester Bestandteil des Leitsystems**, sondern ein situativer Zusatzakzent für Einzelfälle. Erste Wahl für einen dritten/vierten Farbakzent ist immer Grün; Sandstein nur ergänzend, wenn ein zusätzlicher, klar unterscheidbarer Ton benötigt wird.

### CSS Custom Properties (vollständig)

```css
:root {
  /* Rot-Familie */
  --hbg-rot-dunkel: #571015;
  --hbg-rot:        #791D22;
  --hbg-rot-mittel: #B14C52;
  --hbg-rot-blass:  #E8C9CB;
  --hbg-rot-ghost:  #F8EEEE;

  /* Blau-Familie */
  --hbg-blau-dunkel: #163A5C;
  --hbg-blau:        #245688;
  --hbg-blau-mittel: #6C93B8;
  --hbg-blau-blass:  #CBDBE9;
  --hbg-blau-ghost:  #EFF4F9;

  /* Grün-Familie (feste Tertiärfarbe) */
  --hbg-gruen-dunkel: #2F4A38;
  --hbg-gruen:        #3F6B4D;
  --hbg-gruen-mittel: #7C9C82;
  --hbg-gruen-blass:  #D6E3D2;
  --hbg-gruen-ghost:  #EFF5EE;

  /* Neutral */
  --hbg-text:        #2B2B2B;
  --hbg-text-muted:  #6B6B6B;
  --hbg-border:      #D9D5CF;
  --hbg-bg:          #F7F5F2;
  --hbg-weiss:       #FFFFFF;
  --hbg-schwarz:     #000000;
  --hbg-grau-dunkel: #4D4D4D;

  /* Semantisch */
  --hbg-warnung: #B8791E;
  --hbg-fehler:  #A62B2B;
  --hbg-erfolg:  #2E6E6E;

  /* Optionaler dritter Akzent */
  --hbg-sandstein: #C9A876;
}
```

### pptxgenjs (Hex ohne `#`)

```javascript
const HBG = {
  ROT_DUNKEL:  '571015',
  ROT:         '791D22',
  ROT_MITTEL:  'B14C52',
  ROT_BLASS:   'E8C9CB',
  ROT_GHOST:   'F8EEEE',

  BLAU_DUNKEL: '163A5C',
  BLAU:        '245688',
  BLAU_MITTEL: '6C93B8',
  BLAU_BLASS:  'CBDBE9',
  BLAU_GHOST:  'EFF4F9',

  GRUEN_DUNKEL: '2F4A38',
  GRUEN:        '3F6B4D',
  GRUEN_MITTEL: '7C9C82',
  GRUEN_BLASS:  'D6E3D2',
  GRUEN_GHOST:  'EFF5EE',

  TEXT:        '2B2B2B',
  TEXT_MUTED:  '6B6B6B',
  BORDER:      'D9D5CF',
  BG:          'F7F5F2',
  WEISS:       'FFFFFF',
  SCHWARZ:     '000000',
  GRAU_DUNKEL: '4D4D4D',

  WARNUNG:     'B8791E',
  FEHLER:      'A62B2B',
  ERFOLG:      '2E6E6E',

  SANDSTEIN:   'C9A876', // optionaler vierter Akzent (situativ, nicht fest)
};
```

### python-docx

```python
from docx.shared import RGBColor

# Rot-Familie
HBG_ROT_DUNKEL = RGBColor(0x57, 0x10, 0x15)
HBG_ROT        = RGBColor(0x79, 0x1D, 0x22)
HBG_ROT_MITTEL = RGBColor(0xB1, 0x4C, 0x52)
HBG_ROT_BLASS  = RGBColor(0xE8, 0xC9, 0xCB)
HBG_ROT_GHOST  = RGBColor(0xF8, 0xEE, 0xEE)

# Blau-Familie
HBG_BLAU_DUNKEL = RGBColor(0x16, 0x3A, 0x5C)
HBG_BLAU        = RGBColor(0x24, 0x56, 0x88)
HBG_BLAU_MITTEL = RGBColor(0x6C, 0x93, 0xB8)
HBG_BLAU_BLASS  = RGBColor(0xCB, 0xDB, 0xE9)
HBG_BLAU_GHOST  = RGBColor(0xEF, 0xF4, 0xF9)

# Grün-Familie (feste Tertiärfarbe)
HBG_GRUEN_DUNKEL = RGBColor(0x2F, 0x4A, 0x38)
HBG_GRUEN        = RGBColor(0x3F, 0x6B, 0x4D)
HBG_GRUEN_MITTEL = RGBColor(0x7C, 0x9C, 0x82)
HBG_GRUEN_BLASS  = RGBColor(0xD6, 0xE3, 0xD2)
HBG_GRUEN_GHOST  = RGBColor(0xEF, 0xF5, 0xEE)

# Neutral
HBG_TEXT        = RGBColor(0x2B, 0x2B, 0x2B)
HBG_TEXT_MUTED  = RGBColor(0x6B, 0x6B, 0x6B)
HBG_BORDER      = RGBColor(0xD9, 0xD5, 0xCF)
HBG_BG          = RGBColor(0xF7, 0xF5, 0xF2)

# Semantisch
HBG_WARNUNG = RGBColor(0xB8, 0x79, 0x1E)
HBG_FEHLER  = RGBColor(0xA6, 0x2B, 0x2B)
HBG_ERFOLG  = RGBColor(0x2E, 0x6E, 0x6E)

# Optionaler vierter Akzent (situativ, nicht fest)
HBG_SANDSTEIN = RGBColor(0xC9, 0xA8, 0x76)
```

### Kontrastregeln (WCAG-orientiert)

```
✅ Weißer Text erlaubt auf: --hbg-rot-dunkel, --hbg-rot, --hbg-blau-dunkel,
                             --hbg-blau, --hbg-gruen-dunkel, --hbg-gruen,
                             --hbg-fehler, --hbg-warnung, --hbg-erfolg
❌ Weißer Text VERBOTEN auf: --hbg-rot-mittel, --hbg-blau-mittel, --hbg-gruen-mittel,
                              --hbg-rot-blass/-ghost, --hbg-blau-blass/-ghost,
                              --hbg-gruen-blass/-ghost,
                              --hbg-sandstein (zu geringer Kontrast)
✅ --hbg-text (#2B2B2B) auf: --hbg-weiss, --hbg-bg, allen *-blass/-ghost-Flächen
❌ Rot und Blau nicht gegeneinander als Text-auf-Farbfläche-Kombination verwenden
❌ Semantikfarben nicht zweckentfremden: --hbg-fehler nur für Fehler,
   --hbg-warnung nur für Hinweise, --hbg-erfolg nur für Bestätigungen
   (nicht als zusätzliche Deko-Akzente verwenden)
❌ Grün-Familie nicht mit projektspezifischen internen Farbschemata verwechseln/mischen
```

### Farbzuordnung nach Funktion (Kurzreferenz)

| Kontext | Empfohlene Farbe |
|---|---|
| Logo, Haupttitel, Markenauftritt | `--hbg-rot` |
| Navigation, Struktur, sekundäre Flächen | `--hbg-blau` |
| Dritte Kategorie/Struktur, Diagramme, Naturbezug | `--hbg-gruen` |
| Hintergrund Karten/Boxen | `--hbg-rot-ghost` / `--hbg-blau-ghost` / `--hbg-gruen-ghost` / `--hbg-bg` |
| Hover-Zustände | `--hbg-rot-blass` / `--hbg-blau-blass` / `--hbg-gruen-blass` |
| Warnhinweise | `--hbg-warnung` auf `--hbg-rot-ghost`-artigem hellen Grund |
| Fehlermeldungen | `--hbg-fehler` |
| Erfolgs-/Bestätigungsmeldungen | `--hbg-erfolg` |
| Zusätzlicher vierter Akzent (situativ) | `--hbg-sandstein` |

---

## 5. Farbverwendung nach Medium

### Print (Flyer, Broschüren, Plakate)
- Rot und Blau für Struktur und wichtige Informationsblöcke; Grün ergänzend als dritte Leitfarbe für Kategorien, Diagramme oder thematische Abschnitte.
- Titel/Hauptüberschriften in Gagalin, Fließtext in Glacial Indifference.
- Klar strukturiertes Layout, keine Überladung.

### Präsentationsvorlagen (PPTX)
- Klares Layout mit Rot/Blau als Leitfarben; Grün optional als dritte Akzentfarbe für Diagramme, Kategorien oder Kapitelmarker.
- Fotos aus dem Schulleben strategisch platzieren (nicht als reine Dekoration, sondern zur Auflockerung/Beleg).
- Diese Regel gilt für **offizielle** HBG-Präsentationen (Elternabend, Konferenz, Schulveranstaltung). Für Unterrichts-/SRL-Präsentationen siehe stattdessen `hbg-pptx` bzw. `unterrichts-pptx`.

### Social Media (v. a. Instagram, auch Facebook)
- Fröhliches, buntes, aber **nicht grelles** Design.
- Farbpalette in **reduzierter Deckkraft** ("verblasst") einsetzen – nicht satte Vollfarben.
- Locker, jugendlich, sympathisch – Hauptzielgruppe: Schüler\*innen + Erziehungsberechtigte.
- Fokus liegt immer auf **Fotos von Menschen und Ereignissen**, nicht auf grafischen Elementen. Ablenkende Deko-Elemente minimieren.

**Verbindliches Post-Template-Muster:**

1. **Logo** HBG in Schwarz – muss sich klar vom Hintergrund abheben.
2. **Überschrift + Datum** der Veranstaltung/des Ereignisses, farblich an den Hintergrund angepasst, mittig positioniert.
3. **Cliparts**: thematisch passend, rein illustrativ (nicht inhaltstragend). Für KI-Bildsuche/-generierung als Stichwort-Muster verwenden: `[Element] + Aquarell`, z. B. "Wasser Aquarell", "Buch Aquarell".
4. **Hintergrund**: Aquarell-Optik, Farbe in reduzierter Deckkraft/verblasst. Darf inhaltlich nicht vom Bild ablenken, sondern soll die Botschaft unterstützen. Stichwort-Muster: `[Farbe] + Aquarell`, z. B. "Blau Aquarell", "Bunt Aquarell".
5. **Fotos**: ohne extreme Filter, realistisch, echt, natürlich. Optional kurze erläuternde Textzeile (z. B. "Die Schüler\*innen bauen das Floß auf.").

---

## 6. Bildsprache / Fotostil

Für alle Fotoauswahl, Bildgenerierung oder Bildbeschreibungen in HBG-Produkten gilt:

- Natürliches, hinreichendes Licht (keine harten Studio-/Blitzlicht-Optiken).
- Keine starke Nachbearbeitung durch Kontraste, Filter oder Effekte.
- Lebendige, authentische Szenen – keine gestellten Stock-Foto-Ästhetik.
- Scharf, lebendige Farben, klarer Bildaufbau, zeigt Relevantes (kein Beiwerk im Fokus).
- Menschen stehen im Zentrum: "Menschen sind diese Schule, Menschen leben ihre Werte."

---

## 7. Sprache

Alle Texte (digital wie analog) müssen:

- klar, verständlich und zielgruppenangepasst sein,
- sprachlich und inhaltlich korrekt sein,
- freundlich, wertschätzend, respektvoll sein,
- inklusiv, sensibel und **geschlechtergerecht** sein (Genderstern, z. B. Schüler\*innen),
- positive, motivierende Formulierungen nutzen,
- bildungssprachlich sein, aber verständlich bleiben – **keine Umgangs- oder Chatsprache**.

---

## 8. Workflow-Kontext (zur Einordnung, nicht Teil der Gestaltung selbst)

Materialien für Social Media/Homepage durchlaufen offiziell: (1) Einreichung durchs Kollegium per Forms-Formular oder Eigenerstellung durch Team ÖA → (2) Aufbereitung/Sichtung durch Team ÖA → (3) redaktionelle Freigabe durch die Schulleitung. Wenn ein generiertes Artefakt für die offizielle Veröffentlichung gedacht ist, kann ein kurzer Hinweis sinnvoll sein, dass die finale Freigabe bei der Schulleitung liegt.

---

## 9. Checkliste vor Ausgabe

- [ ] Richtige Logovariante gewählt (Rot > Schwarz > Blau > Weiß auf Dunkel), passende Motto-Version?
- [ ] Gagalin/Glacial Indifference bzw. sinnvolle Fallback-Fonts gesetzt?
- [ ] Rot `#791D22` / Blau `#245688` / Grün `#3F6B4D` (und passende Dark/Mid/Pale/Ghost-Abstufungen) korrekt und kontrastsicher eingesetzt?
- [ ] Logo und Haupttitel bleiben Rot – Grün nur als dritte Struktur-/Diagrammfarbe, nicht als Ersatz für die Markenfarbe?
- [ ] Grün nicht mit einem projektspezifischen internen Farbschema (z. B. SRL-Salbeigrün) verwechselt?
- [ ] Semantikfarben nur für ihren Zweck verwendet (Warnung/Fehler/Erfolg nicht als Deko-Akzente)?
- [ ] Bei Social Media: Template-Muster (Logo/Überschrift+Datum/Cliparts/Aquarell-Hintergrund/echtes Foto) eingehalten, Farben in reduzierter Deckkraft?
- [ ] Bildsprache: natürlich, unbearbeitet, authentisch, Menschen im Fokus?
- [ ] Sprache: klar, wertschätzend, gegendert, keine Umgangssprache?
- [ ] Nicht versehentlich das SRL-Farbschema (Schieferblau/Rostorange/Salbeigrün) verwendet, obwohl offizielles CD gemeint war?
