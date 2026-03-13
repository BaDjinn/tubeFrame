# tubeFrame

### *A YouTube embed + smart thumbnail generator for Eleventy*

`tubeFrame` is an Eleventy shortcode that lets you embed YouTube videos or display their thumbnails as optimized static images.\
Compared to a standard iframe embed, it offers better **performance**, **privacy**, **responsiveness**, and **SEO/a11y**.

This module supports:

*   ✔ YouTube **video ID** input (e.g. `dQw4w9WgXcQ`)
*   ✔ **Smart thumbnail fallback** (maxres → sd → hq → mq)
*   ✔ Thumbnail optimization via **@11ty/eleventy-img**
*   ✔ Responsive `<picture>` output (AVIF + JPEG)
*   ✔ Lazy-loading and decoding optimization
*   ✔ Privacy‑friendly embeds via `youtube-nocookie.com`
*   ✔ Accessible iframe markup (`title`, `allow`, `referrerpolicy`, etc.)

***

# Installation

Install required dependencies:

```bash
npm install @11ty/eleventy-img undici path fs
```

Create (if not already present) a folder for your Eleventy shortcodes:

    /src/shortcodes/

Then download/copy `tubeFrame.js` into that folder.

***

# Eleventy Configuration

Add the shortcode inside your `.eleventy.js` config:

```js
const tubeFrame = require("./src/shortcodes/tubeFrame");

module.exports = function (eleventyConfig) {
  eleventyConfig.addNunjucksAsyncShortcode("tubeFrame", tubeFrame);

  // your other config...
};
```

***

# Usage

## Embed a YouTube video (iframe mode)

```njk
{% tubeFrame "dQw4w9WgXcQ", false %}
```

Produces a responsive, privacy‑enhanced `<iframe>`:

*   Uses `https://www.youtube-nocookie.com/`
*   Has lazy loading
*   Has a descriptive title
*   Includes strict `referrerpolicy`
*   Uses 16:9 responsive aspect ratio

***

## Display only the thumbnail (static mode)

```njk
{% tubeFrame "dQw4w9WgXcQ", true %}
```

This will:

1.  Validate the video ID
2.  Try multiple thumbnail URLs (maxres → sd → hq → mq)
3.  Use the first available
4.  Optimize it via `@11ty/eleventy-img`
5.  Output a `<picture>` element with AVIF/JPEG sources, lazy‑loaded and responsive

Image output destination:

    public/assets/images/

***

## Optional parameters

You can pass an optional configuration object as third parameter:

```njk
{% tubeFrame "dQw4w9WgXcQ", true, { sizes: "(max-width: 600px) 100vw, 50vw" } %}
```

| Param     | Type      | Default                   | Description                                    |
| --------- | --------- | ------------------------- | ---------------------------------------------- |
| `videoId` | `string`  | required                  | YouTube video ID (11 chars)                    |
| `thmb`    | `boolean` | `false`                   | If `true`, outputs thumbnail instead of iframe |
| `sizes`   | `string`  | standard responsive sizes | `<img>`/`<picture>` `sizes` attribute          |

***

# How it works (technical)

*   Validates the video ID using:\
    `/^[a-zA-Z0-9_-]{11}$/`
*   Thumbnail mode tries URLs like:
    *   `maxresdefault.jpg`
    *   `sddefault.jpg`
    *   `hqdefault.jpg`
    *   `mqdefault.jpg`
*   Uses `Image(url, options)` from **@11ty/eleventy-img**, which internally relies on **Eleventy Fetch** for caching and remote fetch handling.
*   If all thumbnails fail, outputs a graceful warning block.
*   Iframe mode uses:
    *   `youtube-nocookie.com`
    *   lazy‑loading
    *   `allowfullscreen`
    *   `allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"`
    *   `referrerpolicy="strict-origin-when-cross-origin"`
    *   responsive `aspect-ratio: 16/9`

***

# License

MIT License 

***

# Future development ideas

*   Choose between multiple thumbnail qualities explicitly
*   Direct integration with Eleventy Image plugin (now partially implemented automatically)
