const path = require("path");
const fs = require("fs").promises;
const { fetch } = require("undici");

/**
 * Scarica la thumbnail del video YouTube se non esiste già.
 * @param {string} videoId - ID del video YouTube.
 * @param {string} outputDir - Directory di output per la thumbnail.
 * @returns {Promise<string>} - Percorso del file della thumbnail.
 */
async function downloadThumbnail(videoId, outputDir) {
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
 * @param {string} videoId - ID del video YouTube.
 * @param {boolean} [thmb] - Se true, mostra la thumbnail invece dell'iframe.
 * @param {string} [outputDir="./public/assets/images"] - Directory di output per le immagini.
 * @param {string} [baseDir=__dirname] - Directory base del progetto.
 * @returns {Promise<string>} - HTML per visualizzare il video o la thumbnail.
 */
async function tubeFrame(videoId, thmb = false, outputDir = "./public/assets/images", baseDir = __dirname) {
  const resolvedOutputDir = path.resolve(baseDir, outputDir);

  if (thmb) {
    let thumbnailSrc;
    try {
      thumbnailSrc = await downloadThumbnail(videoId, resolvedOutputDir);
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
    const videoUrl = `https://www.youtube.com/embed/${videoId}`;
    return `
      <section class="youtubeFrame">
        <iframe width="420" height="345" src="${videoUrl}" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </section>
    `;
  }
}

module.exports = tubeFrame;
