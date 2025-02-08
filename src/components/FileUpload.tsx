import { MAX_FILES } from "@/utils/common";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
} from "./ui/file-upload";

type FileUploadProps = {
  setFiles: (files: any) => void;
};
export default function FileUpload({ setFiles }: FileUploadProps) {
  return (
    <FileUploadRoot
      maxFiles={MAX_FILES}
      onFileAccept={(file) => {
        setFiles(file.files);
      }}
    >
      <FileUploadDropzone
        label="Drag and drop here to upload"
        description=".png, .jpg up to 5MB"
      />
      <FileUploadList />
    </FileUploadRoot>
  );
}
