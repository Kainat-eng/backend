// controllers/serverController.js
import Server from '../Models/Server.js'; // ✅ Go up one level to Models


export const createServer = async (req, res) => {
  try {
    const server = await Server.create(req.body);
    res.status(201).json(server);
  } catch (err) {
    res.status(500).json({ message: 'Error creating server', err });
  }
};

export const getAllServers = async (_req, res) => {
  try {
    const servers = await Server.find();
    res.json(servers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching servers', err });
  }
};

export const updateServer = async (req, res) => {
  try {
    const server = await Server.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!server) return res.status(404).json({ message: 'Server not found' });
    res.json(server);
  } catch (err) {
    res.status(500).json({ message: 'Error updating server', err });
  }
};

export const deleteServer = async (req, res) => {
  try {
    const server = await Server.findByIdAndDelete(req.params.id);
    if (!server) return res.status(404).json({ message: 'Server not found' });
    res.json({ message: 'Server deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting server', err });
  }
};

export const getSecurityThreats = async (req, res) => {
  try {
    // Your logic here — maybe filter servers with threats?
    const threats = await Server.find({ hasThreat: true }); // example
    res.json(threats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching security threats', err });
  }
};

export const getServerById = async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);
    if (!server) return res.status(404).json({ message: 'Server not found' });
    res.json(server);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching server by ID', err });
  }
};

// In controllers/serverController.js

export const trackUptimeDowntime = async (req, res) => {
  try {
    const { serverId, status, timestamp } = req.body;

    const server = await Server.findById(serverId);
    if (!server) return res.status(404).json({ message: 'Server not found' });

    // Assume there's a field `history` which tracks uptime/downtime logs
    server.history.push({ status, timestamp: timestamp || new Date() });

    await server.save();
    res.status(200).json({ message: 'Uptime/Downtime tracked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error tracking uptime/downtime', err });
  }
};
