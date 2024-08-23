# tubeFrame

tubeFrame is a JavaScript module for Eleventy that handles YouTube embedding and thumbnail management. It can be used to easily embed YouTube videos into your projects, with support for displaying thumbnails as static images when you don't want the video to be directly playable.
## Installation

To use tubeFrame, follow these steps:
- Install
```node
npm install path
npm install fs
npm install node-fetch
```
- Create a folder for your shortcodes: For example, /src/shortcodes.
- Download or copy the tubeFrame.js file into the created folder.
- Configure Eleventy to use tubeFrame:
- Include the module in your .eleventy.js file:
```javascript
const tubeFrame = require("./src/shortcodes/tubeFrame");

module.exports = function (eleventyConfig) {
  // Other shortcodes and configurations

  eleventyConfig.addNunjucksAsyncShortcode("tubeFrame", tubeFrame);

  // Other configurations
};
```
## Usage

Once configured, you can use the tubeFrame shortcode in your Nunjucks templates to embed YouTube videos. Here are some usage examples:
Embedding the Video

 ```@param {string} src``` - YouTube video id (es. dQw4w9WgXcQ).
 ```@param {string} [thmb]``` - If ```TRUE``` returns only the video's thumbnail.
 ```@param {string} [outputDir="./public/assets/images"]``` - Output directory for the downloaded images.
 ```@param {string} [baseDir=__dirname]``` - Root directory.
 ```@returns {Promise<string>}``` - HTML snippet.


To embed a YouTube video, use the shortcode with the video URL:

```html
{% tubeFrame "dQw4w9WgXcQ", true, "./custom/images/thumbnails", "./src" %}

```

```javascript
const tubeFrame = require('./src/shorthands/tubeFrame');


(async () => {
  const html = await tubeFrame('dQw4w9WgXcQ', true, './images/thumbnails', process.cwd());
  console.log(html);
})();
```

### Displaying the Thumbnail

If you prefer to display only the video thumbnail, you can add the thmb option:

```html
{% tubeFrame "https://www.youtube.com/embed/mfhBM_Yay6w" "thmb" %}
```

In this case, tubeFrame will download the video thumbnail and display it as an image instead of directly embedding the video.

## Configuration

The tubeFrame module supports the following parameters:
- src (Required): The URL of the YouTube video.
- thmb (Optional): If specified, shows the video thumbnail instead of embedding the video.

## License

This project is licensed under the MIT License.
## Examples

Here are some examples of how the tubeFrame module can be used in an Eleventy project:
Video Template Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Video Example</title>
</head>
<body>
  <h1>My YouTube Video</h1>
  {% tubeFrame "https://www.youtube.com/embed/mfhBM_Yay6w" %}
</body>
</html>

```
## Thumbnail Template Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Thumbnail Example</title>
</head>
<body>
  <h1>Video Thumbnail</h1>
  {% tubeFrame "https://www.youtube.com/embed/mfhBM_Yay6w" "thmb" %}
</body>
</html>

```
## Resources
- Eleventy Documentation
- YouTube API

## Future dev
✗ change "thmb" to choose between 0~3 thumbnails
✗ direct interface with Image plugin
