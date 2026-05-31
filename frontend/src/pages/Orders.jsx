import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Alert, EmptyState, Loading, formatCurrency, formatDate } from '../components/common';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError('');
      const [ordersData, customersData, productsData] = await Promise.all([
        api.getOrders(),
        api.getCustomers(),
        api.getProducts(),
      ]);
      setOrders(ordersData);
      setCustomers(customersData);
      setProducts(productsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleItemChange(index, field, value) {
    const updated = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    setItems(updated);
  }

  function addItemRow() {
    setItems([...items, { product_id: '', quantity: 1 }]);
  }

  function removeItemRow(index) {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  function validateForm() {
    if (!customerId) return 'Please select a customer';
    for (const item of items) {
      if (!item.product_id) return 'Please select a product for each line item';
      if (!item.quantity || Number(item.quantity) <= 0) return 'Quantity must be greater than 0';
    }
    const productIds = items.map((item) => item.product_id);
    if (new Set(productIds).size !== productIds.length) {
      return 'Duplicate products in the same order are not allowed';
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

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      await api.createOrder({
        customer_id: Number(customerId),
        items: items.map((item) => ({
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
        })),
      });
      setSuccess('Order created successfully');
      setCustomerId('');
      setItems([{ product_id: '', quantity: 1 }]);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to cancel/delete this order? Stock will be restored.')) return;
    try {
      setError('');
      setSuccess('');
      await api.deleteOrder(id);
      setSuccess('Order deleted successfully');
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Orders</h2>
        <p className="page-subtitle">Create and manage customer orders</p>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      <div className="page-grid">
        <section className="card">
          <h3>Create Order</h3>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="customer_id">Customer</label>
              <select
                id="customer_id"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.full_name} ({customer.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="order-items">
              <label>Order Items</label>
              {items.map((item, index) => (
                <div key={index} className="order-item-row">
                  <select
                    className="order-item-product"
                    value={item.product_id}
                    onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                    required
                  >
                    <option value="">Select product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} — {formatCurrency(product.price)} (Stock: {product.quantity_in_stock})
                      </option>
                    ))}
                  </select>
                  <div className="order-item-controls">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => removeItemRow(index)}
                      disabled={items.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-sm btn-secondary" onClick={addItemRow}>
                Add Item
              </button>
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Order'}
            </button>
          </form>
        </section>

        <section className="card">
          <h3>Order List</h3>
          {orders.length === 0 ? (
            <EmptyState message="No orders yet. Create your first order." />
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customer_name || `Customer #${order.customer_id}`}</td>
                      <td>{formatCurrency(order.total_amount)}</td>
                      <td>{formatDate(order.created_at)}</td>
                      <td className="actions">
                        <Link to={`/orders/${order.id}`} className="btn btn-sm btn-secondary">
                          View
                        </Link>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(order.id)}
                        >
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
