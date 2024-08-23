const path = require("path");
const fs = require("fs").promises;
const { fetch } = require("undici");

/**
 * Estrae l'ID del video da un URL di YouTube.
 * @param {string} url - L'URL del video di YouTube.
 * @returns {string|null} - L'ID del video, o null se non è stato trovato.
 */
function extractVideoId(url) {
  const videoIdMatch = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&/]+)/);
  return videoIdMatch ? videoIdMatch[1] : null;
}

/**
 * Scarica la thumbnail del video YouTube se non esiste già.
 * @param {string} url - URL del video YouTube.
 * @param {string} outputDir - Directory di output per la thumbnail.
 * @returns {Promise<string>} - Percorso del file della thumbnail.
 */
async function downloadThumbnail(url, outputDir) {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error("Impossibile estrarre l'ID del video dall'URL.");
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const thumbnailPath = path.join(outputDir, `${videoId}.jpg`);

  try {
    await fs.access(thumbnailPath);
    console.log(`Thumbnail già presente: ${thumbnailPath}`);
  } catch {
    const response = await fetch(thumbnailUrl);
    if (response.ok) {
      const buffer = Buffer.from(await response.arrayBuffer());
      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(thumbnailPath, buffer);
      console.log(`Thumbnail scaricata e salvata: ${thumbnailPath}`);
    } else {
      throw new Error(`Unable to fetch thumbnail from ${thumbnailUrl}`);
    }
  }

  return thumbnailPath;
}

/**
 * Shortcode per iframe di YouTube o thumbnail.
 * @param {string} src - URL del video YouTube.
 * @param {string} [thmb] - Se presente, mostra la thumbnail invece dell'iframe.
 * @param {string} [outputDir="./public/assets/images"] - Directory di output per le immagini.
 * @param {string} [baseDir=__dirname] - Directory base del progetto.
 * @returns {Promise<string>} - HTML per visualizzare il video o la thumbnail.
 */
async function tubeFrame(src, thmb, outputDir = "./public/assets/images", baseDir = __dirname) {
  const resolvedOutputDir = path.resolve(baseDir, outputDir);

  if (thmb) {
    let thumbnailSrc;
    try {
      thumbnailSrc = await downloadThumbnail(src, resolvedOutputDir);
    } catch (error) {
      console.error("Errore nel download della thumbnail:", error);
      return `<p>Immagine di anteprima non disponibile.</p>`;
    }

    const relativeThumbnailPath = path.relative(baseDir, thumbnailSrc);
    return `
      <section class="youtubeFrame">
        <img src="${relativeThumbnailPath}" alt="Video Thumbnail" style="width: 100%; max-width: 420px;">
      </section>
    `;
  } else {
    return `
      <section class="youtubeFrame">
        <iframe width="420" height="345" src="${src}" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </section>
    `;
  }
}

module.exports = tubeFrame;
