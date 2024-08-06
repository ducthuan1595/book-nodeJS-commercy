const { createCanvas, loadImage } = require('canvas');

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function generateAvatar(name) {
  const canvas = createCanvas(100, 100);
  const ctx = canvas.getContext('2d');

  // Set the background color
  const backgroundColor = getRandomColor();
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the first character of the name
  ctx.font = '48px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name.charAt(0).toUpperCase(), canvas.width / 2, canvas.height / 2);

  // Return the avatar as a buffer
  return canvas.toBuffer();
}

module.exports = {
    generateAvatar
}
