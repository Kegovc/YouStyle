String.prototype.toCapitalize = function () {
  debugger
  console.log(this)
  return this
}

const mapZodical = {
  "acuario": ["01-20 00:00:00", "02-20 00:00:00"]
}

window.addEventListener('load', () => {
  // download()
  document.getElementById('i-color').addEventListener('change', function (e) {
    //debugger
    const file = e.target.files[0];
    const img = new Image();

    img.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const colorCount = {};

      for (let i = 0; i < data.length; i += 4) {
        const factor = 1; // nivel de tolerancia

        const r = (Math.floor(data[i] / factor) * factor).toString(16).padStart(2,'0');
        const g = (Math.floor(data[i + 1] / factor) * factor).toString(16).padStart(2,'0');
        const b = (Math.floor(data[i + 2] / factor) * factor).toString(16).padStart(2,'0');

        const key = `#${r}${g}${b}`;

        colorCount[key] = (colorCount[key] || 0) + 1;
      }

      let maxColor = null;
      let maxCount = 0;

      for (const color in colorCount) {
        if (colorCount[color] > maxCount) {
          maxCount = colorCount[color];
          maxColor = color;
        }
      }
    
      
      console.log('Color predominante:', maxColor);
      debugger
    };

    img.src = URL.createObjectURL(file);
  });
})