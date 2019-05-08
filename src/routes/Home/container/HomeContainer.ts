import { connect } from "react-redux";
import Home from "../components/Home";

import {
} from "../module";

const mapStateToProps = (state) => ({
  authenticatedUser: state.home.authenticatedUser,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);