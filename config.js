const jsonConfig = {
  API_URL: "https://backend.phienphien.shop",
  WEBSITE_URL: "https://phienphien.shop",
  IMG_URL: "https://backend.phienphien.shop",

  maillerConfig: {
    // host: 'smtp.gmail.com',
    // port: 465,
    // secure: true,
    // tls: { rejectUnauthorized: true },
    service: "Gmail",
    auth: {
      user: "trieunvvps17073@fpt.edu.vn",
      pass: "nyxbyzmwitmabnan",
    },
  },

  languageData: [
    {
      languageId: "english",
      locale: "en",
      name: "English",
      icon: "us",
    },
    {
      languageId: "VietNamese",
      locale: "tr",
      name: "VietNamese",
      icon: "tr",
    },
  ],

  defaultLanguage: {
    languageId: "english",
    locale: "en",
    name: "English",
    icon: "us",
  },
};

if (process.env.NODE_ENV == "development") {
  jsonConfig.API_URL = "http://localhost:5000";
  jsonConfig.WEBSITE_URL = "http://localhost:3000";
  jsonConfig.IMG_URL = "http://localhost:5000";
}

module.exports = jsonConfig;
