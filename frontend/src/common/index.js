

const baseurl = "http://localhost:8000";

const summaryapi = {
  signup: {
    url: `${baseurl}/api/signup`,
    method: "post", 
  },
  login : {
    url: `${baseurl}/api/login`,
    method: "post"
  },
  current_user : {
    url :`${baseurl}/api/user-details`,
    method : "get"
  },
  upload : {
    url :`${baseurl}/api/upload`,
    method : "post"
  },
  logout : {
    url :`${baseurl}/api/logout`,
    method : "get"
  },
  Allusers : {
    url :`${baseurl}/api/all-users`,
    method : "get"
  },
  updateuser : {
    url : `${baseurl}/api/update-user`,
    method : "post"
  },
  uploadProduct : {
    url : `${baseurl}/api/product`,
    method : "post"
  },
  allproducts : {
    url : `${baseurl}/api/all-products`,
    method : "get"
  },
  editproduct : {
    url : `${baseurl}/api/editproduct`,
    method : "put"
  },
  deleteproduct : {
    url : `${baseurl}/api/deleteproduct`,
    method : "delete"
  },
};

export default summaryapi;
