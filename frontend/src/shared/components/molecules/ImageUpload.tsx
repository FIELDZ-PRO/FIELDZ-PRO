import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import './style/ImageUpload.css';

interface ImageUploadProps {
  value?: string;
  onChange: (base64: string) => void;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = "Photo du terrain" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onChange(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-container">
      {label && <label className="image-upload-label">{label}</label>}

      <div
        className={`image-upload-dropzone ${isDragging ? 'dragging' : ''} ${value ? 'has-image' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          style={{ display: 'none' }}
        />

        {value ? (
          <div className="image-preview">
            <img src={value} alt="Preview" />
            <button
              type="button"
              className="remove-image-btn"
              onClick={handleRemove}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="upload-placeholder">
            <Upload size={32} />
            <p className="upload-text">
              Glissez une image ici ou cliquez pour sélectionner
            </p>
            <p className="upload-hint">PNG, JPG jusqu'à 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
