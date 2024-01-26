const axios = require('axios');

exports.getInfoUserGoogle = async(token) => {
  try{
    const res = await axios.get(
      "https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos,phoneNumbers,nicknames,locations",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data

  }catch(err) {
    throw err
  }
};
