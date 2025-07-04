import { Link } from "react-router-dom";
import ShadcnShowcase from "./ShadcnShowcase";

export default function ShowcasePage({ signOut }: { signOut: () => void }) {
  return (
    <div>
      <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 50,
        display: 'flex',
        gap: '0.5rem'
      }}>
        <Link
          to="/"
          style={{
            backgroundColor: 'white',
            color: '#374151',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textDecoration: 'none',
            transition: 'box-shadow 0.3s ease'
          }}
        >
          ← Back to Todos
        </Link>
        <button
          onClick={signOut}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
        >
          Sign Out
        </button>
      </div>
      <ShadcnShowcase />
    </div>
  );
} 