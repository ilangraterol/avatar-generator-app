import { useState } from 'react';

function useStickerApiRequest(apiKey) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [images, setImages] = useState(null);

  fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}`)
    .then(response => response.json())
      .then(data => setData(data))      
    .catch(error => setError(error));
    console.log(data);
  return { data, error };
}

export default useStickerApiRequest;



// https://api.giphy.com/v1/gifs/trending?api_key=Mez8HUk91MVfdP9Uh7INaTOsdJqDH52Q&limit=5&rating=g