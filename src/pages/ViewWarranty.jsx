import React, { useEffect, useState } from 'react';
import '../styles/polaris.css';
import {
  AppProvider,
  Page,
  Card,
  IndexTable,
  Text,
} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';

const ViewWarranty = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const rows = submissions.map((item, index) => (
    <IndexTable.Row
      id={item.id || index.toString()}
      key={item.id || index}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodySm" fontWeight="bold">
          {item.full_name || '—'}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{item.email || '—'}</IndexTable.Cell>
      <IndexTable.Cell>{item.selected_product || '—'}</IndexTable.Cell>
      <IndexTable.Cell>{item.phone || '—'}</IndexTable.Cell>
      <IndexTable.Cell>{item.address || '—'}</IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <AppProvider i18n={enTranslations}>
      <Page title="Warranty Submissions">
        <Card>
          {!loading && submissions.length === 0 ? (
            <Text variant="bodyMd" as="p" alignment="center">
              No warranty submissions found.
            </Text>
          ) : (
            <IndexTable
              itemCount={submissions.length}
              selectable={false} // ✅ disables checkboxes
              headings={[
                { title: 'Name' },
                { title: 'Email' },
                { title: 'Product' },
                { title: 'Phone' },
                { title: 'Address' },
              ]}
            >
              {rows}
            </IndexTable>
          )}
        </Card>
      </Page>
    </AppProvider>
  );
};

export default ViewWarranty;
