import React, { useState } from 'react';
import { Upload, X, Camera, MapPin, DollarSign, Tag, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './sell.css';

const Sell = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    condition: 'used',
    location: '',
    contactInfo: ''
  });
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  
  const navigate = useNavigate();

  const categories = [
    'Labcoats',
    'Books',
    'Calculators',
    'EG Kit',
    'Appliances',
    'Clothing',
    'School Supplies',
    'Other'
  ];

  // Handle input change and form updates
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Redirect to /books when category is "Books"
    if (name === 'category' && value === 'Books') {
      navigate('/books');
    }
  };

  // Handle drag and drop for images
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle files (images) selected by the user
  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target.result]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Remove an image from the preview
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission (Publishing the product)
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Product listed:', { ...formData, images });
    // Call API to save the product in the selected category (optional)
    // Example API call to save product
    // saveProductToCategory({ ...formData, images });

    // Redirect to category page after publish
    if (formData.category) {
      navigate(`/${formData.category.toLowerCase()}`);
    }
  };

  // Handle Save Draft
  const handleSaveDraft = () => {
    const draftData = { ...formData, images };
    localStorage.setItem('productDraft', JSON.stringify(draftData));
    alert('Draft saved successfully!');
  };

  return (
    <div className="sell-products-container">
      <div className="header">
        <h1>Sell Your Product</h1>
        <p>List your item and reach thousands of students on campus</p>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="image-upload-section">
          <h2>Product Images</h2>
          <div
            className={`image-drop-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="upload-icon" />
            <p className="upload-text">Drag and drop your images here</p>
            <p className="or-text">or</p>
            <label className="browse-button">
              Browse Files
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
              />
            </label>
            <p className="file-info">PNG, JPG, GIF up to 10MB each</p>
          </div>

          {images.length > 0 && (
            <div className="image-preview">
              {images.map((image, index) => (
                <div key={index} className="image-preview-item">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="image-preview-img"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="remove-image-button"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-details-section">
          <h2>Product Details</h2>

          <div className="form-grid">
            <div className="form-group">
              <label>Product Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g., MacBook Pro 13inch 2021"
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <div className="select-container">
                <Tag className="select-icon" />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Price *</label>
              <div className="input-container">
                <DollarSign className="input-icon" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Condition *</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="new">New</option>
                <option value="used">Used - Like New</option>
                <option value="good">Used - Good</option>
                <option value="fair">Used - Fair</option>
              </select>
            </div>

            <div className="form-group">
              <label>Pickup Location *</label>
              <div className="input-container">
                <MapPin className="input-icon" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., Main Campus, Library"
                  required
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="input-field"
                placeholder="Describe your item in detail. Include any defects, accessories, or special features..."
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Contact Information</label>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Phone number or additional contact details (optional)"
              />
            </div>
          </div>
        </div>

        <div className="safety-tips">
          <h3>🛡️ Safety Tips</h3>
          <ul>
            <li>• Always meet in public, well-lit campus locations</li>
            <li>• Verify the buyer's student ID before finalizing the sale</li>
            <li>• Use cash or secure payment methods like Venmo/CashApp</li>
            <li>• Trust your instincts - if something feels off, don't proceed</li>
          </ul>
        </div>

        <div className="submit-buttons">
          <button type="button" className="save-draft-button" onClick={handleSaveDraft}>
            Save as Draft
          </button>
          <button type="submit" className="publish-button">
            Publish Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default Sell;
