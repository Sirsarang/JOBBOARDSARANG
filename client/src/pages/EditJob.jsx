import React, {useEffect, useState} from "react";
import PostJobForm from "../components/JobFrom";
import { useParams } from "react-router-dom";

const EditJob = () => {
  const { id } = useParams();
  const [jobData, setJobData] = useState({});
  useEffect(() => {
    const fetchJob = async () => {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Convert the data.tags, data.requiredSkills to a string if it's an array
        if (Array.isArray(data.tags)) {
            data.tags = data.tags.join(", ");
        }
        if (Array.isArray(data.requiredSkills)) {
            data.requiredSkills = data.requiredSkills.join(", ");
        }

      setJobData(data);
    };
    fetchJob();
  }, [id]);

  return <PostJobForm mode="edit" jobData={jobData} jobId={id} />;
};

export default EditJob;
