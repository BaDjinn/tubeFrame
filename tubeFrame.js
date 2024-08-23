const path = require("path");
const fs = require("fs").promises; // Usa l'API Promise di fs per un'implementazione asincrona
const { fetch } = require("undici"); // Alternativa moderna e performante a node-fetch

/**
 * Scarica la thumbnail del video YouTube se non esiste già.
 * @param {string} url - URL del video YouTube.
 * @param {string} outputDir - Directory di output per la thumbnail.
 * @returns {Promise<string>} - Percorso del file della thumbnail.
 */
async function downloadThumbnail(url, outputDir) {
  const videoId = new URL(url).pathname.split('/').pop(); // Usa URL per una parsing sicura
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
  const thumbnailPath = path.join(outputDir, `${videoId}.jpg`);

  try {
    // Verifica se la thumbnail esiste già
    await fs.access(thumbnailPath);
    console.log(`Thumbnail già presente: ${thumbnailPath}`);
  } catch {
    // Se la thumbnail non esiste, scaricala e salvala
    const response = await fetch(thumbnailUrl);
    if (response.ok) {
      const buffer = Buffer.from(await response.arrayBuffer());
      await fs.mkdir(outputDir, { recursive: true }); // Crea la directory se non esiste
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
 * @returns {Promise<string>} - HTML per visualizzare il video o la thumbnail.
 */
async function tubeFrame(src, thmb) {
  const outputDir = path.join(__dirname, "public/assets/images");

  if (thmb) {
    // Se "thmb" è presente, scarica la thumbnail e visualizzala
    let thumbnailSrc;
    try {
      thumbnailSrc = await downloadThumbnail(src, outputDir);
    } catch (error) {
      console.error("Errore nel download della thumbnail:", error);
      return `<p>Immagine di anteprima non disponibile.</p>`;
    }

    return `
      <section class="youtubeFrame">
        <img src="${thumbnailSrc}" alt="Video Thumbnail" style="width: 100%; max-width: 420px;">
      </section>
    `;
  } else {
    // Se "thmb" non è presente, mostra l'iframe del video
    return `
      <section class="youtubeFrame">
        <iframe width="420" height="345" src="${src}" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </section>
    `;
  }
}

module.exports = tubeFrame;