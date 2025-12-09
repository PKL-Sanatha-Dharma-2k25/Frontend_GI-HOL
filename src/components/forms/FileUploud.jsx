import { useState } from 'react';

export default function FileUpload({
  label = 'Upload File',
  accept = '*',
  maxSize = 5242880, // 5MB
  onUpload = () => {},
  multiple = false,
}) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files) return;

    const selectedFile = files[0];
    
    // Validation
    if (selectedFile.size > maxSize) {
      setError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    onUpload(formData);
    setUploading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{label}</h3>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />
        
        <label htmlFor="file-input" className="cursor-pointer">
          <div className="text-4xl mb-2">📁</div>
          <p className="text-gray-600">Click to select or drag and drop</p>
          <p className="text-xs text-gray-500 mt-1">Max size: {maxSize / 1024 / 1024}MB</p>
        </label>

        {file && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-800">✓ {file.name}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      )}
    </div>
  );
}