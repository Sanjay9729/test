import React, { useEffect, useState } from "react";
import {
  Page,
  Layout,
  Card,
  DataTable,
  Spinner,
  Text,
  InlineError,
  EmptyState,
} from "@shopify/polaris";

const ViewWarranty = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://brilliant-kashata-1d4944.netlify.app/.netlify/functions/getSubmissions")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Unexpected data format");
        }

        const formatted = data.map((item) => [
          item.full_name || "-",
          item.email || "-",
          item.phone || "-",
          item.selected_product || "-",
          new Date(item.created_at).toLocaleString() || "-",
        ]);

        setRows(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data", err);
        setError("Could not load submissions.");
        setLoading(false);
      });
  }, []);

  return (
    <Page title="Warranty Submissions">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingMd" as="h2">
              Submitted Warranty Forms
            </Text>

            {loading && (
              <div style={{ padding: "20px", textAlign: "center" }}>
                <Spinner accessibilityLabel="Loading" size="large" />
              </div>
            )}

            {error && (
              <div style={{ paddingTop: "20px" }}>
                <InlineError message={error} fieldID="data-fetch" />
              </div>
            )}

            {!loading && !error && rows.length === 0 && (
              <EmptyState
                heading="No submissions found"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/empty-state.svg"
              >
                <p>There are no warranty submissions yet.</p>
              </EmptyState>
            )}

            {!loading && !error && rows.length > 0 && (
              <DataTable
                columnContentTypes={["text", "text", "text", "text", "text"]}
                headings={["Name", "Email", "Phone", "Product", "Date"]}
                rows={rows}
              />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ViewWarranty;
