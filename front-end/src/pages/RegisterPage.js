import React from "react";
import axios from "axios";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import "../styles/register.css";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

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

const RegisterPage = (props) => {
    const usernameRef = React.createRef();
    const emailRef = React.createRef();
    const passwordRef = React.createRef();
    const classes = useStyles();
    const [error, setError] = React.useState("");

    const registerUser = () => {
        const username = usernameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        axios
            .post("http://localhost:8000/user/register", {
                username,
                email,
                password,
            })
            .then((response) => {
                props.history.push("/login");
            })
            .catch((err) => {
                setError(err.response.data.message);
            });
    };

    return (
        <div className="registerPage">
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <h2 className="registerHeader">Register</h2>
            <form autoComplete="off" onSubmit={registerUser} className="registerBody">
            <p className="errorMessage">{error}</p>
                <Input
                    className={classes.input}
                    placeholder="Username"
                    label="Filled"
                    inputRef={usernameRef}
                    disableUnderline
                    required
                ></Input>
                <Input
                    className={classes.input}
                    placeholder="Email"
                    label="Filled"
                    inputRef={emailRef}
                    disableUnderline
                    autoComplete="off"
                    required
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
                    onClick={registerUser}
                >
                    Register
        </Button>
                <Link to="/login">Already have an account? Login here!</Link>
            </form>
        </div>
    );
};

export default RegisterPage;
