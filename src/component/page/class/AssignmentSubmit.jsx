import React from 'react';
import { useParams } from 'react-router-dom';

const ClassAssignmentSubmit = () => {
    const { lectureId, videoId } = useParams();

    return (
        <div>
            <h1>과제 제출</h1>
            <p>강의 ID: {lectureId}</p>
            <p>비디오 ID: {videoId}</p>
            {/* Add your assignment submission form here */}
        </div>
    );
};

export default ClassAssignmentSubmit;