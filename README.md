
# tubeFrame

tubeFrame is a JavaScript module for Eleventy that handles YouTube embedding and thumbnail management. It can be used to easily embed YouTube videos into your projects, with support for displaying thumbnails as static images when you don't want the video to be directly playable.

## Installation

To use tubeFrame, follow these steps:

- Install the necessary dependencies:
  ```bash
  npm install path fs undici @11ty/eleventy-img
  ```
  
- Create a folder for your shortcodes, for example `/src/shortcodes`.

- Download or copy the `tubeFrame.js` file into the created folder.

- Configure Eleventy to use tubeFrame by including the module in your `.eleventy.js` file:
  
  ```javascript
  const tubeFrame = require("./src/shortcodes/tubeFrame");

  module.exports = function (eleventyConfig) {
    // Other shortcodes and configurations
    eleventyConfig.addNunjucksAsyncShortcode("tubeFrame", tubeFrame);

    // Other configurations
  };
  ```

## Usage

Once configured, you can use the tubeFrame shortcode in your Nunjucks templates to embed YouTube videos or display thumbnails. Below are some usage examples.

### Embedding the Video

- `@param {string} videoId` - YouTube video ID (e.g., `dQw4w9WgXcQ`).
- `@param {boolean} [thmb=false]` - If `true`, returns only the video's thumbnail.
- `@param {string} [outputDir="./public/assets/images"]` - Output directory for the downloaded images.
- `@param {string} [baseDir=__dirname]` - Root directory for resolving paths.
- `@returns {Promise<string>}` - HTML snippet.

#### Example:

```html
{% tubeFrame "dQw4w9WgXcQ", false, "./custom/images/thumbnails", "./src" %}
```

This will embed the YouTube video directly into your template.

### Displaying the Thumbnail

If you prefer to display only the video thumbnail, set the `thmb` option to `true`:

```html
{% tubeFrame "dQw4w9WgXcQ", true, "./custom/images/thumbnails", "./src" %}
```

In this case, tubeFrame will download the video thumbnail and generate multiple versions of the image (in different formats and sizes), which will be displayed as static images instead of embedding the video.

#### Example in a Nunjucks Template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Thumbnail Example</title>
</head>
<body>
  <h1>Video Thumbnail</h1>
  {% tubeFrame "dQw4w9WgXcQ", true %}
</body>
</html>
```

### Configuration Parameters

The tubeFrame module supports the following parameters:

- **videoId (Required):** The ID of the YouTube video.
- **thmb (Optional):** If `true`, shows the video thumbnail instead of embedding the video.
- **outputDir (Optional):** The directory where the thumbnails will be saved (defaults to `"./public/assets/images"`).
- **baseDir (Optional):** The base directory of the project (defaults to the current working directory).

### Node.js Example

If you want to use tubeFrame in a Node.js script:

```javascript
const tubeFrame = require('./src/shortcodes/tubeFrame');

(async () => {
  const html = await tubeFrame('dQw4w9WgXcQ', true, './images/thumbnails', process.cwd());
  console.log(html);
})();
```

### Example: Embedding a Video

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Video Example</title>
</head>
<body>
  <h1>My YouTube Video</h1>
  {% tubeFrame "dQw4w9WgXcQ" %}
</body>
</html>
```

## License

This project is licensed under the MIT License.

## Future Development

- Change `thmb` option to allow choosing between different YouTube thumbnail resolutions (e.g., 0-3).
- Direct integration with more advanced features of the Eleventy Image plugin ✓
