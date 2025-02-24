import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from "../../api/api";
import { UsersContext } from '../../contexts/usersContext';

const AssignmentShowBox = ({content, files, setCanEdit, submissionId, setIsDeleteModalOpen}) => {
    const { assignmentId } = useParams();
    const { user } = useContext(UsersContext);

    useEffect(() => {
        setCanEdit(false);
    }, [assignmentId]);

    const handleDelete = async () => {
        const deleteResponse = await api.put(`/assignments/${assignmentId}/submissions/delete/${submissionId}/${user.userId}`);
        if(deleteResponse.data.success){
            setIsDeleteModalOpen(true);
        }
    }

    const changeMode = async () => {
        setCanEdit(true);
    }
    
    const OnClickImage = async (e, fileId) => {
        e.preventDefault();
        
        const fileToDownload = files.find((file) => file.id === fileId);
        if (!fileToDownload) {
            console.log('파일을 찾을 수 없습니다.');
            return;
        }
    
        try {
            const response = await api.get("/files/download", {
                params: { 
                    fileUrl: fileToDownload.fileUrl
                },
            });
            
            const presignedUrl = response.data;
            const fileResponse = await fetch(presignedUrl);
    
            const headers = fileResponse.headers;
            const disposition = headers.get('content-disposition');

            let filename = fileToDownload.name;
            if (disposition) {
                const filenameRegex = /filename\*=UTF-8''([^;]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches && matches[1]) {
                    filename = decodeURIComponent(matches[1]);
                }
            }
    
            const arrayBuffer = await fileResponse.arrayBuffer();
            const fileExtension = filename.split('.').pop().toLowerCase();
            let mimeType = 'application/octet-stream';
            console.log('Content-Disposition:', disposition);
    
            if (fileExtension === 'pdf') {
                mimeType = 'application/pdf';
            } else if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
                mimeType = `image/${fileExtension}`;
            }
    
            const blob = new Blob([arrayBuffer], { type: mimeType });
        
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
    
        } catch (error) {
            alert("파일을 제출한 이후 다운로드를 시도해주세요.");
        }
    };

    return (
        <Wrapper>
            <Box>
                <FormTitle>내용</FormTitle>
                <EditorContainer>
                    {content}
                </EditorContainer>
            </Box>
            <Box>
                <FormTitle>파일</FormTitle>
                    {files && files.map((file) => (
                        <ImageItemContainer>
                        <ImageItem 
                            key={file.fileUrl} 
                            title={file.fileName}
                        >
                            <ImageText title={file.fileName} onClick={(e) => OnClickImage(e, file.id)}>{file.name}</ImageText>
                        </ImageItem>
                        </ImageItemContainer>
                    ))}
            </Box>
            <SubmitButton onClick={handleDelete}>삭제하기</SubmitButton>
            <SubmitButton onClick={changeMode}>수정하기</SubmitButton>
        </Wrapper>
    );
};

const Box = styled.div`
    gap: 10px;
`

const FormTitle = styled.div`
    font-size: 17px;
    font-weight: 700;
    padding: 0px 10px;
    margin-top: 5px;
`;

const Wrapper = styled.div`
    border-radius: 20px;
    background-color: #FFFFFF;
    height: 70vh;
    margin-bottom: 50px;
    padding: 10px;
`

const EditorContainer = styled.div`
    border-radius: 8px;
    overflow: hidden;
    margin-top: 10px;
    height: 18vh;
    margin: 10px;
    background-color: #F6F7F9;
    padding: 10px;
`;

const ImageItemContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 10px;
    margin: 10px;
    padding-bottom: 5px;
    background-color: #F6F7F9;
    border-radius: 8px;
    height: 40px;
`;

const ImageItem = styled.div`
    display: flex;
    align-items: center;
    background-color: #F6F7F9;
    padding: 5px;
    justify-content: space-between;
    border-radius: 8px;
    text-overflow: ellipsis;
`;

const ImageText = styled.div`
    margin-right: 3px;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
`;

const SubmitButton = styled.button`
    float: right;
    padding: 8px 20px;
    background-color: #FF4747;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    margin-right: 10px;
`;

export default AssignmentShowBox;