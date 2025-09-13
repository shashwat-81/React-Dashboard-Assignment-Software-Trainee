import React from 'react';
import { useSelector } from 'react-redux';
import Category from './Category';
import SearchBar from './SearchBar';

const Dashboard = () => {
  const categories = useSelector((state) => state.widgets.categories);
  const searchTerm = useSelector((state) => state.widgets.searchTerm);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.widgets.some((widget) =>
      widget.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <main className="dashboard-container">
      <header className="dashboard-header">
        <h1>CNAPP Dashboard</h1>
        <div className="header-controls">
          <SearchBar />
          <div className="view-controls">
            <button className="widget-button">
              <span>Last 2 days</span>
            </button>
          </div>
        </div>
      </header>
      <div className="dashboard-content">
        {filteredCategories.map((category) => (
          <Category
            key={category.id}
            category={category}
          />
        ))}
      </div>
    </main>
  );
};

export default Dashboard;