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
// import React, { useEffect, useState } from 'react';
// import {
//   AppProvider,
//   Page,
//   IndexTable,
//   Text,
//   Box,
//   TextField,
//   Button,
//   Modal,
//   FormLayout,
//   Icon,
// } from '@shopify/polaris';
// import enTranslations from '@shopify/polaris/locales/en.json';
// import Papa from 'papaparse';
// import { SearchIcon } from '@shopify/polaris-icons';

// const ViewWarranty = () => {
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedSubmission, setSelectedSubmission] = useState(null);

//   useEffect(() => {
//     fetch('/.netlify/functions/getSubmissions')
//       .then((res) => res.json())
//       .then((data) => {
//         setSubmissions(data);
//         setLoading(false);
//       });
//   }, []);

//   const handleSearchChange = (value) => setSearchTerm(value);

//   const exportToCSV = () => {
//     const data = submissions.map(({ full_name, email, selected_product, phone, address, created_at }) => ({
//       full_name,
//       email,
//       product: selected_product,
//       phone,
//       address,
//       created_at,
//     }));

//     const csv = Papa.unparse(data);
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'warranty_submissions.csv';
//     link.click();
//   };

//   const handleCSVImport = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     Papa.parse(file, {
//       header: true,
//       skipEmptyLines: true,
//       complete: async (results) => {
//         try {
//           const response = await fetch("/.netlify/functions/importCSVToSupabase", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ data: results.data }),
//           });

//           const result = await response.json();

//           if (result.success) {
//             alert("✅ Import successful");
//             const refreshed = await fetch("/.netlify/functions/getSubmissions");
//             setSubmissions(await refreshed.json());
//           } else {
//             alert("❌ Import failed");
//           }
//         } catch (err) {
//           console.error("Import Error:", err);
//           alert("❌ Unexpected error");
//         }
//       },
//     });
//   };

//   const handleRowClick = (item) => {
//     setSelectedSubmission(item);
//     setModalOpen(true);
//   };

//   const handleModalChange = (field, value) => {
//     setSelectedSubmission((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSave = async () => {
//     const { id, ...fieldsToUpdate } = selectedSubmission;
//     const response = await fetch("/.netlify/functions/updateSubmission", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id, ...fieldsToUpdate }),
//     });
//     const result = await response.json();
//     if (!result.error) {
//       alert("✅ Saved!");
//       setModalOpen(false);
//       const refreshed = await fetch("/.netlify/functions/getSubmissions");
//       setSubmissions(await refreshed.json());
//     } else {
//       alert("❌ Failed");
//     }
//   };

//   // ✅ Smart Search Logic
//   const filteredSubmissions = submissions.filter((item) => {
//     const searchWords = searchTerm.trim().toLowerCase().split(/\s+/);
//     const fieldsToSearch = [
//       item.full_name || '',
//       item.email || '',
//       item.selected_product || '',
//       item.phone || '',
//     ];
//     const fieldText = fieldsToSearch.join(' ').toLowerCase();
//     return searchWords.every((word) => fieldText.includes(word));
//   });

//   const rows = filteredSubmissions.map((item, index) => (
//     <IndexTable.Row
//       id={item.id?.toString() || index.toString()}
//       key={item.id || index}
//       position={index}
//       onClick={() => handleRowClick(item)}
//     >
//       <IndexTable.Cell><Box paddingBlock="3"><Text>{item.full_name || '—'}</Text></Box></IndexTable.Cell>
//       <IndexTable.Cell><Box paddingBlock="3"><Text>{item.email || '—'}</Text></Box></IndexTable.Cell>
//       <IndexTable.Cell><Box paddingBlock="3"><Text>{item.selected_product || '—'}</Text></Box></IndexTable.Cell>
//       <IndexTable.Cell><Box paddingBlock="3"><Text>{item.phone || '—'}</Text></Box></IndexTable.Cell>
//       <IndexTable.Cell><Box paddingBlock="3"><Text>{item.address || '—'}</Text></Box></IndexTable.Cell>
//     </IndexTable.Row>
//   ));

