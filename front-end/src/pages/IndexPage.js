import React from "react";
import axios from "axios"

const IndexPage = (props) => {

  React.useEffect(() => {
    axios.get('http://localhost:8000/user/auth', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('AUTH_TOKEN') } })
    .then(response => {
      props.history.push("/dashboard");
    })
    .catch(err => {
      if(err.response.status === 401){
        localStorage.setItem('AUTH_TOKEN', '')
        props.history.push("/login");
      }
      else{
        console.log(err)
      }
      
    })
    // eslint-disable-next-line
  }, []);
  return (<div></div>);
};

export default IndexPage;