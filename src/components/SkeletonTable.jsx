import React from 'react';
import { IndexTable, Box } from '@shopify/polaris';

const SkeletonTable = ({ columns = [], rowCount = 6 }) => {
  if (!columns.length) return null; // ✅ Prevent blank if no columns

  return (
    <IndexTable
      itemCount={rowCount}
      selectable={false}
      headings={columns}
    >
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <IndexTable.Row id={`skeleton-${rowIndex}`} key={rowIndex} position={rowIndex}>
          {columns.map((_, colIndex) => (
            <IndexTable.Cell key={colIndex}>
              <Box
                background="bg-fill-tertiary"
                borderRadius="1"
                minHeight="16px"
                width="80%"
              />
            </IndexTable.Cell>
          ))}
        </IndexTable.Row>
      ))}
    </IndexTable>
  );
};

export default SkeletonTable;
