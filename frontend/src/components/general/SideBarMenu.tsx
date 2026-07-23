import './SideBarMenu.css';

function Sidebar({ buttons = [], isOpen, onClose }) {
  return (
    <aside className={`sidebar-right ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button className="sidebar-button" onClick={onClose}>&times; Close</button>
      </div>
      
      <nav className="sidebar-nav">
        {buttons.map((btn, index) => (
          <button 
            style={{height:"40px"}}
            key={index} 
            className="sidebar-button" 
            onClick={btn.onClick}
          >
            {btn.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;