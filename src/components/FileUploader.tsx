import React, { useState, ChangeEvent } from "react";
import { Button, Box, Typography, Grid2 } from "@mui/material";

interface UploadProps {
  uploadLabel: string;
  onUpload: (file: File) => void;
}

const FileUploader: React.FC<UploadProps> = ({ uploadLabel, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 1,
        border: "1px dashed grey",
        borderRadius: 0,
      }}
    >
      <Typography gutterBottom>{uploadLabel}</Typography>
      <input
        type="file"
        id="file-upload"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Grid2 columns={2}>
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            sx={{
              margin: 1,
            }}
          >
            Choose File
          </Button>
        </label>

        <Button variant="contained" component="span" onClick={handleUpload}>
          Upload
        </Button>
      </Grid2>
      {selectedFile && (
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          {selectedFile.name}
        </Typography>
      )}
    </Box>
  );
};

export default FileUploader;
