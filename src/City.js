import React, { useState, useEffect } from 'react';
import './City.css';
import axios from 'axios';
 
const CityTable = () => {
    const [cities, setCities] = useState([]);
    const [sortField, setSortField] = useState('');
    const [sortDirection, setSortDirection] = useState('asc'); // Default to ascending order
    const [filterName, setFilterName] = useState('');
    const [dataFetched, setDataFetched] = useState(false);
 
    useEffect(() => {
        if (dataFetched) {
            fetchData();
        }
    }, [dataFetched, sortField, sortDirection, filterName]); // Re-fetch data when dataFetched, sorting field, direction, or filter name changes
 
    const fetchData = async () => {
        let apiUrl = 'http://localhost:3030/api/v1/cities/list';
 
        if (sortField) {
            apiUrl = `http://localhost:3030/api/v1/cities/listSorted?field=${sortField}&direction=${sortDirection}`;
        }
 
        if (filterName) {
            apiUrl = `http://localhost:3030/api/v1/cities/filterByName?name=${encodeURIComponent(filterName)}`;
        }
 
        try {
            const response = await axios.get(apiUrl);
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
 
    const handleSort = async (field) => {
        if (field === sortField) {
            // Toggle sort direction if same field is clicked again
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // Default to ascending order when a new field is clicked
            setSortField(field);
            setSortDirection('asc');
        }
    };
 
    const handleFilterChange = (event) => {
        setFilterName(event.target.value);
    };
 
    const handleFilterSubmit = (event) => {
        event.preventDefault();
        setDataFetched(true); // Set dataFetched to true when filter is submitted
    };
 
    const handleFetchData = () => {
        setDataFetched(true); // Set dataFetched to true when "Fetch Data" button is clicked
    };
 
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>
                <button onClick={handleFetchData}>Fetch Data</button>
            </div>
            {dataFetched && (
                <div>
                    <form onSubmit={handleFilterSubmit}>
                        <input type="text" value={filterName} onChange={handleFilterChange} placeholder="Filter by name" />
                    </form>
                </div>
            )}
            {dataFetched && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    <button onClick={() => handleSort('name')}>
                                        Name {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
                                    </button>
                                </th>
                                <th>
                                    <button onClick={() => handleSort('area')}>
                                        Area {sortField === 'area' && (sortDirection === 'asc' ? '▲' : '▼')}
                                    </button>
                                </th>
                                <th>
                                    <button onClick={() => handleSort('population')}>
                                        Population {sortField === 'population' && (sortDirection === 'asc' ? '▲' : '▼')}
                                    </button>
                                </th>
                                <th>
                                    <button onClick={() => handleSort('density')}>
                                        Density {sortField === 'density' && (sortDirection === 'asc' ? '▲' : '▼')}
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {cities.map(city => (
                                <tr key={city.id} className={city.population > 1000000 ? 'highlighted' : ''}>
                                    <td>{city.name}</td>
                                    <td>{city.area}</td>
                                    <td>{city.population}</td>
                                    <td>{city.density}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
 
export default CityTable;
 