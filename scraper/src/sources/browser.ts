import { chromium, type Page } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export interface FetchRenderedHtmlOptions {
  // Sélecteur CSS dont on attend l'apparition (ex: la carte d'une annonce)
  // avant de considérer la page comme chargée. Si absent au bout du délai,
  // on continue quand même: c'est souvent le signe d'une page de
  // challenge/CAPTCHA plutôt qu'un vrai résultat de recherche.
  waitForSelector?: string;
  timeoutMs?: number;
  // Si fourni, sauvegarde le HTML rendu + une capture d'écran sous
  // scraper/debug/<debugName>.{html,png} — utile pour ajuster les
  // sélecteurs quand l'extraction ne trouve rien.
  debugName?: string;
}

// Charge une page avec un vrai navigateur (Chromium headless) et renvoie le
// HTML une fois le JavaScript exécuté. Nécessaire pour des sites comme
// leboncoin ou SeLoger qui affichent leurs résultats côté client
// (React/Next.js): un simple fetch() ne verrait qu'une coquille vide.
//
// Ceci n'est PAS une technique de contournement anti-bot: c'est un vrai
// navigateur, sans usurpation d'empreinte ni plugin furtif. Si le site
// détecte quand même l'automatisation et bloque (CAPTCHA, page de
// challenge), cette fonction renverra ce contenu tel quel — voir
// scraper/README.md pour la position du projet sur ce point.
export async function fetchRenderedHtml(
  url: string,
  { waitForSelector, timeoutMs = 30000, debugName }: FetchRenderedHtmlOptions = {}
): Promise<string> {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      userAgent: USER_AGENT,
      locale: "fr-FR",
      viewport: { width: 1366, height: 900 },
    });

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: timeoutMs });

    if (waitForSelector) {
      await page.waitForSelector(waitForSelector, { timeout: timeoutMs }).catch(() => {
        // Le sélecteur attendu n'est jamais apparu (page de challenge,
        // structure changée...). On continue: le HTML récupéré ci-dessous
        // sert au diagnostic si debugName est fourni.
      });
    }

    const html = await page.content();

    if (debugName) {
      await saveDebugArtifacts(debugName, html, page);
    }

    return html;
  } finally {
    await browser.close();
  }
}

async function saveDebugArtifacts(name: string, html: string, page: Page): Promise<void> {
  const dir = path.join(process.cwd(), "debug");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${name}.html`), html, "utf8");
  await page.screenshot({ path: path.join(dir, `${name}.png`), fullPage: true }).catch(() => {});
}
