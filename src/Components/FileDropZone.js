import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

function FileDropZone({ onDropFiles }) {
  const [paths, setPaths] = useState([]);
  const onDrop = useCallback(acceptedFiles => {

    acceptedFiles = acceptedFiles.map(f => {
      let url = URL.createObjectURL(f)
      return { _id: null, name: f.path, url, data: f }
    }
    );
    setPaths(acceptedFiles);
    onDropFiles(acceptedFiles);
  }, [setPaths])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })
  console.log(paths);
  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div style={{backgroundColor: 'lightgrey', minHeight: '100px', margin:'auto', display: 'inline-block'}} >
          {
            <p>Drop the files here ...</p>
        }
        </div>
      </div>
    </>
  )
}

export { FileDropZone }