//   return (
//     <AppProvider i18n={enTranslations}>
//       <Page fullWidth>
//         {/* Buttons */}
//         <div style={{
//           display: 'flex',
//           justifyContent: 'flex-end',
//           gap: '10px',
//           marginBottom: '10px',
//         }}>
//           <Button onClick={exportToCSV}>Export</Button>
//           <Button onClick={() => document.getElementById('csvFileInput').click()}>
//             Import CSV
//           </Button>
//           <input
//             id="csvFileInput"
//             type="file"
//             accept=".csv"
//             style={{ display: 'none' }}
//             onChange={handleCSVImport}
//           />
//         </div>

//         {/* Search Input */}
//         <div style={{ marginBottom: '16px' }}>
//           <TextField
//             placeholder="Search by Name"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             clearButton
//             autoComplete="off"
//             prefix={<Icon source={SearchIcon} color="subdued" />}
//           />
//         </div>

//         {/* Table or empty state */}
//         {!loading && filteredSubmissions.length === 0 ? (
//           <Box display="flex" justifyContent="center" padding="8">
//             <Text>No warranty submissions found.</Text>
//           </Box>
//         ) : (
//           <IndexTable
//             itemCount={filteredSubmissions.length}
//             selectable={false}
//             headings={[
//               { title: 'Full Name' },
//               { title: 'Email' },
//               { title: 'Product' },
//               { title: 'Phone' },
//               { title: 'Address' },
//             ]}
//           >
//             {rows}
//           </IndexTable>
//         )}

//         {/* Edit Modal */}
//         {selectedSubmission && (
//           <Modal
//             open={modalOpen}
//             onClose={() => setModalOpen(false)}
//             title="Edit Submission"
//             primaryAction={{ content: 'Save', onAction: handleSave }}
//             secondaryActions={[{ content: 'Cancel', onAction: () => setModalOpen(false) }]}
//           >
//             <Modal.Section>
//               <FormLayout>
//                 <TextField label="Full Name" value={selectedSubmission.full_name} onChange={(val) => handleModalChange('full_name', val)} />
//                 <TextField label="Email" value={selectedSubmission.email} onChange={(val) => handleModalChange('email', val)} />
//                 <TextField label="Product" value={selectedSubmission.selected_product} onChange={(val) => handleModalChange('selected_product', val)} />
//                 <TextField label="Phone" value={selectedSubmission.phone} onChange={(val) => handleModalChange('phone', val)} />
//                 <TextField label="Address" value={selectedSubmission.address} onChange={(val) => handleModalChange('address', val)} />
//               </FormLayout>
//             </Modal.Section>
//           </Modal>
//         )}
//       </Page>
//     </AppProvider>
//   );
// };

// export default ViewWarranty;




// import React, { useEffect, useState } from 'react';

// const ViewWarranty = () => {
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);

//  useEffect(() => {
//   fetch('/.netlify/functions/getAppwriteSubmissions?_=' + new Date().getTime()) // ✅ Prevent caching
//     .then((res) => res.json())
//     .then((data) => {
//       setSubmissions(data);
//       setLoading(false);
//     })
//     .catch((err) => {
//       console.error('Error loading data:', err);
//       setLoading(false);
//     });
// }, []);


//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>Warranty Submissions</h2>
//       {loading ? (
//         <p>Loading...</p>
//       ) : submissions.length === 0 ? (
//         <p>No data found.</p>
//       ) : (
//         <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
//           <thead>
//             <tr>
//               <th>Full Name</th>
//               <th>Email</th>
//               <th>Phone</th>
//               <th>Address</th>
//               <th>Selected Product</th>
//             </tr>
//           </thead>
//           <tbody>
//             {submissions.map((item) => (
//               <tr key={item.$id}>
//                 <td>{item.full_name}</td>
//                 <td>{item.email}</td>
//                 <td>{item.phone}</td>
//                 <td>{item.address}</td>
//                 <td>{item.selected_product}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default ViewWarranty;









// static 14-05-25

