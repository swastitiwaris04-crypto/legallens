'use client';
import { useState } from 'react';
import FileDropzone from '@/components/upload/FileDropzone';

export default function TwoColumnUpload({ label, side }) {
  const [file, setFile] = useState(null);

  return (
    <div>
      <h3 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 12 }}>
        {label}
      </h3>
      <FileDropzone onFileSelect={setFile} />
    </div>
  );
}
