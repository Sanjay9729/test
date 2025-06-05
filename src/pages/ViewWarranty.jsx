
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

  const APPWRITE_BUCKET_ID = "683e80fc0019228a6dfa";
  const APPWRITE_ENDPOINT = "https://appwrite.appunik-team.com/v1";
  const APPWRITE_PROJECT_ID = "68271c3c000854f08575";

  const getImagePreviewURL = (fileId) =>
  `${APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`;




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
    const {
      $id,
      full_name,
      email,
      selected_product,
      product_sku,
      phone,
      address,
      image_file_id
    } = selectedItem;

    try {
      const response = await fetch('/.netlify/functions/updateAppwriteSubmission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: $id,
          full_name,
          email,
          selected_product,
          product_sku,
          phone,
          address,
          image_file_id
        }),
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

    const header = ['Full Name', 'Email', 'Product', 'SKU', 'Phone', 'Address', 'Image URL'];
    const csvRows = [header.join(',')];

    filtered.forEach(item => {
      const imageUrl = item.image_file_id
        ? getImagePreviewURL(item.image_file_id)
        : '';
      const row = [
        `"${item.full_name || ''}"`,
        `"${item.email || ''}"`,
        `"${item.selected_product || ''}"`,
        `"${item.product_sku || ''}"`,
        `"${item.phone || ''}"`,
        `"${item.address || ''}"`,
        `"${imageUrl}"`
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
      <IndexTable.Cell>
        {item.image_file_id ? (
          <img
            src={getImagePreviewURL(item.image_file_id)}
            alt="Preview"
            style={{ width: '100px', height: 'auto', borderRadius: '4px' }}
          />
        ) : (
          '—'
        )}
      </IndexTable.Cell>
      <IndexTable.Cell>{item.full_name || '-'}</IndexTable.Cell>
      <IndexTable.Cell>{item.email || '-'}</IndexTable.Cell>
      <IndexTable.Cell>{item.selected_product || '-'}</IndexTable.Cell>
      <IndexTable.Cell>{item.product_sku || '-'}</IndexTable.Cell>  {/* Add this */}
      <IndexTable.Cell>{item.phone || '-'}</IndexTable.Cell>
      <IndexTable.Cell>{item.address || '-'}</IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <div style={{ marginBottom: '10px' }}>
            <LegacyStack alignment="center" distribution="trailing" spacing="loose">
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

          {importError && (
            <Box paddingBlockEnd="4">
              <Text variant="bodyMd" as="p" color="critical" alignment="right">
                {importError}
              </Text>
            </Box>
          )}

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
                  { title: 'Image' },
                  { title: 'Full Name' },
                  { title: 'Email' },
                  { title: 'Product' },
                  { title: 'SKU' },  
                  { title: 'Phone' },
                  { title: 'Address' },
                ]}
              >
                {rowMarkup}
              </IndexTable>
            )}
          </Card>

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
                  <TextField label="Full Name" value={selectedItem.full_name || ''} onChange={(val) => handleModalChange('full_name', val)} />
                  <TextField label="Email" value={selectedItem.email || ''} onChange={(val) => handleModalChange('email', val)} />
                  <TextField label="Product" value={selectedItem.selected_product || ''} onChange={(val) => handleModalChange('selected_product', val)} />
                  <TextField label="Product SKU (optional)" value={selectedItem.product_sku || ''} onChange={(val) => handleModalChange('product_sku', val)} />
                  <TextField label="Phone" value={selectedItem.phone || ''} onChange={(val) => handleModalChange('phone', val)} />
                  <TextField label="Address" value={selectedItem.address || ''} onChange={(val) => handleModalChange('address', val)} />
                 



                  {selectedItem.image_file_id && (
                    <img
                      src={getImagePreviewURL(selectedItem.image_file_id)}
                      alt="Uploaded"
                      style={{ width: '120px', marginTop: '10px', borderRadius: '8px' }}
                    />
                  )}
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












