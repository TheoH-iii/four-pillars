module.exports = (req, res) => {
  if (req.method === 'GET' || req.method === 'POST') {
    return res.status(200).json({ status: 'ok', message: 'reading endpoint ready' });
  }
  return res.status(405).json({ error: 'Method not allowed' });
};
