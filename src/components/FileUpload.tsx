import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
} from "./ui/file-upload";

type FileUploadProps = {
  files: [];
  setFiles: (files: any) => void;
};
export default function FileUpload({ files, setFiles }: FileUploadProps) {
  return (
    <FileUploadRoot
      maxFiles={5}
      onFileAccept={(file) => {
        setFiles(file.files);
      }}
    >
      <FileUploadDropzone
        label="Drag and drop here to upload"
        description=".png, .jpg up to 5MB"
      />
      <FileUploadList files={files} />
    </FileUploadRoot>
  );
}
