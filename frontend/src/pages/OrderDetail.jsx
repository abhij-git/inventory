import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client';
import { Alert, Loading, formatCurrency, formatDate } from '../components/common';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function loadOrder() {
    try {
      setLoading(true);
      setError('');
      const data = await api.getOrder(id);
      setOrder(data);
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
        <h2>Order #{id}</h2>
        <Link to="/orders" className="btn btn-secondary">
          Back to Orders
        </Link>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {order && (
        <section className="card">
          <div className="order-meta">
            <div>
              <span className="meta-label">Customer</span>
              <span>{order.customer_name || `Customer #${order.customer_id}`}</span>
            </div>
            <div>
              <span className="meta-label">Total Amount</span>
              <span className="meta-value">{formatCurrency(order.total_amount)}</span>
            </div>
            <div>
              <span className="meta-label">Created</span>
              <span>{formatDate(order.created_at)}</span>
            </div>
          </div>

          <h3>Line Items</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Line Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product_name || `Product #${item.product_id}`}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.unit_price)}</td>
                    <td>{formatCurrency(Number(item.unit_price) * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
