import { useEffect, useState } from 'react';
import api from '../api/client';
import { Alert, EmptyState, Loading, formatCurrency } from '../components/common';

const emptyForm = { name: '', sku: '', price: '', quantity_in_stock: '' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError('');
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validateForm() {
    if (!form.name.trim()) return 'Product name is required';
    if (!form.sku.trim()) return 'SKU is required';
    if (!form.price || Number(form.price) <= 0) return 'Price must be greater than 0';
    if (form.quantity_in_stock === '' || Number(form.quantity_in_stock) < 0) {
      return 'Quantity must be 0 or greater';
    }
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: Number(form.price),
      quantity_in_stock: Number(form.quantity_in_stock),
    };

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      if (editingId) {
        await api.updateProduct(editingId, payload);
        setSuccess('Product updated successfully');
      } else {
        await api.createProduct(payload);
        setSuccess('Product created successfully');
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      price: String(product.price),
      quantity_in_stock: String(product.quantity_in_stock),
    });
    setError('');
    setSuccess('');
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      setError('');
      setSuccess('');
      await api.deleteProduct(id);
      setSuccess('Product deleted successfully');
      if (editingId === id) handleCancelEdit();
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Products</h2>
        <p className="page-subtitle">Manage your product catalog and inventory</p>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      <div className="page-grid">
        <section className="card">
          <h3>{editingId ? 'Edit Product' : 'Add Product'}</h3>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="sku">SKU / Code</label>
              <input id="sku" name="sku" value={form.sku} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="quantity_in_stock">Quantity in Stock</label>
                <input
                  id="quantity_in_stock"
                  name="quantity_in_stock"
                  type="number"
                  min="0"
                  value={form.quantity_in_stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card">
          <h3>Product List</h3>
          {products.length === 0 ? (
            <EmptyState message="No products yet. Add your first product." />
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.sku}</td>
                      <td>{formatCurrency(product.price)}</td>
                      <td>
                        <span
                          className={
                            product.quantity_in_stock <= 10 ? 'badge badge-warning' : 'badge badge-success'
                          }
                        >
                          {product.quantity_in_stock}
                        </span>
                      </td>
                      <td className="actions">
                        <button type="button" className="btn btn-sm btn-secondary" onClick={() => handleEdit(product)}>
                          Edit
                        </button>
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(product.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
