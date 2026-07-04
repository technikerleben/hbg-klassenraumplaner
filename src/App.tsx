import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Toolbar } from './components/Toolbar';
import { CatalogPanel } from './components/CatalogPanel';
import { TemplatesPanel } from './components/TemplatesPanel';
import { RoomPanel } from './components/RoomPanel';
import { AnalysisPanel } from './components/AnalysisPanel';
import { VariantsPanel } from './components/VariantsPanel';
import { CompareView } from './components/CompareView';
import { CanvasEditor } from './components/CanvasEditor';
import { PropertiesPanel } from './components/PropertiesPanel';
import { StatusBar } from './components/StatusBar';
import { usePlannerStore } from './store/usePlannerStore';
import { storageGet, storageRemove, storageSet } from './lib/storage';
import { analyzeVariant } from './lib/analysis';
import './styles.css';

const STORAGE_KEY = 'klassenraumplaner-project-v1';

const HBG = {
  rot: '#791D22',
  blauDunkel: '#163A5C',
  blau: '#245688',
  blauGhost: '#EFF4F9',
  text: '#2B2B2B',
  textMuted: '#6B6B6B',
  border: '#D9D5CF',
  warnung: '#B8791E',
  fehler: '#A62B2B',
  erfolg: '#2E6E6E',
};

async function createTitleImage(text: string, sizePx: number, color = HBG.rot) {
  await document.fonts.ready;
  const canvas = document.createElement('canvas');
  const measureContext = canvas.getContext('2d');
  if (!measureContext) return null;
  measureContext.font = `${sizePx}px Gagalin, Anton, Arial Black, sans-serif`;
  const metrics = measureContext.measureText(text);
  canvas.width = Math.max(2, Math.ceil(metrics.width + 12));
  canvas.height = Math.ceil(sizePx * 1.35);
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.font = `${sizePx}px Gagalin, Anton, Arial Black, sans-serif`;
  context.fillStyle = color;
  context.textBaseline = 'top';
  context.fillText(text, 4, 0);
  return { dataUrl: canvas.toDataURL('image/png'), width: canvas.width, height: canvas.height };
}

function getEmbeddedFontCss() {
  const rules: string[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        if (rule instanceof CSSFontFaceRule) rules.push(rule.cssText);
      }
    } catch {
      // Externe Stylesheets können den Zugriff verweigern; die App benötigt sie nicht.
    }
  }
  return rules.join('\n');
}

function safeFilename(value: string) {
  return (value.trim() || 'klassenraumplan').replace(/[^a-zA-Z0-9äöüÄÖÜß_-]+/g, '-').replace(/-+/g, '-');
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char] ?? char));
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function nextPaint() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

