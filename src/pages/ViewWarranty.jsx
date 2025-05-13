// import React, { useEffect, useState } from "react";
// import {
//   Page,
//   Layout,
//   Card,
//   DataTable,
//   Spinner,
//   Text,
//   InlineError,
//   EmptyState,
// } from "@shopify/polaris";

// const ViewWarranty = () => {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetch("https://brilliant-kashata-1d4944.netlify.app/.netlify/functions/getSubmissions")
//       .then((res) => res.json())
//       .then((data) => {
//         if (!Array.isArray(data)) {
//           throw new Error("Unexpected data format");
//         }

//         const formatted = data.map((item) => [
//           item.full_name || "-",
//           item.email || "-",
//           item.phone || "-",
//           item.selected_product || "-",
//           new Date(item.created_at).toLocaleString() || "-",
//         ]);

//         setRows(formatted);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Failed to load data", err);
//         setError("Could not load submissions.");
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <Page title="Warranty Submissions">
//       <Layout>
//         <Layout.Section>
//           <Card sectioned>
//             <Text variant="headingMd" as="h2">
//               Submitted Warranty Forms
//             </Text>

//             {loading && (
//               <div style={{ padding: "20px", textAlign: "center" }}>
//                 <Spinner accessibilityLabel="Loading" size="large" />
//               </div>
//             )}

//             {error && (
//               <div style={{ paddingTop: "20px" }}>
//                 <InlineError message={error} fieldID="data-fetch" />
//               </div>
//             )}

//             {!loading && !error && rows.length === 0 && (
//               <EmptyState
//                 heading="No submissions found"
//                 image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/empty-state.svg"
//               >
//                 <p>There are no warranty submissions yet.</p>
//               </EmptyState>
//             )}

//             {!loading && !error && rows.length > 0 && (
//               <DataTable
//                 columnContentTypes={["text", "text", "text", "text", "text"]}
//                 headings={["Name", "Email", "Phone", "Product", "Date"]}
//                 rows={rows}
//               />
//             )}
//           </Card>
//         </Layout.Section>
//       </Layout>
//     </Page>
//   );
// };

// export default ViewWarranty;


// static data 
// import React from 'react';
// import './SubmissionList.css';

// const ViewWarranty = () => {
//   const submissions = [
//     {
//       id: 1,
//       full_name: 'Alice Johnson',
//       email: 'alice@example.com',
//       selected_product: 'Smart Blender X500',
//       phone: '123-456-7890',
//       address: '123 Maple Street, Springfield',
//       image_url: 'https://via.placeholder.com/100',
//       created_at: '2025-05-06 07:03:10',
//     },
//     {
//       id: 2,
//       full_name: 'Bob Smith',
//       email: 'bob@example.com',
//       selected_product: 'Air Purifier Z300',
//       phone: '987-654-3210',
//       address: '456 Oak Avenue, Riverdale',
//       image_url: 'https://via.placeholder.com/100',
//       created_at: '2025-05-06 06:06:37',
//     },
//     {
//       id: 3,
//       full_name: 'Charlie Davis',
//       email: 'charlie@example.com',
//       selected_product: 'Eco Kettle Pro',
//       phone: '555-666-7777',
//       address: '789 Pine Road, Hilltown',
//       image_url: 'https://via.placeholder.com/100',
//       created_at: '2025-05-06 05:49:51',
//     },
//   ];

//   return (
//     <div className="wrapper">
//       <h1 className="heading">Warranty Submissions Test</h1>
//       <div className="table-wrapper">
//         <table className="submissions-table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Product</th>
//               <th>Phone</th>
//               <th>Address</th>
//               <th>Submitted At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {submissions.map((item) => (
//               <tr key={item.id}>

//                 <td>{item.full_name}</td>
//                 <td>{item.email || '—'}</td>
//                 <td>{item.selected_product || '—'}</td>
//                 <td>{item.phone || '—'}</td>
//                 <td>{item.address || '—'}</td>
//                 <td>{item.created_at}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ViewWarranty;


// dynamic data 
import React, { useEffect, useState } from 'react';
import {
  AppProvider,
  Page,
  IndexTable,
  Text,
  Box,
  TextField,
  Button,
  Modal,
  FormLayout,
} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import Papa from 'papaparse';