// import React, { useState } from 'react';
// import {
//   AppProvider,
//   Page,
//   IndexTable,
//   Text,
//   Box,
//   TextField,
//   Button,
//   Modal,
//   FormLayout,
// } from '@shopify/polaris';
// import enTranslations from '@shopify/polaris/locales/en.json';
// import Papa from 'papaparse';

// const ViewWarranty = () => {
//   const [submissions, setSubmissions] = useState([
//     {
//       id: '1',
//       full_name: 'John Doe',
//       email: 'john@example.com',
//       selected_product: 'Toaster Model X',
//       phone: '123-456-7890',
//       address: '123 Main St, Cityville',
//       created_at: '2024-05-01',
//     },
//     {
//       id: '2',
//       full_name: 'Jane Smith',
//       email: 'jane@example.com',
//       selected_product: 'Blender Pro 9000',
//       phone: '987-654-3210',
//       address: '456 Elm St, Townsville',
//       created_at: '2024-04-20',
//     },
//   ]);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedSubmission, setSelectedSubmission] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);

//   const handleSearchChange = (value) => {
//     setSearchTerm(value);
//   };

//   const exportToCSV = () => {
//     const data = submissions.map((item) => ({
//       full_name: item.full_name,
//       email: item.email,
//       product: item.selected_product,
//       phone: item.phone,
//       address: item.address,
//       created_at: item.created_at,
//     }));

//     const csv = Papa.unparse(data);
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'warranty_submissions.csv';
//     link.click();
//   };

//   const filteredSubmissions = submissions.filter((item) => {
//     const lower = searchTerm.toLowerCase();
//     return (
//       item.full_name?.toLowerCase().includes(lower) ||
//       item.email?.toLowerCase().includes(lower) ||
//       item.selected_product?.toLowerCase().includes(lower) ||
//       item.phone?.toLowerCase().includes(lower)
//     );
//   });

//   const handleRowClick = (item) => {
//     setSelectedSubmission({ ...item });
//     setModalOpen(true);
//   };

//   const handleModalChange = (field, value) => {
//     setSelectedSubmission((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSave = () => {
//     const updated = submissions.map((sub) =>
//       sub.id === selectedSubmission.id ? selectedSubmission : sub
//     );
//     setSubmissions(updated);
//     setModalOpen(false);
//     alert('✅ Saved!');
//   };

//   const rows = filteredSubmissions.map((item, index) => (
//     <IndexTable.Row
//       id={item.id}
//       key={item.id}
//       position={index}
//       onClick={() => handleRowClick(item)}
//     >
//       <IndexTable.Cell><Text variant="bodyLg">{item.full_name || '—'}</Text></IndexTable.Cell>
//       <IndexTable.Cell><Text variant="bodyLg">{item.email || '—'}</Text></IndexTable.Cell>
//       <IndexTable.Cell><Text variant="bodyLg">{item.selected_product || '—'}</Text></IndexTable.Cell>
//       <IndexTable.Cell><Text variant="bodyLg">{item.phone || '—'}</Text></IndexTable.Cell>
//       <IndexTable.Cell><Text variant="bodyLg">{item.address || '—'}</Text></IndexTable.Cell>
//     </IndexTable.Row>
//   ));

//   return (
//     <AppProvider i18n={enTranslations}>
//       <Page fullWidth>
//         <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '16px' }}>
//           <Button onClick={exportToCSV}>Export</Button>
//         </div>

//         <Box paddingBottom="4">
//           <TextField
//             label="Search by Name or Details"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             placeholder="Enter name, email, or product"
//           />
//         </Box>

//         {filteredSubmissions.length === 0 ? (
//           <Box display="flex" justifyContent="center">
//             <Text variant="bodyLg">No warranty submissions found.</Text>
//           </Box>
//         ) : (
//           <IndexTable
//             itemCount={filteredSubmissions.length}
//             selectable={false}
//             headings={[
//               { title: 'Full Name' },
//               { title: 'Email' },
//               { title: 'Product' },
//               { title: 'Phone' },
//               { title: 'Address' },
//             ]}
//           >
//             {rows}
//           </IndexTable>
//         )}

