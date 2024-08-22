# tubeFrame

tubeFrame is a JavaScript module for Eleventy that handles YouTube embedding and thumbnail management. It can be used to easily embed YouTube videos into your projects, with support for displaying thumbnails as static images when you don't want the video to be directly playable.
## Installation

To use tubeFrame, follow these steps:
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

