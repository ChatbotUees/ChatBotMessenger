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
  },

  access: {    
    fb_page_token:'EAASoUKbFkdYBADYM5UWVlJ2oTDWNLjPxXEuunxZAkS9nwhLMaDfPZAZA53yR6PkJUdfmwm5VNGl9i1xPZBRYfVqY0Swt3dczJP4cJtalT5XKAvIzklRTb9RmLGV2vCQUrTGD2yqZAAKeBIlKViYqqwPVVRcDpIRubMb6qWnb8AYwq1v72VhcS',
    fb_verify_token: 'michatbothector081993',
    //fb_app_secret: '025c4bd7149c006f5adb3c6044a2a162',
    fb_app_secret: '025c4bd7149c006f5adb3c6044a2a16234545',
    api_ai_client_access_token: 'fdc0cc6b3bfd46f9835f5566e06f8464'
  }

}