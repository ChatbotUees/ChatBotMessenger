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
    fb_page_token:'EAASoUKbFkdYBAFUPwdkYo8Rr3XZCWyZCQeZAePycIDctZAHvTT9sZB04JO8ZAT47sgpsvQ4QNoiFYJAyQEetn64ZAWlK0QJxTF9uZAsIOoghTVtWmHIOS0NwZAbu5ZBmXiPXJK4CgHg7lmDZBnIWDy54NlqY5eF6iCaPSORXGl3B1OZBZC5KrvfyJEiJU',
    fb_verify_token: 'michatbothector081993',
    fb_app_secret: '025c4bd7149c006f5adb3c6044a2a162',
    api_ai_client_access_token: 'fdc0cc6b3bfd46f9835f5566e06f8464'
  }

}