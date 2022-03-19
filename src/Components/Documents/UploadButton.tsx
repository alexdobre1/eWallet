import UploadFileIcon from '@mui/icons-material/UploadFile';
import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { ChangeEvent } from 'react';

import { AuthType, useAuth } from '../../Contexts/AuthContext';
import { db } from '../../Firebase/config';
import { handleUpload } from '../../Utils/Upload';

const Input = styled('input')({
  display: 'none',
});

const UploadButton = ({
  dbKey,
  getDB,
}: {
  dbKey: string;
  getDB: () => void;
}) => {
  const { user } = useAuth() as AuthType;

  return (
    <label
      htmlFor="contained-button-file"
      style={{ position: 'absolute', bottom: '10%', right: '10%' }}
    >
      <Input
        accept="application/pdf"
        id="contained-button-file"
        multiple
        type="file"
        onChange={(e) => {
          const docRef = doc(db, 'users', user.uid);
          const file = handleUpload(e, 'documents');
          updateDoc(docRef, {
            [dbKey]: arrayUnion(file),
          });
          getDB();
        }}
      />
      <IconButton
        color="primary"
        aria-label="upload"
        component="span"
        disableRipple={true}
      >
        <UploadFileIcon sx={{ fontSize: 50, color: '#F1DAC4' }} />
      </IconButton>
    </label>
  );
};

export default UploadButton;
