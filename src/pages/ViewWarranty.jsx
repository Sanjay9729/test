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
} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';

const ViewWarranty = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State to hold the search term

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

  // Function to handle search
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  // Log submission data for debugging
  console.log("Submissions Data:", submissions);

  // Filter submissions based on search term
  const filteredSubmissions = submissions.filter((item) => {
    const lowerCaseSearchTerm = searchTerm.trim().toLowerCase(); // Trim spaces and lowercase for case-insensitive comparison

    // Handle undefined/null or empty values by falling back to empty strings
    const fullName = item.full_name ? item.full_name.toLowerCase() : '';
    const email = item.email ? item.email.toLowerCase() : '';
    const product = item.selected_product ? item.selected_product.toLowerCase() : '';
    const phone = item.phone ? item.phone.toLowerCase() : '';

    // Log what we are comparing for debugging purposes
    console.log("Comparing:", lowerCaseSearchTerm, "to Full Name:", fullName);

    // Check if any of the fields include the search term (including partial matching)
    return (
      fullName.includes(lowerCaseSearchTerm) || // Search by full name (partial match)
      email.includes(lowerCaseSearchTerm) || // Search by email
      product.includes(lowerCaseSearchTerm) || // Search by product
      phone.includes(lowerCaseSearchTerm) // Search by phone
    );
  });

  const rows = filteredSubmissions.map((item, index) => (
    <IndexTable.Row
      id={item.id || index.toString()}
      key={item.id || index}
      position={index}
    >
      {/* Full Name Column */}
      <IndexTable.Cell>
        <Box paddingBlock="300">
          <Text as="span" variant="bodyLg">{item.full_name || '—'}</Text>
        </Box>
      </IndexTable.Cell>
      {/* Email Column */}
      <IndexTable.Cell>
        <Box paddingBlock="300">
          <Text as="span" variant="bodyLg">{item.email || '—'}</Text>
        </Box>
      </IndexTable.Cell>
      {/* Product Column */}
      <IndexTable.Cell>
        <Box paddingBlock="300">
          <Text as="span" variant="bodyLg">{item.selected_product || '—'}</Text>
        </Box>
      </IndexTable.Cell>
      {/* Phone Column */}
      <IndexTable.Cell>
        <Box paddingBlock="300">
          <Text as="span" variant="bodyLg">{item.phone || '—'}</Text>
        </Box>
      </IndexTable.Cell>
      {/* Address Column */}
      <IndexTable.Cell>
        <Box paddingBlock="300">
          <Text as="span" variant="bodyLg">{item.address || '—'}</Text>
        </Box>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <AppProvider i18n={enTranslations}>
      <Page fullWidth>
        <Box padding="0">
          {/* Search bar */}
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
              <Text variant="bodyLg" as="p">No warranty submissions found.</Text>
            </Box>
          ) : (
            <IndexTable
              itemCount={filteredSubmissions.length}
              selectable={false}
              headings={[
                { title: 'Full Name' }, // Added Full Name heading
                { title: 'Email' },
                { title: 'Product' },
                { title: 'Phone' },
                { title: 'Address' },
              ]}
            >
              {rows}
            </IndexTable>
          )}
        </Box>
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