export default function App() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const project = usePlannerStore((s) => s.project);
  const mode = usePlannerStore((s) => s.mode);
  const importProject = usePlannerStore((s) => s.importProject);
  const deleteSelected = usePlannerStore((s) => s.deleteSelected);
  const duplicateSelected = usePlannerStore((s) => s.duplicateSelected);
  const rotateSelected = usePlannerStore((s) => s.rotateSelected);
  const undo = usePlannerStore((s) => s.undo);
  const redo = usePlannerStore((s) => s.redo);
  const markSaved = usePlannerStore((s) => s.markSaved);

  useEffect(() => {
    const stored = storageGet(STORAGE_KEY);
    if (!stored) return;
    try { importProject(JSON.parse(stored)); } catch { storageRemove(STORAGE_KEY); }
  }, [importProject]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      storageSet(STORAGE_KEY, JSON.stringify(project));
      markSaved();
    }, 400);
    return () => window.clearTimeout(timer);
  }, [project, markSaved]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.matches('input, textarea, select') || target.isContentEditable) return;
      const cmd = event.ctrlKey || event.metaKey;
      if (cmd && event.key.toLowerCase() === 'z') { event.preventDefault(); event.shiftKey ? redo() : undo(); }
      else if (cmd && event.key.toLowerCase() === 'd') { event.preventDefault(); duplicateSelected(); }
      else if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); deleteSelected(); }
      else if (event.key.toLowerCase() === 'r') rotateSelected(90);
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [deleteSelected, duplicateSelected, redo, rotateSelected, undo]);

  const exportProject = () => downloadBlob(new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' }), `${safeFilename(project.meta.title)}.klassenraum.json`);

  const capturePlan = async (mimeType: 'image/png' | 'image/jpeg' = 'image/png') => {
    if (mode === 'compare') {
      alert('Öffne zuerst eine Variante, um ihren Plan zu exportieren.');
      return null;
    }
    const stage = stageRef.current;
    if (!stage) return null;
    const state = usePlannerStore.getState();
    const previousSelection = [...state.selectedIds];
    const previousAnalysis = state.showAnalysis;
    state.setSelected([]);
    state.setShowAnalysis(false);
    await nextPaint();
    const rect = stage.getAttr('planExportRect') as { x: number; y: number; width: number; height: number } | undefined;
    const dataUrl = stage.toDataURL({
      x: rect?.x ?? 0,
      y: rect?.y ?? 0,
      width: rect?.width ?? stage.width(),
      height: rect?.height ?? stage.height(),
      pixelRatio: 3,
      mimeType,
      quality: mimeType === 'image/jpeg' ? 0.92 : undefined,
    });
    state.setShowAnalysis(previousAnalysis);
    state.setSelected(previousSelection);
    return dataUrl;
  };

  const exportImage = async (kind: 'png' | 'jpg') => {
    const dataUrl = await capturePlan(kind === 'png' ? 'image/png' : 'image/jpeg');
    if (!dataUrl) return;
    const anchor = document.createElement('a');
    anchor.href = dataUrl;
    anchor.download = `${safeFilename(project.meta.title)}.${kind}`;
    anchor.click();
  };

  const exportPdf = async (format: 'a4' | 'a3') => {
    const dataUrl = await capturePlan('image/png');
    if (!dataUrl) return;
    const { jsPDF } = await import('jspdf');
    const variant = project.variants.find((v) => v.id === project.activeVariantId) ?? project.variants[0];
    const warnings = analyzeVariant(variant, project.meta.targetStudentCount, project.meta.wheelchairMode);
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 12;
    const headerH = 25;
    const footerH = 10;
    const availableW = pageW - margin * 2;
    const availableH = pageH - margin - headerH - footerH;
    const desiredW = variant.room.widthCm / 5;
    const desiredH = variant.room.lengthCm / 5;
    const fit = Math.min(1, availableW / desiredW, availableH / desiredH);
    const planW = desiredW * fit;
    const planH = desiredH * fit;
    const denominator = Math.round(50 / fit);

    pdf.setFillColor(HBG.rot);
    pdf.rect(0, 0, 5, pageH, 'F');
    pdf.setFillColor(HBG.blauDunkel);
    pdf.rect(5, 0, pageW - 5, 4, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(HBG.blau);
    pdf.text('HEINRICH-BÖLL-GESAMTSCHULE DORTMUND', margin, 8);
    const titleImage = await createTitleImage(project.meta.title || 'Klassenraumplan', format === 'a3' ? 34 : 29);
    if (titleImage) {
      const titleHeight = format === 'a3' ? 10 : 8.5;
      const titleWidth = titleHeight * titleImage.width / titleImage.height;
      pdf.addImage(titleImage.dataUrl, 'PNG', margin, 9.2, Math.min(titleWidth, availableW * .68), titleHeight);
    } else {
      pdf.setTextColor(HBG.rot);
      pdf.setFontSize(format === 'a3' ? 20 : 17);
      pdf.text(project.meta.title || 'Klassenraumplan', margin, 16);
    }
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(HBG.textMuted);
    pdf.text(`${variant.name} · Raum ${variant.room.widthCm / 100} × ${variant.room.lengthCm / 100} m · ${project.meta.targetStudentCount} Lernende`, margin, 21);
    pdf.text(`Maßstab ${fit === 1 ? '1:50' : `ca. 1:${denominator}`} · erstellt ${new Date().toLocaleDateString('de-DE')}`, pageW - margin, 21, { align: 'right' });
    pdf.addImage(dataUrl, 'PNG', (pageW - planW) / 2, headerH, planW, planH);
    pdf.setDrawColor(HBG.border);
    pdf.line(margin, pageH - footerH, pageW - margin, pageH - footerH);
    pdf.setFontSize(7.5);
    pdf.setTextColor(HBG.textMuted);
    pdf.text('Geometrische Planungshilfe – keine Brandschutz-, Norm- oder Sicherheitsfreigabe.', margin, pageH - 4);
    pdf.text(`${variant.objects.reduce((sum, o) => sum + (o.places ?? 0), 0)} Lernplätze · ${warnings.filter((w) => w.severity === 'critical').length} kritische Warnungen · ${warnings.filter((w) => w.severity !== 'critical').length} Hinweise`, pageW - margin, pageH - 4, { align: 'right' });

    pdf.addPage(format, 'landscape');
    pdf.setFillColor(HBG.rot);
    pdf.rect(0, 0, 5, pageH, 'F');
    pdf.setFillColor(HBG.blauDunkel);
    pdf.rect(5, 0, pageW - 5, 4, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(HBG.blau);
    pdf.text('HEINRICH-BÖLL-GESAMTSCHULE DORTMUND', margin, 8);
    const sectionImage = await createTitleImage('Möbelliste und Prüfhinweise', 28);
    if (sectionImage) {
      const sectionHeight = 8;
      pdf.addImage(sectionImage.dataUrl, 'PNG', margin, 9.5, sectionHeight * sectionImage.width / sectionImage.height, sectionHeight);
    } else {
      pdf.setTextColor(HBG.rot);
      pdf.setFontSize(17);
      pdf.text('Möbelliste und Prüfhinweise', margin, 16);
    }
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    const grouped = new Map<string, { name: string; count: number; width: number; depth: number; places: number }>();
    variant.objects.forEach((o) => {
      const key = `${o.catalogId}-${o.widthCm}-${o.depthCm}`;
      const existing = grouped.get(key);
      if (existing) { existing.count += 1; existing.places += o.places ?? 0; }
      else grouped.set(key, { name: o.name, count: 1, width: o.widthCm, depth: o.depthCm, places: o.places ?? 0 });
    });
    let y = 25;
    pdf.setFillColor(HBG.blauGhost);
    pdf.rect(margin, y - 5, pageW - margin * 2, 8, 'F');
    pdf.setFillColor(HBG.rot);
    pdf.rect(margin, y - 5, 2, 8, 'F');
    pdf.setTextColor(HBG.blauDunkel);
    pdf.text('Anzahl', margin + 2, y);
    pdf.text('Objekt', margin + 22, y);
    pdf.text('Maße', margin + 110, y);
    pdf.text('Lernplätze', margin + 160, y);
    y += 9;
    for (const item of [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name, 'de'))) {
      pdf.setTextColor(HBG.blauDunkel);
      pdf.text(String(item.count), margin + 2, y);
      pdf.text(item.name.slice(0, 48), margin + 22, y);
      pdf.text(`${item.width} × ${item.depth} cm`, margin + 110, y);
      pdf.text(String(item.places), margin + 160, y);
      y += 7;
      if (y > pageH - 30) { pdf.addPage(format, 'landscape'); y = 20; }
    }
    y += 6;
    pdf.setFontSize(12);
    pdf.text('Prüfhinweise', margin, y);
    y += 7;
    pdf.setFontSize(8);
    if (!warnings.length) {
      pdf.setTextColor(HBG.erfolg);
      pdf.text('Für die aktivierten Regeln wurden keine Probleme erkannt.', margin, y);
    } else {
      for (const warning of warnings.slice(0, 28)) {
        pdf.setTextColor(warning.severity === 'critical' ? HBG.fehler : warning.severity === 'warning' ? HBG.warnung : HBG.blau);
        const lines = pdf.splitTextToSize(`${warning.title}: ${warning.message}`, pageW - margin * 2);
        pdf.text(lines, margin, y);
        y += lines.length * 4 + 2;
        if (y > pageH - 15) { pdf.addPage(format, 'landscape'); y = 18; }
      }
    }
    pdf.save(`${safeFilename(project.meta.title)}-${format.toUpperCase()}.pdf`);
  };

  const printPlan = async () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) printWindow.opener = null;
    const dataUrl = await capturePlan('image/png');
    if (!dataUrl) { printWindow?.close(); return; }
    if (!printWindow) { alert('Das Druckfenster wurde vom Browser blockiert. Nutze alternativ den PDF-Export.'); return; }
    const variant = project.variants.find((v) => v.id === project.activeVariantId) ?? project.variants[0];
    const fontFaceCss = getEmbeddedFontCss();
    printWindow.document.write(`<!doctype html><html lang="de"><head><title>${escapeHtml(project.meta.title)}</title><style>${fontFaceCss}*{box-sizing:border-box}body{font-family:'Glacial Indifference','Helvetica Neue',Arial,sans-serif;margin:0;padding:12mm 14mm 10mm 17mm;color:#2B2B2B;border-left:6mm solid #791D22;border-top:3mm solid #163A5C;background:#fff}.school{font-size:8pt;letter-spacing:.12em;text-transform:uppercase;color:#245688}.head{display:flex;align-items:flex-start;justify-content:space-between;gap:10mm;border-bottom:1px solid #D9D5CF;padding-bottom:4mm}.logo{font-family:Gagalin,Arial Black,sans-serif;background:#791D22;color:white;padding:3mm 4mm;font-size:16pt}.title{flex:1}h1{font-family:Gagalin,Arial Black,sans-serif;font-weight:400;color:#791D22;font-size:25pt;line-height:1;margin:2mm 0 1mm}.meta{font-size:9pt;color:#6B6B6B;margin:0}img{display:block;max-width:100%;max-height:156mm;margin:7mm auto;object-fit:contain}.note{border-top:1px solid #D9D5CF;padding-top:3mm;font-size:8pt;color:#6B6B6B}@media print{button{display:none}}</style></head><body><div class="head"><div class="title"><div class="school">Heinrich-Böll-Gesamtschule Dortmund</div><h1>${escapeHtml(project.meta.title)}</h1><p class="meta">${escapeHtml(variant.name)} · ${variant.room.widthCm / 100} × ${variant.room.lengthCm / 100} m · ${project.meta.targetStudentCount} Lernende</p></div><div class="logo" title="Logo-Platzhalter">HBG</div></div><img src="${dataUrl}" onload="document.fonts.ready.then(()=>setTimeout(()=>window.print(),200))"><p class="note">Geometrische Planungshilfe – keine Brandschutz-, Norm- oder Sicherheitsfreigabe.</p></body></html>`);
    printWindow.document.close();
  };

  const leftPanel = mode === 'room' ? <RoomPanel /> : mode === 'templates' ? <TemplatesPanel /> : mode === 'analysis' ? <AnalysisPanel /> : mode === 'compare' ? <VariantsPanel /> : <CatalogPanel />;

  return <div className="app-shell">
    <Toolbar onExportPng={() => void exportImage('png')} onExportJpg={() => void exportImage('jpg')} onExportPdf={(format) => void exportPdf(format)} onPrint={() => void printPlan()} onExportProject={exportProject} onImportProject={() => fileInput.current?.click()} />
    <input ref={fileInput} className="hidden-input" type="file" accept=".json,.klassenraum.json,application/json" onChange={async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try { importProject(JSON.parse(await file.text())); } catch (error) { alert(error instanceof Error ? error.message : 'Die Projektdatei konnte nicht geöffnet werden.'); }
      e.currentTarget.value = '';
    }} />
    <div className="workspace">
      {leftPanel}
      {mode === 'compare' ? <CompareView /> : <CanvasEditor stageRef={stageRef} />}
      {mode === 'compare' ? <aside className="right-panel compare-help"><h2>Vergleich</h2><p>Öffne eine Variante über „Diese Variante bearbeiten“. Du kannst neue Varianten leer anlegen oder die aktive Einrichtung kopieren.</p><h3>Projektziel</h3><label className="field"><span>Schülerzahl</span><input type="number" min={1} max={60} value={project.meta.targetStudentCount} onChange={(e) => usePlannerStore.getState().updateMeta({ targetStudentCount: Number(e.target.value) })} /></label></aside> : <PropertiesPanel />}
    </div>
    <StatusBar />
  </div>;
}
