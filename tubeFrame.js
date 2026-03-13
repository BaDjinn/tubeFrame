/**
 * tubeFrame — Shortcode 11ty per YouTube (iframe o anteprima ottimizzata)
 *
 * Uso:
 *   {% tubeFrame "VIDEO_ID", false %}  // iframe YouTube (privacy-friendly) con lazy-load
 *   {% tubeFrame "VIDEO_ID", true %}   // anteprima locale ottimizzata con @11ty/eleventy-img
 *
 * Cosa fa:
 *  - Valida l'ID YouTube (11 caratteri alfanumerici + "_" e "-").
 *  - Se `thmb === true`: prova più thumbnail in fallback (maxres → sd → hq → mq),
 *    elabora l’immagine da URL remoto con @11ty/eleventy-img (AVIF/JPEG, width 300/800/orig)
 *    e restituisce markup responsive <picture> con attributi a11y e performance (lazy/decoding).
 *  - Se `thmb === false`: genera un <iframe> verso youtube-nocookie.com con title, lazy-load,
 *    policy e allow moderni, e stile responsive (aspect-ratio 16/9).
 *
 * Note:
 *  - Le immagini vengono salvate in `public/assets/images/` e servite da `/assets/images`.
 *  - Non usa fetch manuale: demanda caching/retry a eleventy-img/eleventy-fetch.
 *  - Parametro `sizes` opzionale per controllare il responsive behavior lato <picture>.
 */

const Image = require("@11ty/eleventy-img");

function isValidYouTubeId(id) {
	return /^[a-zA-Z0-9_-]{11}$/.test(id);
}

function buildThumbnailCandidates(videoId) {
	const bases = [
		"maxresdefault.jpg",
		"sddefault.jpg",
		"hqdefault.jpg",
		"mqdefault.jpg",
	];
	return bases.map((name) => `https://img.youtube.com/vi/${videoId}/${name}`);
}

async function getFirstWorkingThumbURL(videoId) {
	const candidates = buildThumbnailCandidates(videoId);
	for (const url of candidates) {
		try {
			await Image(url, {
				widths: [300], // basta un probe minimale
				formats: ["jpeg"],
				urlPath: "/assets/images",
				outputDir: "public/assets/images/",
			});
			return url;
		} catch {}
	}
	return null;
}

module.exports = async function tubeFrame(
	videoId,
	thmb = false,
	{ sizes = "(max-width: 576px) 100vw, (max-width: 768px) 50vw, 33vw" } = {},
) {
	if (!isValidYouTubeId(videoId)) {
		return `
      <div role="status" aria-live="polite" class="text-danger">
        ID video non valido.
      </div>
    `;
	}

	if (thmb) {
		const thumbURL = await getFirstWorkingThumbURL(videoId);
		if (!thumbURL) {
			return `
        <div role="status" aria-live="polite" class="text-warning">
          Immagine di anteprima non disponibile.
        </div>
      `;
		}

		const metadata = await Image(thumbURL, {
			widths: [300, 800, null],
			formats: ["avif", "jpeg"],
			urlPath: "/assets/images",
			outputDir: "public/assets/images/",
		});

		const imageAttributes = {
			alt: `Anteprima del video ${videoId}`,
			sizes,
			loading: "lazy",
			decoding: "async",
			class: "img-fluid",
		};

		return Image.generateHTML(metadata, imageAttributes);
	}

	const src = `https://www.youtube-nocookie.com/embed/${videoId}`;
	return `
    <iframe
      src="${src}"
      title="Riproduzione video: ${videoId}"
      loading="lazy"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin"
      style="width:100%; aspect-ratio:16/9; border:0"
    ></iframe>
  `;
};
