module.exports = {
  name: 'ChatBot',
  description: 'Alguna descripción',
  domain: 'localhost',
  url: 'http://localhost',
  env: 'development',
  port: process.env.PORT || 5000,
 
  database: {
    domain: 'admin:admin@ds111441.mlab.com:11441',
    name: 'mydb'
  }
}