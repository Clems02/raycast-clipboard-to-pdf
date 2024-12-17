import { environment, showInFinder } from "@raycast/api";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { jsPDF } from "jspdf";
import { join } from "path";
import { ClipboardEntry } from "../type";

type GenerateFileOptions = {
  className: string;
  numberOfItems: number;
  teacherName: string;
};

export const generateFile = async (clipboard: ClipboardEntry[], options: GenerateFileOptions) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const columnWidth = (pageWidth - 3 * margin) / 2; // Largeur de chaque colonne
  const bannerHeight = 24;
  const lineHeight = 2;
  let currentY = bannerHeight + 10;

  // Ajouter les métadonnées au PDF
  doc.setProperties({
    title: `Code ENT - ${options.className} - ${options.teacherName}`,
    subject: options.className,
    creator: "CHAUMONT Clément",
    keywords: options.numberOfItems.toString(),
  });

  // Modifier le titre dans la bannière pour inclure la classe et l'enseignant
  const drawTextBanner = () => {
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("Renouvellement mot de passe ENT", pageWidth / 2, bannerHeight / 3 + 2, {
      align: "center",
    });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`${options.className} - ${options.teacherName}`, pageWidth / 2, (bannerHeight / 3) * 2, {
      align: "center",
    });
  };

  // Dessiner la bannière décorative
  const drawBanner = () => {
    // Rectangle principal bleu clair
    doc.setFillColor(230, 240, 255);
    doc.rect(0, 0, pageWidth, bannerHeight, "F");

    // Créer un dégradé de gauche à droite pour le rectangle principal
    const steps = 20;
    const rectWidth = pageWidth / steps;
    for (let i = 0; i < steps; i++) {
      const ratio = i / steps;
      const r = Math.floor(70 + (230 - 70) * ratio);
      const g = Math.floor(130 + (240 - 130) * ratio);
      const b = Math.floor(240 + (255 - 240) * ratio);
      doc.setFillColor(r, g, b);
      doc.rect(i * rectWidth, 0, rectWidth, bannerHeight, "F");
    }

    // Ajouter une ligne avec dégradé inverse (droite à gauche)
    for (let i = 0; i < steps; i++) {
      const ratio = (steps - i) / steps; // Inverse le ratio pour le dégradé
      const r = Math.floor(70 + (230 - 70) * ratio);
      const g = Math.floor(130 + (240 - 130) * ratio);
      const b = Math.floor(240 + (255 - 240) * ratio);
      doc.setFillColor(r, g, b);
      doc.rect(i * rectWidth, bannerHeight + 1, rectWidth, lineHeight, "F");
    }

    // Ligne verticale centrale
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2, bannerHeight + lineHeight + 5, pageWidth / 2, pageHeight);

    // Réinitialiser les styles
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
  };

  // Dessiner la bannière sur la première page
  drawBanner();
  drawTextBanner();

  // Traiter les éléments
  for (let i = 0; i < clipboard.length; i += 2) {
    const isLeftColumn = (i / 2) % 2 === 0;
    const x = isLeftColumn ? margin : pageWidth / 2 + margin / 2;

    // Hauteur fixe pour chaque rectangle
    const boxHeight = 36;
    const boxPadding = 5;

    // Vérifier si le rectangle peut tenir sur la page actuelle
    if (currentY + boxHeight > pageHeight - margin) {
      doc.addPage();
      drawBanner();
      currentY = bannerHeight + 10;
    }

    // Dessiner le rectangle
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, currentY, columnWidth, boxHeight, 3, 3);

    // Configuration du texte
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");

    // Ajouter "Identifiant" et sa valeur avec moins d'espacement
    doc.text("Identifiant:", x + boxPadding, currentY + boxPadding + 5);
    doc.setFont("helvetica", "normal");
    doc.text(clipboard[i].content, x + boxPadding, currentY + boxPadding + 10);

    // Ajouter "Mot de passe" et sa valeur avec moins d'espacement
    doc.setFont("helvetica", "bold");
    doc.text("Mot de passe:", x + boxPadding, currentY + boxPadding + 20);
    doc.setFont("helvetica", "normal");
    if (clipboard[i + 1]) {
      doc.text(clipboard[i + 1].content, x + boxPadding, currentY + boxPadding + 25);
    }

    // Mettre à jour la position Y seulement après avoir traité les deux colonnes
    if (!isLeftColumn) {
      currentY += boxHeight + 5; // Ajouter un espacement entre les rangées
    }
  }

  // Définir le chemin du dossier de l'extension
  const extensionFolderPath = join(environment.supportPath, "generated-pdfs");

  // Créer le dossier s'il n'existe pas
  if (!existsSync(extensionFolderPath)) {
    mkdirSync(extensionFolderPath, { recursive: true });
  }

  // Créer le chemin complet du fichier
  const finalFileName = `Code ENT - ${options.className}.pdf`;
  const filePath = join(extensionFolderPath, finalFileName);

  // Sauvegarder le PDF
  const pdfOutput = doc.output();
  writeFileSync(filePath, pdfOutput, "binary");

  showInFinder(filePath);

  // Afficher une notification avec les options pour accéder au fichier
  /* await showToast({
    style: Toast.Style.Success,
    title: "PDF généré avec succès",
    message: "Cliquer pour ouvrir le dossier",
    primaryAction: {
      title: "Ouvrir le dossier",
      onAction: () => showInFinder(filePath),
    },
  }); */

  return filePath;
};
