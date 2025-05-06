import React, { useEffect, useState } from "react";
import { Card, DataTable, Page, Layout } from "@shopify/polaris";

const ViewWarranty = () => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        fetch("https://brilliant-kashata-1d4944.netlify.app/.netlify/functions/getSubmissions")
            .then((res) => res.json())
            .then((data) => {
                const formatted = data.map((item) => [
                    item.full_name || "-",
                    item.email || "-",
                    item.phone || "-",
                    item.selected_product || "-",
                    new Date(item.created_at).toLocaleString() || "-",
                ]);
                setRows(formatted);
            })
            .catch((err) => {
                console.error("Failed to load data", err);
            });
    }, []);

    return (
        <Page title="Warranty Submissions">
            <Layout>
                <Layout.Section>
                    <Card>
                        <DataTable
                            columnContentTypes={["text", "text", "text", "text", "text"]}
                            headings={["Name", "Email", "Phone", "Product", "Date"]}
                            rows={rows}
                        />
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default ViewWarranty;
