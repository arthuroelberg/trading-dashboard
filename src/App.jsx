import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function App() {
    const [stocks, setStocks] = useState([]);
    const [selectedStock, setSelectedStock] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('price');
    const [isOnline, setIsOnline] = useState(true);
    const [stockData, setStockData] = useState([]);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [priceChange, setPriceChange] = useState(0);

    useEffect(() => {
        axios.get(`${API_URL}/stocks`)
            .then(res => {
                setStocks(res.data);
                if (res.data.length > 0) {
                    setSelectedStock(res.data[0].symbol);
                }
            })
            .catch(() => setIsOnline(false));
    }, []);

    useEffect(() => {
        if (selectedStock) {
            fetchStockData();
        }
    }, [selectedStock]);

    const fetchStockData = async () => {
        try {
            const response = await axios.get(`${API_URL}/stock-prices/${selectedStock}`);
            const data = response.data;
            setStockData(data);
            
            if (data.length > 0) {
                const latest = data[data.length - 1];
                const oldest = data[0];
                setCurrentPrice(latest.close);
                setPriceChange(latest.close - oldest.close);
            }
        } catch (error) {
            console.error(`Fehler beim Laden von ${selectedStock}:`, error);
        }
    };

    const toggleOnline = () => {
        setIsOnline(!isOnline);
    };

    return (
        <div style={{ 
            fontFamily: 'sans-serif', 
            background: '#0f172a', 
            color: 'white', 
            margin: 0,
            padding: '20px',
            minHeight: '100vh'
        }}>
            <h1>Trading Dashboard</h1>
            <p style={{ color: '#94a3b8' }}>Basis-Version mit Mock-Daten</p>

            <div style={{ 
                background: '#1e293b', 
                padding: '20px', 
                borderRadius: '10px',
                marginBottom: '20px',
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', color: '#94a3b8' }}>Aktienauswahl</label>
                    <select 
                        value={selectedStock}
                        onChange={(e) => setSelectedStock(e.target.value)}
                        style={{
                            padding: '10px',
                            background: '#0f172a',
                            color: '#f1f5f9',
                            border: '1px solid #334155',
                            borderRadius: '6px',
                            minWidth: '200px'
                        }}
                    >
                        {stocks.map((stock) => (
                            <option key={stock.symbol} value={stock.symbol}>
                                {stock.symbol} - {stock.company_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', color: '#94a3b8' }}>Analyse-Methode</label>
                    <select 
                        value={selectedMethod}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        style={{
                            padding: '10px',
                            background: '#0f172a',
                            color: '#f1f5f9',
                            border: '1px solid #334155',
                            borderRadius: '6px',
                            minWidth: '200px'
                        }}
                    >
                        <option value="price">Kursverlauf</option>
                        <option value="volume">Volumen</option>
                        <option value="basic">Basis-Analyse</option>
                    </select>
                </div>

                <div style={{ 
                    marginLeft: 'auto', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '20px' 
                }}>
                    <div>
                        <span style={{
                            display: 'inline-block',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            marginRight: '8px',
                            background: isOnline ? '#10b981' : '#ef4444'
                        }}></span>
                        <span>{isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                    <button 
                        onClick={toggleOnline}
                        style={{
                            padding: '10px 20px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        {isOnline ? 'Zu Offline' : 'Zu Online'}
                    </button>
                </div>
            </div>

            {selectedStock && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    paddingBottom: '15px',
                    borderBottom: '1px solid #334155'
                }}>
                    <div>
                        <h2>{selectedStock}</h2>
                        <div style={{ color: '#94a3b8' }}>
                            {stocks.find(s => s.symbol === selectedStock)?.company_name}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                            ${currentPrice.toFixed(2)}
                        </div>
                        <div style={{
                            padding: '5px 10px',
                            borderRadius: '4px',
                            fontSize: '16px',
                            background: priceChange >= 0 ? '#065f46' : '#7f1d1d',
                            color: priceChange >= 0 ? '#6ee7b7' : '#fca5a5'
                        }}>
                            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ 
                background: '#1e293b', 
                borderRadius: '10px', 
                padding: '20px',
                marginTop: '20px',
                minHeight: '400px'
            }}>
                <h3>Chart für {selectedStock}</h3>
                <p>Methode: {selectedMethod}</p>
                
                {stockData.length > 0 ? (
                    <div>
                        <p>Datenpunkte: {stockData.length}</p>
                        <p>Letzter Kurs: ${stockData[stockData.length - 1].close.toFixed(2)}</p>
                        <p>Zeitraum: {stockData.length} Tage</p>
                        
                        <div style={{ 
                            marginTop: '20px',
                            background: '#0f172a',
                            padding: '20px',
                            borderRadius: '6px'
                        }}>
                            <h4>Chart-Vorschau (Text):</h4>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'flex-end',
                                height: '100px',
                                gap: '2px',
                                marginTop: '10px'
                            }}>
                                {stockData.slice(-20).map((data, index) => {
                                    const height = (data.close / currentPrice) * 80;
                                    return (
                                        <div 
                                            key={index}
                                            style={{
                                                width: '15px',
                                                height: `${height}px`,
                                                background: data.close >= (stockData[index-1]?.close || 0) ? '#10b981' : '#ef4444',
                                                borderRadius: '2px'
                                            }}
                                            title={`${data.date}: $ ${data.close.toFixed(2)}`}
                                        ></div>
                                    );
                                })}
                            </div>
                            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '10px' }}>
                                Balken zeigen den relativen Kursverlauf (letzte 20 Tage)
                            </p>
                        </div>
                    </div>
                ) : (
                    <p>Keine Daten verfügbar</p>
                )}
            </div>

            <div style={{ 
                marginTop: '30px', 
                paddingTop: '20px', 
                borderTop: '1px solid #334155',
                color: '#94a3b8',
                fontSize: '14px'
            }}>
                <p>Basis-Version des Trading Dashboards</p>
                <p>Verbindung: {isOnline ? 'Aktiv' : 'Inaktiv'} | Aktien: {stocks.length}</p>
                <p>Verwendet {isOnline ? 'API-Daten' : 'Mock-Daten'}</p>
            </div>
        </div>
    );
}

export default App;