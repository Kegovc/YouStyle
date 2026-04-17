
const mapZodical = {
  "acuario": ["01-20 00:00:00", "02-20 00:00:00"]
}

String.prototype.toCapitalize = function () {
  //debugger
  console.log(this)
  return this
}

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});


function validZodiaco(date) {
  for (let signo in mapZodical) {
    const [start, end] = mapZodical[signo]
    const dateStart = new Date(`${(new Date()).getFullYear().toString()}-${start}`)
    const dateEnd = new Date(`${(new Date()).getFullYear().toString()}-${end}`)
    if (dateStart <= date && date < dateEnd) {
      return signo
    }
  }
  return 'N/A'
}


function cb(e) {
  //debugger
  e.target.setCustomValidity("");
  e.target.removeEventListener('input', cb)
}

function setError(id, text) {
  document.querySelector(`#i-${id}-error`).textContent = text
  const input = document.querySelector(`#i-${id}`)
  input.setCustomValidity(document.querySelector(`#i-${id}-error`).textContent);
  input.addEventListener('input', cb)
}

function clearPanel() {
  document.querySelector('#Name').textContent = 'Nombre'
  document.querySelector('#Age').textContent = 'Edad'
  document.querySelector('#Zodiac').textContent = 'Zodiaco'
  for (let img of [...document.querySelectorAll('#YourEssence ul li img')]) {
    img.src = ''
  }
}


function valid(event) {
  
  clearPanel()
  event.preventDefault()
  
  const formData = new FormData(event.target);
  let valid = true
  //validar
  let i = 0;
  const arr = []
  // for (let key of [...formData.keys()]) {
  //   if (formData.get(key) instanceof File) {
  //     if (formData.get(key).size === 0) {
  //       //debugger
  //       valid = false
  //       setError(key, `La imagen '${document.querySelector(`#i-${key}`).parentElement.querySelector('label').textContent}' es obligatorio`)
  //     } else {
  //       arr.push(
  //         toBase64(formData.get(key)).then(src => { return [key, src] })
  //       )
  //     }
  //   }
  // }
  // Promise.allSettled(arr).then(entries => {
  //   setTimeout(() => {
  //     entries.filter(ff => ff.status !== 'rejected').map(m => m.value).forEach(([key, src]) => {
  //       document.querySelector(`#${key.toCapitalize()}>img`).src = src
  //     })
  //   }, 1000)
  // })
  if(formData.get('animal').size){
   toBase64(formData.get('animal')).then(src=>document.querySelector('#Animal>img').src=src)
  }else {
    setError('animal', `La imagen '${document.querySelector(`#i-animal`).parentElement.querySelector('label').textContent}' es obligatorio`)
    valid = false
  }

  if (!formData.get('name')) {// formData.get('name')==""
    setError('name', "El campo 'Nombre' es obligatorio")
    // document.querySelector('#i-name-error').textContent = "El campo 'Nombre' es obligatorio"
    // const input = document.querySelector('#i-name')
    // input.setCustomValidity(document.querySelector('#i-name-error').textContent);
    // input.addEventListener('input',cb)
    valid = false
  }
  if (!formData.get('age')) {
    setError('age', "El campo 'Fecha de nacimiento' es obligatorio")
    // document.querySelector('#i-x-error').textContent = "El campo 'Fecha de nacimiento' es obligatorio"
    // const input = document.querySelector('#i-age')
    // input.setCustomValidity(document.querySelector('#i-age-error').textContent);
    // input.addEventListener('input',cb)
    valid = false
  }

  if (valid) {
    document.querySelector('#Name').textContent = formData.get('name')
    const now = new Date()
    const age = new Date(`${formData.get('age')} 00:00:00`)
    //2000-01-31
    //01234
    //2027
    //2027 + -01-31
    //2027-01-31
    const birthDay = new Date(`${(new Date()).getFullYear().toString()}${formData.get('age').slice(4)} 00:00:00`)
    const signo = validZodiaco(birthDay)
    const diff = (now - age) / 1000 / 60 / 60 / 24 / 365
    console.log(diff)
    document.querySelector('#Age').textContent = Math.floor(diff).toString()
    document.querySelector('#Zodiac').textContent = signo.toCapitalize()
    //debugger
    document.querySelector('#YourEssence').scrollIntoView({ behavior: 'smooth' })

    // event.target.reset()
    download()
  }

  return false;
}



function download() {
  setTimeout(() => {
    const node = document.getElementById('YourEssence');
    node.style.setProperty('--color',document.querySelector('#i-color-picker').value)
    node.classList.add('snap')
    node.querySelectorAll('img').forEach(img => {
      if (!img.src || img.src === window.location.href) {
        img.remove();
      }
    });
    htmlToImage
      .toPng(node)
      .then((dataUrl) => {
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = "YourEssence.png"
        a.click()
        // document.querySelector('#Output').src = dataUrl
      })
      .catch((err) => {
        //debugger
        console.error('oops, something went wrong!', err);
      }).finally(() => {
        node.classList.remove('snap')
        node.style.removeProperty('--color')
        node.querySelectorAll('article > ul > li:not(:has(img))').forEach(itm => {
          const img = document.createElement('img')
          img.alt = ""
          img.src = ""
          itm.insertBefore(img, itm.firstChild);
        })
      });
  }, 5000)
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
    
      document.querySelector('#i-color-picker').value = maxColor
      console.log('Color predominante:', maxColor);
      debugger
    };

    img.src = URL.createObjectURL(file);
  });
})