//         {selectedSubmission && (
//           <Modal
//             open={modalOpen}
//             onClose={() => setModalOpen(false)}
//             title="Edit Submission"
//             primaryAction={{
//               content: 'Save',
//               onAction: handleSave,
//             }}
//             secondaryActions={[
//               {
//                 content: 'Cancel',
//                 onAction: () => setModalOpen(false),
//               },
//             ]}
//           >
//             <Modal.Section>
//               <FormLayout>
//                 <TextField
//                   label="Full Name"
//                   value={selectedSubmission.full_name}
//                   onChange={(value) => handleModalChange('full_name', value)}
//                 />
//                 <TextField
//                   label="Email"
//                   value={selectedSubmission.email}
//                   onChange={(value) => handleModalChange('email', value)}
//                 />
//                 <TextField
//                   label="Product"
//                   value={selectedSubmission.selected_product}
//                   onChange={(value) => handleModalChange('selected_product', value)}
//                 />
//                 <TextField
//                   label="Phone"
//                   value={selectedSubmission.phone}
//                   onChange={(value) => handleModalChange('phone', value)}
//                 />
//                 <TextField
//                   label="Address"
//                   value={selectedSubmission.address}
//                   onChange={(value) => handleModalChange('address', value)}
//                 />
//               </FormLayout>
//             </Modal.Section>
//           </Modal>
//         )}
//       </Page>
//     </AppProvider>
//   );
// };

// export default ViewWarranty;





























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






// 21/05/25

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Page,
  Card,
  TextField,
  Layout,
  Box,
  Text,
  Button,
  Modal,
  FormLayout,
  IndexTable,
  LegacyStack
} from '@shopify/polaris';