const ViewWarranty = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch data from Supabase via Netlify function
  useEffect(() => {
    fetch('/.netlify/functions/getSubmissions')
      .then((res) => res.json())
      .then((data) => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching submissions:', error);
        setLoading(false);
      });
  }, []);

  // Filter by search term
  const filteredSubmissions = submissions.filter((item) => {
    const lower = searchTerm.toLowerCase();
    return (
      item.full_name?.toLowerCase().includes(lower) ||
      item.email?.toLowerCase().includes(lower) ||
      item.selected_product?.toLowerCase().includes(lower) ||
      item.phone?.toLowerCase().includes(lower)
    );
  });

  // Handle search bar input
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  // Export to CSV
  const exportToCSV = () => {
    const data = submissions.map((item) => ({
      full_name: item.full_name,
      email: item.email,
      product: item.selected_product,
      phone: item.phone,
      address: item.address,
      created_at: item.created_at,
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'warranty_submissions.csv';
    link.click();
  };

  // Open modal on row click
  const handleRowClick = (item) => {
    setSelectedSubmission({ ...item });
    setModalOpen(true);
  };

  // Handle modal field input
  const handleModalChange = (field, value) => {
    setSelectedSubmission((prev) => ({ ...prev, [field]: value }));
  };

  // Save updates locally + backend
  const handleSave = async () => {
    try {
      const response = await fetch('/.netlify/functions/updateSubmission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedSubmission),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Failed to save to Supabase:', result.error);
        return;
      }

      // Update state in UI
      const updatedList = submissions.map((item) =>
        item.id === selectedSubmission.id ? selectedSubmission : item
      );

      setSubmissions(updatedList);
      setModalOpen(false);
    } catch (error) {
      console.error('Unexpected error saving:', error);
    }
  };

  // Render rows
  const rows = filteredSubmissions.map((item, index) => (
    <IndexTable.Row
      id={item.id || index.toString()}
      key={item.id || index}
      position={index}
    >
      <IndexTable.Cell>
        <Button plain onClick={() => handleRowClick(item)}>
          {item.full_name || '—'}
        </Button>
      </IndexTable.Cell>
      <IndexTable.Cell><Text variant="bodyLg">{item.email || '—'}</Text></IndexTable.Cell>
      <IndexTable.Cell><Text variant="bodyLg">{item.selected_product || '—'}</Text></IndexTable.Cell>
      <IndexTable.Cell><Text variant="bodyLg">{item.phone || '—'}</Text></IndexTable.Cell>
      <IndexTable.Cell><Text variant="bodyLg">{item.address || '—'}</Text></IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <AppProvider i18n={enTranslations}>
      <Page fullWidth title="Warranty Registration">
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '16px' }}>
          <Button onClick={exportToCSV}>Export</Button>
        </div>

        <Box paddingBottom="4">
          <TextField
            label="Search by Name or Details"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter name, email, or product"
          />
        </Box>

        {!loading && filteredSubmissions.length === 0 ? (
          <Box display="flex" justifyContent="center">
            <Text variant="bodyLg">No warranty submissions found.</Text>
          </Box>
        ) : (
          <IndexTable
            itemCount={filteredSubmissions.length}
            selectable={false}
            headings={[
              { title: 'Full Name' },
              { title: 'Email' },
              { title: 'Product' },
              { title: 'Phone' },
              { title: 'Address' },
            ]}
          >
            {rows}
          </IndexTable>
        )}

        {/* Edit Modal */}
        {selectedSubmission && (
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Edit Submission"
            primaryAction={{
              content: 'Save',
              onAction: handleSave,
            }}
            secondaryActions={[
              {
                content: 'Cancel',
                onAction: () => setModalOpen(false),
              },
            ]}
          >
            <Modal.Section>
              <FormLayout>
                <TextField
                  label="Full Name"
                  value={selectedSubmission.full_name}
                  onChange={(value) => handleModalChange('full_name', value)}
                />
                <TextField
                  label="Email"
                  value={selectedSubmission.email}
                  onChange={(value) => handleModalChange('email', value)}
                />
                <TextField
                  label="Product"
                  value={selectedSubmission.selected_product}
                  onChange={(value) => handleModalChange('selected_product', value)}
                />
                <TextField
                  label="Phone"
                  value={selectedSubmission.phone}
                  onChange={(value) => handleModalChange('phone', value)}
                />
                <TextField
                  label="Address"
                  value={selectedSubmission.address}
                  onChange={(value) => handleModalChange('address', value)}
                />
              </FormLayout>
            </Modal.Section>
          </Modal>
        )}
      </Page>
    </AppProvider>
  );
};

export default ViewWarranty;
































// src/pages/ViewWarranty.jsx
// import React, { useEffect, useState } from 'react';
// import './SubmissionList.css';

// const ViewWarranty = () => {
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch('/.netlify/functions/getSubmissions')
//       .then((res) => res.json())
//       .then((data) => {
//         setSubmissions(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching submissions:", error);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div>
//       <h1>Warranty Submissions</h1>
//       <div className="submission-list">
//         {submissions.map((item) => (
//           <div className="submission-card" key={item.id}>
//             <div className="submission-image">
//               <img
//                 src={item.image_url || 'https://placehold.co/100x100?text=No+Image'}
//                 alt="User"
//                 onError={(e) => (e.target.src = 'https://placehold.co/100x100?text=No+Image')}
//               />
//             </div>
//             <div className="submission-details">
//               <p><strong>Name:</strong> {item.full_name || 'N/A'}</p>
//               <p><strong>Product:</strong> {item.selected_product || 'N/A'}</p>
//               <p><strong>Phone:</strong> {item.phone || 'N/A'}</p>
//               <p><strong>Address:</strong> {item.address || 'N/A'}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ViewWarranty;
