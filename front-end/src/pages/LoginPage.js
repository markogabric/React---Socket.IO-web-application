import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Input from "@material-ui/core/Input";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "../styles/login.css";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    input: {
        margin: "10px",
        width: "350px",
        backgroundColor: "white",
        borderRadius: "20px",
        height: "50px",
        color: "black",
        padding: "0px 20px",
    },

    button: {
        margin: "10px",
        width: "350px",
        fontWeight: "bold",
    },

    avatar: {
        backgroundColor: "#3f51b5",
    },
}));

function LoginPage(props) {
    const emailRef = React.createRef();
    const passwordRef = React.createRef();
    const classes = useStyles();
    const [error, setError] = React.useState("");


    React.useEffect(() => {
        axios
            .get(
                "http://localhost:8000/user/auth",
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("AUTH_TOKEN"),
                    },
                }
            )
            .then((response) => {
                props.history.push("/dashboard");
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    localStorage.setItem("AUTH_TOKEN", "");
                } else {
                    console.log(err);
                }
            });
            // eslint-disable-next-line
    }, []);


    const loginUser = () => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        axios
            .post("http://localhost:8000/user/login", {
                email,
                password,
            })
            .then((response) => {
                localStorage.setItem("AUTH_TOKEN", response.data.token);
                props.history.push("/dashboard");
                props.setupSocket();
            })
            .catch((err) => {
                setError(err.response.data.message);
            });
    };

    return (
        <div className="loginPage">
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <h2 className="loginHeader">Login</h2>
            <form autoComplete="off" onSubmit={loginUser} className="loginBody" >
            <p className="errorMessage">{error}</p>
                <Input
                    className={classes.input}
                    placeholder="Email"
                    label="Filled"
                    inputRef={emailRef}
                    disableUnderline
                ></Input>
                <Input
                    className={classes.input}
                    required
                    placeholder="Password"
                    type="password"
                    inputRef={passwordRef}
                    disableUnderline
                ></Input>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={loginUser}
                >
                    Login
        </Button>
                <Link to="/register">Don't have an account? Register here!</Link>
            </form>
        </div>
    );
}
export default withRouter(LoginPage);
