import React, {BaseSyntheticEvent, useState} from 'react';
import logo from './logo.svg';
import './App.css'; 
import axios from 'axios'



interface ImageData {
  image: any,
  description: string
}

async function postImage({image, description}: ImageData){
  console.log("test")
  const formData = new FormData();
  formData.append('image', image);
  formData.append('description', description);

  const result = await axios.post('http://localhost:3000/customers/uploadImage', 
    formData, 
    {headers: {'Content-Type': 'multipart/form-data'}});

  return result.data;
}


function App() {
  const [file, setFile] = useState();
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File[]>([]);

  const submit = async (event: BaseSyntheticEvent) => {
    event.preventDefault();
    const result = await postImage({image: file, description});
    setImage([result.image, ...image])
  }

  const fileSelected = (event: BaseSyntheticEvent) => {
    setFile(event.target.files[0])
  }


  return (
    <div className="App">
      <form onSubmit={submit}>
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <input value={description} onChange={e => setDescription(e.target.value)} type="text" placeholder="file name"></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
