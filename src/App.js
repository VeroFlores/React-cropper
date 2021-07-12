import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';


export default function App() {
  const [upImg, setUpImg] = useState();
  const [imageName, setimageName] = useState(null);
  const imgRef = useRef(null);

  const [crop, setCrop] = useState({ unit: '%', width: 50, aspect: 1 / 1 });

  const [croppedImageUrl, setcroppedImageUrl] = useState(null);
  
  const [croppedImage, setcroppedImage] = useState(null)

  const onSelectFile = (e) => {

    if (e.target.files && e.target.files.length > 0) {
      setimageName(e.target.files[0].name);
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };


  const dataURLtoFile = (dataurl, filename) => {

    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
            
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    const croppImage = new File([u8arr], filename, {type:mime});
    setcroppedImage(croppImage) 
}

const onLoad = useCallback((img) => {
  imgRef.current = img;
}, []);

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    
    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
     )
     const reader = new FileReader()
     canvas.toBlob(blob => {
         reader.readAsDataURL(blob)
         reader.onloadend = () => {
             dataURLtoFile(reader.result,imageName)
  };
});
  };


  const onCropComplete = (crop) =>{

    if (imgRef.current && crop.width && crop.height) {

      const croppImageUrl = getCroppedImg(imgRef.current, crop);
      setcroppedImageUrl(croppImageUrl)

  }
  };
  const handleSubmit = e => {
  console.log(croppedImage)
    e.preventDefault()

    const formData = new FormData()
        
    //formData.append('user[id]', user.id)
    formData.append('user[profile_pic]', croppedImage)

    //addPhotoToUser(user, formData)
};

const onImageLoaded = image => {
  imgRef.current = image
}

  return (
    <div className="App">
      <div>
        <input type="file" accept="image/*" onChange={onSelectFile} />
      </div>
      <ReactCrop
        src={upImg}
        onImageLoaded={onLoad}
        crop={crop}
        onChange={(c) => setCrop(c)}
        onComplete={onCropComplete}
      />
      <button onClick={handleSubmit}>Guardar</button>
    </div>
  );
}
