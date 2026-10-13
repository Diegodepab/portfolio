#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const cvDir = __dirname;
const publicDir = path.join(rootDir, 'public');
const assetsDir = path.join(cvDir, 'assets');

async function ensurePortrait() {
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  const portraitOut = path.join(assetsDir, 'diego-formal.jpg');
  const sourceWebp = path.join(publicDir, 'images', 'portraits', 'diego-formal.webp');

  if (fs.existsSync(sourceWebp)) {
    console.log('Generating centered square portrait asset for CV...');
    const sharp = (await import('sharp')).default;
    await sharp(sourceWebp)
      .extract({ left: 55, top: 25, width: 320, height: 320 })
      .resize(400, 400)
      .jpeg({ quality: 95 })
      .toFile(portraitOut);
    console.log('Portrait generated at:', portraitOut);
  }
}

function compileCV(texFileName, targetPdfName) {
  console.log(`Compiling ${texFileName} -> ${targetPdfName}...`);
  const texPath = path.join(cvDir, texFileName);
  if (!fs.existsSync(texPath)) {
    throw new Error(`TeX file not found: ${texPath}`);
  }

  execFileSync('pdflatex', ['-interaction=nonstopmode', '-halt-on-error', texFileName], {
    cwd: cvDir,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const baseName = path.basename(texFileName, '.tex');
  const generatedPdf = path.join(cvDir, `${baseName}.pdf`);
  const destPdf = path.join(publicDir, targetPdfName);

  if (!fs.existsSync(generatedPdf)) {
    throw new Error(`pdflatex failed to generate ${generatedPdf}`);
  }

  fs.copyFileSync(generatedPdf, destPdf);
  console.log(`✓ Copied to ${path.relative(rootDir, destPdf)}`);
}

function cleanArtifacts() {
  const extensions = ['.aux', '.log', '.out', '.pdf', '.png'];
  const files = fs.readdirSync(cvDir);
  for (const file of files) {
    const ext = path.extname(file);
    if (extensions.includes(ext)) {
      try {
        fs.unlinkSync(path.join(cvDir, file));
      } catch {
        // ignore
      }
    }
  }
}

async function main() {
  try {
    await ensurePortrait();

    // Primary recruiter-facing filenames containing candidate's name
    const variants = [
      { tex: 'cv-es.tex', pdf: 'cv_DiegoDePablo_es.pdf' },
      { tex: 'cv-en.tex', pdf: 'cv_DiegoDePablo_en.pdf' },
      { tex: 'cv-es-photo.tex', pdf: 'cv_DiegoDePablo_es_photo.pdf' },
      { tex: 'cv-en-photo.tex', pdf: 'cv_DiegoDePablo_en_photo.pdf' },
    ];

    for (const v of variants) {
      compileCV(v.tex, v.pdf);
    }

    // Keep backwards-compatible aliases in public/
    const aliases = [
      { from: 'cv_DiegoDePablo_es.pdf', to: 'cv_es.pdf' },
      { from: 'cv_DiegoDePablo_en.pdf', to: 'cv_en.pdf' },
      { from: 'cv_DiegoDePablo_es_photo.pdf', to: 'cv_es_foto.pdf' },
      { from: 'cv_DiegoDePablo_en_photo.pdf', to: 'cv_en_photo.pdf' },
      { from: 'cv_DiegoDePablo_es.pdf', to: 'cv_diego_de_pablos.pdf' },
    ];

    for (const a of aliases) {
      fs.copyFileSync(path.join(publicDir, a.from), path.join(publicDir, a.to));
      console.log(`✓ Updated public/${a.to} (alias)`);
    }

    cleanArtifacts();
    console.log('\nAll CV variants successfully built!');
  } catch (err) {
    console.error('CV build error:', err.message);
    process.exit(1);
  }
}

main();

