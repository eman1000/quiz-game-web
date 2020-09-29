import { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
//import { logoutUser } from "../Login/module";

class Logout extends Component<any>{

  componentDidMount(){
    localStorage.removeItem("authUser");
    localStorage.removeItem("jwtToken");
    window.location.href = "/";

  }

  render() {
    
    return null;
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ /**logoutUser**/ }, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(Logout);
