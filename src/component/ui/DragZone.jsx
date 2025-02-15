
import { useContext, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import Cloud from "../img/icon/cloud.svg";

const ClassAssignmentSubmit = ({ setFiles }) => {
    const [localFiles, setLocalFiles] = useState([]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (acceptedFiles) => {
        setLocalFiles((prevFiles) => [
          ...prevFiles,
          ...acceptedFiles.map( (file) => ({
            id: prevFiles.length + 1,
            object: file,
          })),
        ]);
      },
      accept: {
        'image/*': [".jpeg", ".jpg", ".png"],
        'application/pdf': [".pdf"],
      }
    });

    useEffect(() => {
        if (setFiles) {
            setFiles(localFiles);
        }
    }, [localFiles, setFiles]);

    return(
        <UploadContainer
            {...getRootProps()}
            borderColor={isDragActive ? 'gray.500' : 'gray.500'}
            bg={isDragActive ? 'purple.300' : 'gray.600'}
            color={isDragActive ? 'gray.800' : 'white'}
            borderStyle={isDragActive ? 'dashed' : 'solid'}
        >
            <input {...getInputProps()} style={{ display: 'none' }} />
            {isDragActive ? (
                <FileContainer>
                    <FileLargeText>파일을 첨부하세요.</FileLargeText>
                </FileContainer>
                ) : (
                <FileContainer>
                    <Icon 
                        className="cloud-icon material-icons" 
                        src={Cloud} 
                        alt="delete icon" 
                    />
                    <FileSmallText>PDF, PNG, JPG or JPEG</FileSmallText>
                    <FileLargeText>파일을 선택하거나 드래그해주세요.</FileLargeText>
                </FileContainer>
            )}
        </UploadContainer>

    )
};

const UploadContainer = styled.div`
    margin-top: 10px;
    height: 18vh;
    margin: 10px;
    background-color: #F6F7F9;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Icon = styled.img`
  width: 46px;
  height: 21px;
  cursor: pointer;
`;

const FileContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const FileSmallText = styled.div`
    margin-top: 5px;
    color: #AAAAAA;
    font-size: 12px;
    font-weight: 700;
`;

const FileLargeText = styled.div`
    color: #000000;
    font-size: 14px;
    font-weight: 700;
`;

export default ClassAssignmentSubmit;