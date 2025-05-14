import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AppProvider,
  Page,
  TextField,
  Button,
  FormLayout,
  Layout,
  Frame,
} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';

const EditWarranty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/.netlify/functions/getSubmissionById?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setSubmission(data);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (field, value) => {
    setSubmission(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const response = await fetch("/.netlify/functions/updateSubmission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });

    const result = await response.json();
    if (!result.error) {
      alert("✅ Saved!");
      navigate("/");
    } else {
      alert("❌ Failed");
    }
  };

  if (loading || !submission) return <div>Loading...</div>;

  return (
    <AppProvider i18n={enTranslations}>
      <Frame>
        <Page title="Edit Warranty Submission">
          <Layout>
            <Layout.Section>
              <FormLayout>
                <TextField label="Full Name" value={submission.full_name} onChange={(val) => handleChange('full_name', val)} />
                <TextField label="Email" value={submission.email} onChange={(val) => handleChange('email', val)} />
                <TextField label="Product" value={submission.selected_product} onChange={(val) => handleChange('selected_product', val)} />
                <TextField label="Phone" value={submission.phone} onChange={(val) => handleChange('phone', val)} />
                <TextField label="Address" value={submission.address} onChange={(val) => handleChange('address', val)} />
                <Button primary onClick={handleSave}>Save</Button>
                <Button onClick={() => navigate('/')}>Cancel</Button>
              </FormLayout>
            </Layout.Section>
          </Layout>
        </Page>
      </Frame>
    </AppProvider>
  );
};

export default EditWarranty;
