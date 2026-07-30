import { useState } from 'react';
import { employees } from '../data/mockData';

export default function Login({ onLogin, employees }) {
  const [selectedUser, setSelectedUser] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filteredEmployees = employees.filter(emp => {
    if (roleFilter === 'All') return true;
    return emp.role === roleFilter;
  });

  const roles = ['All', ...new Set(employees.map(e => e.role))];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
      padding: 'var(--spacing-6)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-light)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)',
        padding: 'var(--spacing-8)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--spacing-4)',
            fontSize: 'var(--text-2xl)',
            color: 'white'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>
            Walk In My Shoes
          </h1>
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-lg)' }}>
            Shadow Opportunity Management Platform
          </p>
        </div>

        <div style={{ marginBottom: 'var(--spacing-6)' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>
            Select Your Account (Demo)
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--spacing-3) var(--spacing-4)',
              fontSize: 'var(--text-base)',
              fontFamily: 'inherit',
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-medium)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer'
            }}
          >
            <option value="">Choose a user to continue...</option>
            {roles.map(role => (
              <optgroup key={role} label={role === 'All' ? 'All Users' : `${role}s`}>
                {filteredEmployees
                  .filter(e => role === 'All' || e.role === role)
                  .map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} — {emp.position} ({emp.organizationId})
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 'var(--spacing-6)' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>
            Filter by Role
          </label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--spacing-2) var(--spacing-3)',
              fontSize: 'var(--text-sm)',
              fontFamily: 'inherit',
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-medium)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer'
            }}
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => onLogin(selectedUser)}
          disabled={!selectedUser}
          style={{
            width: '100%',
            padding: 'var(--spacing-3) var(--spacing-6)',
            fontSize: 'var(--text-base)',
            fontWeight: '600',
            fontFamily: 'inherit',
            color: 'white',
            backgroundColor: selectedUser ? 'var(--color-secondary)' : 'var(--color-text-muted)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: selectedUser ? 'pointer' : 'not-allowed',
            transition: 'all var(--transition-fast)'
          }}
        >
          Sign In
        </button>

        <div style={{
          marginTop: 'var(--spacing-8)',
          padding: 'var(--spacing-4)',
          backgroundColor: 'var(--color-bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-tertiary)',
          textAlign: 'center'
        }}>
          <p style={{ fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>
            Demo Accounts
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-2)', textAlign: 'left' }}>
            <div><strong>Employee:</strong> Sarah Johnson (emp-1)</div>
            <div><strong>Host:</strong> Emily Rodriguez (emp-3)</div>
            <div><strong>Admin:</strong> Daniel Lee (emp-12)</div>
          </div>
        </div>
      </div>
    </div>
  );
}