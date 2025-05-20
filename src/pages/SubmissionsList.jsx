import React, { useEffect, useState } from 'react';

const SubmissionsList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch('/.netlify/functions/getSubmissions');
        const data = await res.json();
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div>
      <h2>Appwrite Warranty Submissions</h2>
      {loading ? (
        <p>Loading...</p>
      ) : submissions.length > 0 ? (
        submissions.map((item) => (
          <div
            key={item.$id}
            style={{
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
            }}
          >
            <p><strong>Name:</strong> {item.full_name}</p>
            <p><strong>Email:</strong> {item.email}</p>
            <p><strong>Phone:</strong> {item.phone}</p>
            <p><strong>Address:</strong> {item.address}</p>
            <p><strong>Product:</strong> {item.selected_product}</p>
          </div>
        ))
      ) : (
        <p>No submissions found.</p>
      )}
    </div>
  );
};

export default SubmissionsList;
