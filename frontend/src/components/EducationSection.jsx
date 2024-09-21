/* eslint-disable react/prop-types */

import { useState } from "react";
import { School, X } from "lucide-react";


const EducationSection = ({ userData, isOwnProfile, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newEducation, setNewEducation] = useState({
        school: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
    });
    const [educations, setEducations] = useState(userData.education || []);

    const handleAddEducation = () => {
        if (newEducation.school && newEducation.degree && newEducation.fieldOfStudy && newEducation.startYear) {
            setEducations((prevEducations) => [...prevEducations, newEducation]);
            setNewEducation({
                school: "",
                degree: "",
                fieldOfStudy: "",
                startYear: "",
                endYear: "",
            });
        }
    };
    const handleDeleteEducation = (id) => {
        setEducations(educations.filter((edu) => edu._id !== id));
    };
    
    const handleSave = () => {
        onSave({ education: educations });
        setIsEditing(false);
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Education</h2>
            {educations.map((edu) => (
                <div key={edu._id} className="mb-4 flex justify-between items-start">
                    <div className="flex items-start">
                        <School size={20} className="mr-2 mt-1" />
                        <div>
                            <h3 className="font-semibold">{edu.degree}</h3>
                            <p className="text-gray-600">{edu.fieldOfStudy}</p>
                            <p className="text-gray-500">{edu.school}</p>
                            <p className="text-gray-400 text-sm">
                                {edu.startYear} - {edu.endYear || "Present"}
                            </p>
                        </div>
                    </div>
                    {isEditing && (
                        <button 
                            className="text-red-500"
                            onClick={() => handleDeleteEducation(edu._id)}
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
            ))}
            {isEditing && (
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Degree"
                        value={newEducation.degree}
                        onChange={(e) => setNewEducation((prev) => ({...prev, degree: e.target.value}))}
                        className="w-full p-2 border rounded mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Field of Study"
                        value={newEducation.fieldOfStudy}
                        onChange={(e) => setNewEducation((prev) => ({...prev, fieldOfStudy: e.target.value}))}
                        className="w-full p-2 border rounded mb-2"
                    />
                    <input 
                        type="text" 
                        placeholder="School"
                        value={newEducation.school}
                        onChange={(e) => setNewEducation((prev) => ({...prev, school: e.target.value}))}
                        className="w-full p-2 border rounded mb-2"
                    />
                    <input 
                        type="number" 
                        placeholder="Start Year"
                        value={newEducation.startYear}
                        onChange={(e) => setNewEducation((prev) => ({...prev, startYear: e.target.value}))}
                    />
                    <input 
                        type="number" 
                        placeholder="End Year (optional)"
                        value={newEducation.endYear}
                        onChange={(e) => setNewEducation((prev) => ({...prev, endYear: e.target.value}))}
                    />
                    <button 
                        className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
                        onClick={handleAddEducation}
                    >
                        Add Education
                    </button>
                </div>
            )}
            {isOwnProfile && (
                <>
                    {isEditing ? (
                        <button 
                            className="mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
                            onClick={handleSave}
                        >Save Changes</button>
                    ) : (
                        <button 
                            className="mt-4 text-primary hover:text-primary-dark transition duration-300"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Education
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default EducationSection;