import React, { useState } from "react";
import { Upload, X, MapPin, DollarSign, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./sell.css";

const Sell = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    condition: "used",
    location: "",
    contactInfo: "",
  });
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const categories = ["Books", "Calculators", "Lab Coats", "EG Kit"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages((prev) => [...prev, { file, preview: e.target.result }]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 🚀 Submit product to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please upload at least one product image!");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("condition", formData.condition);
    data.append("location", formData.location);
    data.append("contactInfo", formData.contactInfo);

    // Only take first image for now
    data.append("image", images[0].file);

    try {
      const res = await axios.post("http://localhost:8081/api/sell/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        alert("✅ Product listed successfully!");
        navigate(`/${formData.category.toLowerCase()}`);
      } else {
        alert("❌ Failed to list product. Try again.");
      }
    } catch (err) {
      console.error("Error uploading product:", err);
      alert("⚠️ Server error while uploading product.");
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("productDraft", JSON.stringify({ ...formData, images }));
    alert("💾 Draft saved successfully!");
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
            className={`image-drop-area ${dragActive ? "drag-active" : ""}`}
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
                  <img src={image.preview} alt={`Preview ${index + 1}`} />
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
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Price (₹) *</label>
              <div className="input-container">
                <DollarSign className="input-icon" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
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
                placeholder="Describe your item in detail..."
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Contact Info (optional)</label>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                placeholder="Phone number or email"
              />
            </div>
          </div>
        </div>

        <div className="submit-buttons">
          <button type="button" className="save-draft-button" onClick={handleSaveDraft}>
            💾 Save Draft
          </button>
          <button type="submit" className="publish-button">
            🚀 Publish Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default Sell;
