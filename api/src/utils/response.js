export const response = (status, data, message, res) => {
  res.status(status).send({
    payload: data,
    message,
  });
};

export const homeResponse = (status, res) => {
  res.json(status, {
    maintainer: 'Muhamad Abdul Azis',
    source: 'https://github.com/muhAzis/Kutu-Buku-Apps',
    description: 'Server for "Kutu Buku Apps"',
  });
};