const ViewWarranty = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/getAppwriteSubmissions?_=' + Date.now());
      const data = await response.json();
      if (Array.isArray(data)) {
        setSubmissions(data);
        setFiltered(data);
        setErrorMsg('');
      } else {
        setErrorMsg('Invalid data format from server.');
      }
    } catch (err) {
      setErrorMsg('Error fetching data.');
    }
    setLoading(false);
  };

  const handleSearch = useCallback((value) => {
    setSearch(value);
    const query = value.toLowerCase().trim();
    if (!query) {
      setFiltered(submissions);
      return;
    }
    const result = submissions.filter((item) =>
      item.full_name?.toLowerCase().includes(query) ||
      item.email?.toLowerCase().includes(query) ||
      item.selected_product?.toLowerCase().includes(query)
    );
    setFiltered(result);
  }, [submissions]);

  const handleRowClick = (index) => {
    const item = filtered[index];
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleModalChange = (field, value) => {
    setSelectedItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const { $id, full_name, email, selected_product, phone, address } = selectedItem;
    try {
      const response = await fetch('/.netlify/functions/updateAppwriteSubmission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: $id, full_name, email, selected_product, phone, address }),
      });
      const result = await response.json();
      if (!result.error) {
        setModalOpen(false);
        fetchData();
      } else {
        alert('Update failed: ' + result.error);
      }
    } catch (error) {
      alert('An error occurred while saving: ' + error.message);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setImportError('');
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setImportError('Please select a CSV file.');
      return;
    }

    setImportLoading(true);
    try {
      const text = await file.text();
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const csvData = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const entry = {};
        headers.forEach((h, i) => {
          entry[h] = values[i] || '';
        });
        return entry;
      });

      const res = await fetch('/.netlify/functions/importToAppwrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: csvData }),
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.error || 'Import failed');
      }

      fetchData();
      e.target.value = '';
    } catch (err) {
      setImportError(err.message || 'Error importing data.');
    }

    setImportLoading(false);
  };

  const handleExport = () => {
    if (filtered.length === 0) {
      alert("No data to export");
      return;
    }

    const header = ['Full Name', 'Email', 'Product', 'Phone', 'Address'];
    const csvRows = [header.join(',')];

    filtered.forEach(item => {
      const row = [
        `"${item.full_name || ''}"`,
        `"${item.email || ''}"`,
        `"${item.selected_product || ''}"`,
        `"${item.phone || ''}"`,
        `"${item.address || ''}"`,
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `warranty_submissions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resourceName = { singular: 'submission', plural: 'submissions' };

  const rowMarkup = filtered.map((item, index) => (
    <IndexTable.Row
      id={item.$id || index.toString()}
      key={item.$id || index}
      position={index}
      onClick={() => handleRowClick(index)}
    >
      <IndexTable.Cell>{item.full_name || '-'}</IndexTable.Cell>
      <IndexTable.Cell>{item.email || '-'}</IndexTable.Cell>
      <IndexTable.Cell>{item.selected_product || '-'}</IndexTable.Cell>
      <IndexTable.Cell>{item.phone || '-'}</IndexTable.Cell>
      <IndexTable.Cell>{item.address || '-'}</IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          {/* BUTTONS RIGHT-ALIGNED */}
                <div style={{ marginBottom: '10px' }}>
            <LegacyStack alignment="center" distribution="trailing" spacing="loose" >
              <Box paddingBlockEnd="4" style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                <Button onClick={() => fileInputRef.current.click()} disabled={importLoading}>
                  {importLoading ? 'Importing...' : 'Import CSV'}
                </Button>
                <Button onClick={handleExport}>Export</Button>
                <input
                  type="file"
                  accept=".csv"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </Box>
            </LegacyStack>
          </div>
          {/* SEARCH FIELD */}
         

          {/* IMPORT ERROR DISPLAY */}
          {importError && (
            <Box paddingBlockEnd="4">
              <Text variant="bodyMd" as="p" color="critical" alignment="right">
                {importError}
              </Text>
            </Box>
          )}

          {/* TABLE */}
          <Card sectioned>
             <Box paddingBlockEnd="4" style={{ marginBottom: '10px' }}>
            <TextField
              placeholder="Search by name, email, or product"
              value={search}
              onChange={handleSearch}
              clearButton
              onClearButtonClick={() => handleSearch('')}
              autoComplete="off"
            />
          </Box>
            {loading ? (
              <Box padding="6" display="flex" justifyContent="center">
                <Text>Loading...</Text>
              </Box>
            ) : errorMsg ? (
              <Box padding="6" display="flex" justifyContent="center">
                <Text color="critical">{errorMsg}</Text>
              </Box>
            ) : (
              <IndexTable
                resourceName={resourceName}
                itemCount={filtered.length}
                selectable={false}
                headings={[
                  { title: 'Full Name' },
                  { title: 'Email' },
                  { title: 'Product' },
                  { title: 'Phone' },
                  { title: 'Address' },
                ]}
              >
                {rowMarkup}
              </IndexTable>
            )}
          </Card>

          {/* MODAL */}
          {selectedItem && (
            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Edit Submission"
              primaryAction={{ content: 'Save', onAction: handleSave }}
              secondaryActions={[{ content: 'Cancel', onAction: () => setModalOpen(false) }]}
            >
              <Modal.Section>
                <FormLayout>
                  <TextField
                    label="Full Name"
                    value={selectedItem.full_name || ''}
                    onChange={(val) => handleModalChange('full_name', val)}
                  />
                  <TextField
                    label="Email"
                    value={selectedItem.email || ''}
                    onChange={(val) => handleModalChange('email', val)}
                  />
                  <TextField
                    label="Product"
                    value={selectedItem.selected_product || ''}
                    onChange={(val) => handleModalChange('selected_product', val)}
                  />
                  <TextField
                    label="Phone"
                    value={selectedItem.phone || ''}
                    onChange={(val) => handleModalChange('phone', val)}
                  />
                  <TextField
                    label="Address"
                    value={selectedItem.address || ''}
                    onChange={(val) => handleModalChange('address', val)}
                  />
                </FormLayout>
              </Modal.Section>
            </Modal>
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ViewWarranty;










