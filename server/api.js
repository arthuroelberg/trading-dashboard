const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Trading Dashboard API',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/stocks', (req, res) => {
    const mockStocks = [
        { symbol: 'AAPL', company_name: 'Apple Inc.', sector: 'Technology' },
        { symbol: 'MSFT', company_name: 'Microsoft', sector: 'Technology' },
        { symbol: 'TSLA', company_name: 'Tesla Inc.', sector: 'Automotive' },
        { symbol: 'GOOGL', company_name: 'Alphabet Inc.', sector: 'Technology' },
        { symbol: 'AMZN', company_name: 'Amazon.com', sector: 'Consumer Cyclical' }
    ];
    res.json(mockStocks);
});

app.get('/api/stock-prices/:symbol', (req, res) => {
    const { symbol } = req.params;
    const { period = '30' } = req.query;
    
    const mockData = [];
    const now = new Date();
    const basePrice = 100 + Math.random() * 50;
    
    for (let i = parseInt(period); i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        const priceChange = (Math.random() - 0.5) * 10;
        const closePrice = basePrice + priceChange * i;
        
        mockData.push({
            date: date.toISOString().split('T')[0],
            open: closePrice - Math.random() * 2,
            high: closePrice + Math.random() * 3,
            low: closePrice - Math.random() * 3,
            close: closePrice,
            volume: Math.floor(Math.random() * 1000000) + 500000
        });
    }
    
    res.json(mockData);
});

app.get('/api/analysis-methods', (req, res) => {
    const methods = [
        { id: 'price', name: 'Kursverlauf' },
        { id: 'volume', name: 'Volumen' },
        { id: 'basic', name: 'Basis-Analyse' }
    ];
    res.json(methods);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server läuft auf http://localhost:${PORT}`);
    console.log(`📊 API verfügbar unter: http://localhost:${PORT}/api`);
    console.log(`🔌 Datenbank: ${process.env.DATABASE_URL ? 'Verbunden' : 'Mock-Daten'}`);
});