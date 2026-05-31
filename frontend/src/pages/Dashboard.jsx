import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Alert, Loading, formatCurrency } from '../components/common';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSummary();
  }, []);

  async function loadSummary() {
    try {
      setLoading(true);
      setError('');
      const data = await api.getDashboard();
      setSummary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p className="page-subtitle">Overview of your inventory and orders</p>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {summary && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Products</span>
              <span className="stat-value">{summary.total_products}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Customers</span>
              <span className="stat-value">{summary.total_customers}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{summary.total_orders}</span>
            </div>
            <div className="stat-card stat-card-warning">
              <span className="stat-label">Low Stock Items</span>
              <span className="stat-value">{summary.low_stock_products.length}</span>
            </div>
          </div>

          <section className="card">
            <h3>Low Stock Products</h3>
            {summary.low_stock_products.length === 0 ? (
              <p className="muted">All products are well stocked.</p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>SKU</th>
                      <th>Price</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.low_stock_products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.sku}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>
                          <span className="badge badge-warning">{product.quantity_in_stock}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <div className="quick-links">
            <Link to="/products" className="btn btn-secondary">Manage Products</Link>
            <Link to="/customers" className="btn btn-secondary">Manage Customers</Link>
            <Link to="/orders" className="btn btn-primary">Create Order</Link>
          </div>
        </>
      )}
    </div>
  );
}
