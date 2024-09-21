/* eslint-disable react/prop-types */

import { X } from "lucide-react";
import { useState } from "react";

const SkillSection = ({ userData, isOwnProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState(userData.skills || []);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    const toBeAdded = newSkill.trim();

    if (toBeAdded && !skills.includes(toBeAdded)) {
      setSkills((prev) => [...prev, toBeAdded]);
      setNewSkill("");
    }
  };

  const handleDeleteSkill = (index) => {
    setSkills((prev) => prev.filter((_, i) => i!== index));
  };

  const handleSave = () => {
    onSave({ skills });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Skills</h2>
      <div className="flex flex-wrap">
        {skills.map((skill, index) => (
          <span 
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm mr-2 mb-2 flex items-center"
            key={index}
          >
            {skill}
            {isEditing && (
              <button 
                className="text-red-500 ml-2"
                onClick={() => handleDeleteSkill(index)}
              >
                <X size={14} />
              </button>
            )}
          </span>
        ))}
      </div>
      {isEditing && (
        <div className="mt-4 flex">
          <input
            type="text"
            placeholder="New Skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-grow p-2 border rounded-1"
          />
          <button
            className="bg-primary text-white py-2 px-4 rounded-r hover:bg-primary-dark transition duarion-300"
            onClick={handleAddSkill}
          >Add Skill</button>
        </div>
      )}
      {isOwnProfile && (
        <>
          {isEditing ? (
            <button 
              className="mt-4 bg-primary text-white py-2 rounded hover:bg-primary-dark transition duration-300"
              onClick={handleSave}
            >
              Save Changes
            </button>
          ) : (
            <button 
              className="mt-4 text-primary hover:text-primary-dark transition duration-300"
              onClick={() => setIsEditing(true)}
            >
              Edit Skills
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default SkillSection;