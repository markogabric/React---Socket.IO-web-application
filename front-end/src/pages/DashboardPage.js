import "../styles/dashboard.css";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardMedia, CardContent, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    height: "240px",
    width: "260px",
    display: "flex",
    flexDirection: "column",
    margin: "30px",
    backgroundColor: "var(--input)",
    justifyContent: "center",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

function DashboardPage(props) {
  const [chatrooms, setChatrooms] = React.useState([]);
  const classes = useStyles();

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
        axios
          .get("http://localhost:8000/user/chatrooms", {})
          .then((response) => {
            setChatrooms(response.data);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        if (err.response.status === 401) {
          localStorage.setItem("AUTH_TOKEN", "");
          props.history.push("/login");
        } else {
          console.log(err);
        }
      });
      // eslint-disable-next-line
  }, []);

  const logout = () => {
    axios
      .post(
        "http://localhost:8000/user/logoutAll",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("AUTH_TOKEN"),
          },
        }
      )
      .then((res) => {
        console.log(res);
        localStorage.setItem("AUTH_TOKEN", "");
        props.history.push("/login");
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="dashboardPage">
      <div>
        <div className="dashboardHeader">
          <h1>ChatQuiz</h1>
          <Button variant="contained" color="primary" onClick={logout}>
            LOG OUT
          </Button>
        </div>
        <div className="dashboardContent">
          <div className="roomList">
            {chatrooms.map((chatroom) => (
              <Card key={chatroom.name} className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={chatroom.image}
                ></CardMedia>
                <CardContent className={classes.cardContent}>
                  <h2 className="chatroomTitle">#{chatroom.name}</h2>
                  <Link to={"chatroom/" + chatroom.name}>
                    <Button variant="contained" color="primary" type="submit">
                      Join
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


export default DashboardPage;