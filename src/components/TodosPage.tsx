import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { fetchUserAttributes } from 'aws-amplify/auth';

const client = generateClient<Schema>();

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '2rem'
  },
  maxWidth: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  userHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '2rem',
    background: 'linear-gradient(135deg, #00BE76, #40D396)',
    color: 'white',
    borderRadius: '12px',
    marginBottom: '2rem'
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    marginRight: '1.5rem'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: '1.5rem',
    marginBottom: '1.5rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#00BE76',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  },
  buttonSecondary: {
    padding: '12px 24px',
    backgroundColor: 'white',
    color: '#374151',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box' as const
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    backgroundColor: 'white',
    boxSizing: 'border-box' as const
  },
  todoItem: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  checkbox: {
    width: '20px',
    height: '20px',
    marginRight: '1rem',
    cursor: 'pointer'
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    marginRight: '8px'
  },
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  formGroup: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151'
  },
  actionsBar: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '1rem',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem'
  },
  searchContainer: {
    position: 'relative' as const,
    flex: '1',
    maxWidth: '400px'
  }
};

function UserHeader() {
  const [attributes, setAttributes] = useState<any>(null);

  useEffect(() => {
    fetchUserAttributes().then(setAttributes);
  }, []);

  const getDisplayName = () => {
    if (!attributes) return 'Loading...';
    return attributes.nickname || attributes.phone_number || 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div style={styles.userHeader}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={styles.avatar}>
          {getInitials()}
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
            Welcome back, {getDisplayName()}!
          </h2>
          <p style={{ margin: '8px 0 0 0', fontSize: '18px', opacity: 0.9 }}>
            Ready to tackle your tasks?
          </p>
        </div>
      </div>
      <button style={styles.buttonSecondary}>
        Settings
      </button>
    </div>
  );
}

function StatsCards({ todos }: { todos: Array<Schema["Todo"]["type"]> }) {
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = todos.length - completedTodos;
  const completionRate = todos.length > 0 ? Math.round((completedTodos / todos.length) * 100) : 0;

  const statCards = [
    { title: 'Total Tasks', value: todos.length, color: '#00BE76' },
    { title: 'Completed', value: completedTodos, color: '#10b981' },
    { title: 'Pending', value: pendingTodos, color: '#f59e0b' },
    { title: 'Progress', value: `${completionRate}%`, color: '#40D396' }
  ];

  return (
    <div style={styles.statsGrid}>
      {statCards.map((stat, index) => (
        <div key={index} style={{...styles.statCard, borderTop: `4px solid ${stat.color}`}}>
          <div>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '16px', fontWeight: '600' }}>
              {stat.title}
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AddTodoModal({ isOpen, onClose, onAddTodo }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onAddTodo: (content: string, priority: string, category: string) => void 
}) {
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAddTodo(content.trim(), priority, category);
      setContent("");
      setPriority("medium");
      setCategory("general");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '24px', fontWeight: 'bold' }}>
          Create New Task
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Task Description</label>
            <input
              style={styles.input}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Priority</label>
              <select 
                style={styles.select} 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select 
                style={styles.select} 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="general">General</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" style={styles.buttonSecondary} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" style={styles.button}>
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TodoItem({ todo, onToggle, onDelete }: { 
  todo: Schema["Todo"]["type"], 
  onToggle: (id: string) => void,
  onDelete: (id: string) => void 
}) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return { backgroundColor: '#fef2f2', color: '#dc2626' };
      case 'medium': return { backgroundColor: '#fffbeb', color: '#d97706' };
      case 'low': return { backgroundColor: '#f0fdf4', color: '#16a34a' };
      default: return { backgroundColor: '#f9fafb', color: '#374151' };
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return { backgroundColor: '#eff6ff', color: '#2563eb' };
      case 'personal': return { backgroundColor: '#faf5ff', color: '#9333ea' };
      case 'urgent': return { backgroundColor: '#fef2f2', color: '#dc2626' };
      default: return { backgroundColor: '#f9fafb', color: '#374151' };
    }
  };

  return (
    <div style={{
      ...styles.todoItem,
      opacity: todo.completed ? 0.7 : 1,
      backgroundColor: todo.completed ? '#f9fafb' : 'white'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <input
          type="checkbox"
          style={styles.checkbox}
          checked={todo.completed || false}
          onChange={() => onToggle(todo.id)}
        />
        <div style={{ flex: 1 }}>
          <p style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? '#6b7280' : '#111827'
          }}>
            {todo.content || 'Untitled task'}
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <span style={{
              ...styles.badge,
              ...getPriorityColor(todo.priority || 'medium')
            }}>
              {todo.priority || 'medium'}
            </span>
            <span style={{
              ...styles.badge,
              ...getCategoryColor(todo.category || 'general')
            }}>
              {todo.category || 'general'}
            </span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          style={{
            ...styles.button,
            backgroundColor: '#ef4444',
            padding: '8px 16px'
          }}
          onClick={() => onDelete(todo.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function TodosPage({ signOut }: { signOut: () => void }) {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  const handleAddTodo = (content: string, priority: string, category: string) => {
    client.models.Todo.create({ 
      content, 
      priority, 
      category, 
      completed: false 
    });
  };

  const handleToggleTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      client.models.Todo.update({
        id,
        completed: !todo.completed
      });
    }
  };

  const handleDeleteTodo = (id: string) => {
    client.models.Todo.delete({ id });
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = (todo.content || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || todo.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <UserHeader />
        <StatsCards todos={todos} />
        
        <div style={styles.card}>
          <div style={styles.actionsBar}>
            <div style={styles.searchContainer}>
              <input
                style={styles.input}
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              style={styles.select} 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="urgent">Urgent</option>
            </select>
            <button style={styles.button} onClick={() => setIsModalOpen(true)}>
              Add New Task
            </button>
            <Link to="/ShadcnShowcase">
              <button style={styles.buttonSecondary}>
                Components
              </button>
            </Link>
            <button 
              style={{
                ...styles.buttonSecondary,
                color: '#dc2626',
                borderColor: '#dc2626'
              }} 
              onClick={signOut}
            >
              Sign Out
            </button>
          </div>
        </div>

        <div>
          {filteredTodos.length > 0 ? (
            <>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
                Your Tasks ({filteredTodos.length})
              </h2>
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </>
          ) : (
            <div style={styles.card}>
              <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '0 0 1rem 0' }}>
                  {searchTerm || filterCategory !== "all" ? "No matching tasks" : "No tasks yet"}
                </h3>
                <p style={{ fontSize: '18px', color: '#6b7280', margin: '0 0 2rem 0' }}>
                  {searchTerm || filterCategory !== "all" 
                    ? "Try adjusting your search or filter criteria" 
                    : "Create your first task to get started!"
                  }
                </p>
                {!searchTerm && filterCategory === "all" && (
                  <button style={styles.button} onClick={() => setIsModalOpen(true)}>
                    Add New Task
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        <AddTodoModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTodo={handleAddTodo}
        />
      </div>
    </div>
  );
} 