require('dotenv').config();
const express = require('express');
const os = require('os');
const diskusage = require('diskusage');
const util = require('util');
const si = require('systeminformation');
const winston = require('winston');
const rateLimit = require('express-rate-limit');

// Initialize Express
const app = express();

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Add console logging for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Promisify disk usage check
const checkDiskSpace = util.promisify(diskusage.check);

// Network stats tracking
let lastNetworkStats = null;
let lastNetworkStatsTime = null;

// Validate API key
if (!process.env.API_KEY) {
  logger.error('API_KEY not set. Please set the API_KEY environment variable.');
  process.exit(1);
}

// Security middleware
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    logger.error('Invalid API key attempt');
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});

// CPU endpoint
app.get('/cpu', async (req, res) => {
  try {
    const cpuLoad = os.loadavg()[0];
    logger.info(`CPU load requested: ${cpuLoad}`);
    res.json({
      cpuLoad,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    logger.error('CPU endpoint error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Memory endpoint
app.get('/memory', async (req, res) => {
  try {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const usagePercentage = ((usedMemory / totalMemory) * 100).toFixed(2);
    logger.info(`Memory usage requested: ${usagePercentage}%`);
    res.json({
      totalMemory,
      usedMemory,
      freeMemory,
      usagePercentage: `${usagePercentage}%`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    logger.error('Memory endpoint error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Disk endpoint
app.get('/disk', async (req, res) => {
  try {
    const info = await checkDiskSpace('/');
    const totalSpace = info.total;
    const freeSpace = info.free;
    const usedSpace = totalSpace - freeSpace;
    const usagePercentage = ((usedSpace / totalSpace) * 100).toFixed(2);
    logger.info(`Disk usage requested: ${usagePercentage}%`);
    res.json({
      totalSpace,
      usedSpace,
      freeSpace,
      usagePercentage: `${usagePercentage}%`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    logger.error('Disk endpoint error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Bandwidth endpoint
app.get('/bandwidth', async (req, res) => {
  try {
    const currentStats = await si.networkStats();
    const currentTime = Date.now();
    if (lastNetworkStats && lastNetworkStatsTime) {
      const timeDiff = (currentTime - lastNetworkStatsTime) / 1000;
      const rxDiff = currentStats[0].rx_bytes - lastNetworkStats[0].rx_bytes;
      const txDiff = currentStats[0].tx_bytes - lastNetworkStats[0].tx_bytes;
      const rxSpeed = (rxDiff / timeDiff / 1024 / 1024).toFixed(2);
      const txSpeed = (txDiff / timeDiff / 1024 / 1024).toFixed(2);
      const totalSpeed = (parseFloat(rxSpeed) + parseFloat(txSpeed)).toFixed(2);
      logger.info(`Bandwidth usage requested: ${totalSpeed} MB/s`);
      res.json({
        receiveBandwidth: `${rxSpeed} MB/s`,
        transmitBandwidth: `${txSpeed} MB/s`,
        totalBandwidth: `${totalSpeed} MB/s`,
        timestamp: new Date().toISOString()
      });
    } else {
      res.json({
        message: 'Initializing bandwidth measurement. Please try again in a few seconds.',
        timestamp: new Date().toISOString()
      });
    }
    lastNetworkStats = currentStats;
    lastNetworkStatsTime = currentTime;
  } catch (err) {
    logger.error('Bandwidth endpoint error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;