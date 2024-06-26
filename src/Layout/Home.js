import { Button, Container, Grid, List, ListItem, Paper } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
// import Swiper from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import logo from "../Images/contactLogo0.png";
import bgImage from "../Images/backgroundLogo.png";
import { useState, useEffect } from "react";
import { Image } from "./image";

import { Header } from "../Component/Header";

import { Footer } from "../Component/Footer";
import { apiRequest } from "../Util/axiosInstance";
import Loading from "../Component/Loading";
function generateRandomSessionId(length = 32) {
  // Characters that can be used in the session ID
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  // Create an array to hold the random values
  const randomValues = new Uint8Array(length);

  // Fill the array with random values
  window.crypto.getRandomValues(randomValues);

  // Convert the random values to characters from the `characters` set
  let sessionId = "";
  for (let i = 0; i < length; i++) {
    sessionId += characters[randomValues[i] % charactersLength];
  }

  return sessionId;
}
export function Home(props) {
  //   alert(props.isMobileLandscape);
  //   alert(props.isMobile);
  //   console.log(props);
  if (!sessionStorage.getItem("artSessionId")) {
    sessionStorage.setItem("artSessionId", generateRandomSessionId());
  }

  const openArtPage = () => {
    window.location.href = "/viewartlist";
  };

  const [image, setImage] = new useState(Image);
  const imageOverlay = {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "10px",
    borderRadius: "20px",
    textAlign: "left",
    left: "12px",
    color: "white",
    fontSize: "1rem",
    marginLeft: "5%",
    maxWidth: "60%",
    fontFamily: "serif",
    overflow: "hidden",
    // marginTop: props.isMobile ? "-10%" : "",
  };
  const imageOverlayMini = {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "10px",
    borderRadius: "20px",
    textAlign: "left",
    left: "12px",
    color: "white",
    fontSize: props.isMobile ? "0.8rem" : "1rem",
    marginLeft: "5%",
    maxWidth: props.isMobile ? "78%" : "80%",
    maxHeight: props.isMobile ? "40px" : "8rem",
    minHeight: props.isMobile ? "40px" : "",
    fontFamily: "serif",
    overflow: "hidden",
  };

  const [activeSlide, setActiveSlide] = new useState(0);
  const [slideImages, setSlideImages] = new useState([]);
  const [slideIndices, setSlideIndices] = new useState([]);
  const [corouselImages, setCorouselImages] = useState([]);

  const [gridImages, setGridImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        var user = "user";
        if (sessionStorage.loggedIn == "true") {
          user = "admin";
        }
        const metricsResult = await apiRequest(
          "GET",
          "/capturPageVisits/" +
            user +
            "/" +
            sessionStorage.getItem("artSessionId")
        ); // Replace with your API endpoint
        // console.log(metricsResult);

        const result = await apiRequest("GET", "/corouselDocuments"); // Replace with your API endpoint
        // console.log(result);
        // console.log(result[0].)
        var corImgs = [];
        var slImgs = [];
        var slInd = [];
        for (var image in result) {
          if (image < 3) {
            corImgs.push(JSON.parse(result[image].image1).image);
            slImgs.push({
              name: result[image].name,
              size: result[image].height + '" x ' + result[image].width + '"',
            });
            slInd.push(image);
          }
          //   console.log();
        }
        // console.log(typeof result);
        // console.log(corImgs);
        setSlideIndices(slInd);
        setCorouselImages(corImgs);
        setSlideImages(slImgs);

        const result1 = await apiRequest("GET", "/homeGridDocuments"); // Replace with your API endpoint
        setGridImages(result1);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        // setLoading(false);
        window.scrollTo(0, 0);
      }
    };

    fetchData();
  }, [image]);

  const [swiper, setSwiper] = useState(null);
  return (
    <div>
      {/* <ToolBar /> */}
      <Header
        isMobile={props.isMobile}
        isMobileLandscape={props.isMobileLandscape}
      ></Header>
      {corouselImages.length < 1 ? (
        <Loading
          isMobile={props.isMobile}
          isMobileLandscape={props.isMobileLandscape}
          isHome={true}
        />
      ) : null}
      <div>
        {corouselImages.length > 0 ? (
          <Swiper
            onSlideChange={(event) => {
              //   console.log(event.activeIndex);
              setActiveSlide(event.activeIndex);
            }}
            //   pagination={true}
            modules={[Pagination]}
            className="mySwiper"
            onSwiper={setSwiper}
          >
            {corouselImages.map((corouselImage) => {
              return (
                <SwiperSlide>
                  <div
                    className="slide"
                    style={{
                      width: "100%",
                      backgroundImage: `url(${corouselImage})`,
                      //   backgroundColor: "#ccccc",
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      // backgroundRepeat: "",
                      height: props.isMobile ? "30vh" : "100vh",
                    }}
                  >
                    &nbsp;
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : null}
        {slideImages.length > 0 ? (
          <div
            style={{
              zIndex: "5",
              marginTop: props.isMobileLandscape
                ? "-30%"
                : props.isMobile
                ? // ? "-37%"
                  "-15%"
                : "-18%",
              position: "absolute",
              // marginLeft: "41.5%",
              width: "100vw",
              border: "none",
            }}
          >
            <div className="center">
              {/* <Link to="/viewartlist"> */}
              {!props.isMobile ? (
                <>
                  <p
                    style={{
                      fontSize: props.isMobile ? "1.5rem" : "2rem",
                      color: "white",
                      marginBottom: "0",
                      textTransform: "capitalize",
                      fontFamily: "serif",
                    }}
                  >
                    {slideImages[activeSlide].name}
                  </p>
                  <p
                    style={{
                      fontSize: props.isMobile ? "0.8rem" : "1rem",
                      color: "white",
                      marginTop: "0%",
                      marginBotton: "2%",
                    }}
                  >
                    {slideImages[activeSlide].size}
                  </p>
                </>
              ) : null}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: "0%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100px",
                    justifyContent: "space-evenly",
                    // marginTop: "-1%",
                  }}
                >
                  {/* <p> */}
                  {slideIndices.map((item) => (
                    <div
                      style={{
                        width: "5px",
                        border: "2px solid white",
                        lineHeight: props.isMobile ? "0.33rem" : "0.3rem",
                        borderRadius: "50%",
                        backgroundColor:
                          item == activeSlide ? "white" : "transparent",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        swiper.slideTo(item);
                      }}
                    >
                      &nbsp;
                    </div>
                  ))}
                  {/* </p> */}
                </div>
              </div>
              <button
                //   variant="outlined"
                style={{
                  color: "black",
                  //   border: "1px solid black",
                  borderRadius: props.isMobile ? "12px" : "20px",

                  height: props.isMobile ? "25px" : "30px",
                  width: props.isMobile ? "130px" : "150px",
                  backgroundColor: "white",
                  border: "1px solid white",
                  fontSize: props.isMobile ? "0.6rem" : "0.7rem",
                  fontWeight: "600",
                  // className: "bold",
                  marginTop: "3%",
                  cursor: "pointer",
                }}
                onClick={openArtPage}
              >
                View All My Artwork
              </button>{" "}
              {/* </Link> */}
            </div>
          </div>
        ) : null}
      </div>
      <div style={{ backgroundImage: `url(${bgImage})` }}>
        <Container fixed>
          {/* <Paper className="paper"> */}
          <p
            className="text17"
            style={{
              fontSize: props.isMobileLandscape
                ? "2rem"
                : props.isMobile
                ? "1.05rem"
                : "3rem",
              padding: props.isMobile ? "5%" : "",
              paddingBottom: props.isMobile ? "0%" : "",
              paddingTop: props.isMobile ? "2%" : "",
            }}
          >
            Anwar is a canvas storyteller, capturing the essence of his thoughts
            and feelings, leaving an incredlible mark on the observer's soul. In
            the silent dialogue between Anwar and his canvas, a world unfolds,
            inviting others to share in the beauty of their unique perspective.
          </p>
          {/* </Paper> */}
          {gridImages.length < 1 ? (
            <Loading
              isMobile={props.isMobile}
              isMobileLandscape={props.isMobileLandscape}
            />
          ) : null}
          {gridImages.length == 6 ? (
            <div>
              <p className="bold" style={{ fontSize: "1.5rem" }}>
                Recent work{" "}
              </p>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    marginBottom: "2%",
                    backgroundImage: `url(${
                      JSON.parse(gridImages[0].image1).image
                    })`,
                    borderRadius: "20px",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    height: props.isMobile ? "260px" : "30rem",
                    minHeight: props.isMobile ? "60px" : "20rem",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    window.location.href =
                      "/artDetails/" + gridImages[0]._id["$oid"];
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        minHeight: props.isMobile ? "70px" : "10rem",
                      }}
                    >
                      &nbsp;
                    </div>
                    <div
                      style={{
                        width: "100%",
                        minHeight: props.isMobile ? "70px" : "10rem",
                      }}
                    >
                      &nbsp;
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "30%",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <div
                        style={{ width: props.isMobile ? "100%" : "50%" }}
                        className="overlay-text"
                      >
                        <div style={imageOverlay}>
                          <p style={{ textTransform: "capitalize" }}>
                            {gridImages[0].name}
                          </p>
                          <p>
                            Acrylic on canvas - {gridImages[0].height}" x{" "}
                            {gridImages[0].width}"
                          </p>
                        </div>
                      </div>
                      {/* <div style={{ width: "25%" }}></div> */}
                      {!props.isMobile ? (
                        <div style={{ width: "25%" }}></div>
                      ) : null}
                      {!props.isMobile ? (
                        <div style={{ width: "25%" }}></div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: props.isMobile ? "row" : "row",
                    justifyContent: "space-between",
                    marginBottom: "2%",
                    height: props.isMobile ? "200px" : "",
                  }}
                >
                  <div
                    style={{
                      width: props.isMobile ? "49%" : "49%",
                      marginBottom: "2%",
                      backgroundImage: `url(${
                        JSON.parse(gridImages[1].image1).image
                      })`,
                      borderRadius: "20px",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: props.isMobile ? "" : "30rem",
                      minHeight: props.isMobile ? "" : "20rem",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      window.location.href =
                        "/artDetails/" + gridImages[1]._id["$oid"];
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          minHeight: props.isMobile ? "60px" : "10rem",
                        }}
                      >
                        &nbsp;
                      </div>
                      <div
                        style={{
                          width: "100%",
                          minHeight: props.isMobile ? "60px" : "10rem",
                        }}
                      >
                        &nbsp;
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "30%",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <div
                          style={{ width: props.isMobile ? "100%" : "60%" }}
                          className="overlay-text"
                        >
                          <div style={imageOverlayMini}>
                            <p style={{ textTransform: "capitalize" }}>
                              {gridImages[1].name}
                            </p>
                            {!props.isMobile ? (
                              <p>
                                Acrylic on canvas - {gridImages[1].height}" x{" "}
                                {gridImages[1].width}"
                              </p>
                            ) : null}
                          </div>
                        </div>
                        {/* <div style={{ width: "25%" }}></div> */}
                        {/* <div style={{ width: "25%" }}></div>
                    <div style={{ width: "25%" }}></div> */}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      width: props.isMobile ? "49%" : "49%",
                      marginBottom: "2%",
                      backgroundImage: `url(${
                        JSON.parse(gridImages[2].image1).image
                      })`,
                      borderRadius: "20px",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: props.isMobile ? "" : "30rem",
                      minHeight: props.isMobile ? "" : "20rem",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      window.location.href =
                        "/artDetails/" + gridImages[2]._id["$oid"];
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          minHeight: props.isMobile ? "60px" : "10rem",
                        }}
                      >
                        &nbsp;
                      </div>
                      <div
                        style={{
                          width: "100%",
                          minHeight: props.isMobile ? "60px" : "10rem",
                        }}
                      >
                        &nbsp;
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "30%",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <div
                          style={{ width: props.isMobile ? "100%" : "60%" }}
                          className="overlay-text"
                        >
                          <div style={imageOverlayMini}>
                            <p style={{ textTransform: "capitalize" }}>
                              {gridImages[2].name}
                            </p>
                            {!props.isMobile ? (
                              <p>
                                Acrylic on canvas - {gridImages[2].height}" x{" "}
                                {gridImages[2].width}"
                              </p>
                            ) : null}
                          </div>
                        </div>
                        {/* <div style={{ width: "25%" }}></div> */}
                        {/* <div style={{ width: "25%" }}></div>
                    <div style={{ width: "25%" }}></div> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    marginBottom: "2%",
                    backgroundImage: `url(${
                      JSON.parse(gridImages[3].image1).image
                    })`,
                    borderRadius: "20px",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    height: props.isMobile ? "260px" : "30rem",
                    minHeight: props.isMobile ? "60px" : "20rem",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    window.location.href =
                      "/artDetails/" + gridImages[3]._id["$oid"];
                  }}
                >
                  {/* <img
                src={`data:image/png;base64,${image}`}
                alt="Fire in the field"
                style={{ width: "100%", borderRadius: "20px" }}
                //   height={"%"}
              /> */}

                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        minHeight: props.isMobile ? "70px" : "10rem",
                      }}
                    >
                      &nbsp;
                    </div>
                    <div
                      style={{
                        width: "100%",
                        minHeight: props.isMobile ? "70px" : "10rem",
                      }}
                    >
                      &nbsp;
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "30%",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <div style={{ width: props.isMobile ? "100%" : "50%" }}>
                        <div style={imageOverlay} className="overlay-text">
                          <p style={{ textTransform: "capitalize" }}>
                            {gridImages[3].name}
                          </p>
                          <p>
                            Acrylic on canvas - {gridImages[3].height}" x{" "}
                            {gridImages[3].width}"
                          </p>
                        </div>
                      </div>
                      {/* <div style={{ width: "25%" }}></div> */}
                      {!props.isMobile ? (
                        <div style={{ width: "25%" }}></div>
                      ) : null}
                      {!props.isMobile ? (
                        <div style={{ width: "25%" }}></div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: props.isMobile ? "row" : "row",
                    justifyContent: "space-between",
                    marginBottom: "2%",
                    height: props.isMobile ? "200px" : "",
                  }}
                >
                  <div
                    style={{
                      width: props.isMobile ? "49%" : "49%",
                      marginBottom: "2%",
                      backgroundImage: `url(${
                        JSON.parse(gridImages[4].image1).image
                      })`,
                      borderRadius: "20px",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: props.isMobile ? "" : "30rem",
                      minHeight: props.isMobile ? "" : "20rem",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      window.location.href =
                        "/artDetails/" + gridImages[4]._id["$oid"];
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          minHeight: props.isMobile ? "60px" : "10rem",
                        }}
                      >
                        &nbsp;
                      </div>
                      <div
                        style={{
                          width: "100%",
                          minHeight: props.isMobile ? "60px" : "10rem",
                        }}
                      >
                        &nbsp;
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "30%",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <div style={{ width: props.isMobile ? "100%" : "60%" }}>
                          <div
                            style={imageOverlayMini}
                            className="overlay-text"
                          >
                            <p style={{ textTransform: "capitalize" }}>
                              {gridImages[4].name}
                            </p>
                            {!props.isMobile ? (
                              <p>
                                Acrylic on canvas - {gridImages[4].height}" x{" "}
                                {gridImages[4].width}"
                              </p>
                            ) : null}
                          </div>
                        </div>
                        {/* <div style={{ width: "25%" }}></div> */}
                        {/* <div style={{ width: "25%" }}></div>
                    <div style={{ width: "25%" }}></div> */}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      width: props.isMobile ? "49%" : "49%",
                      marginBottom: "2%",
                      backgroundImage: `url(${
                        JSON.parse(gridImages[5].image1).image
                      })`,
                      borderRadius: "20px",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: props.isMobile ? "" : "30rem",
                      minHeight: props.isMobile ? "" : "20rem",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      window.location.href =
                        "/artDetails/" + gridImages[5]._id["$oid"];
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          minHeight: props.isMobile ? "60px" : "10rem",
                        }}
                      >
                        &nbsp;
                      </div>
                      <div
                        style={{
                          width: "100%",
                          minHeight: props.isMobile ? "60px" : "10rem",
                        }}
                      >
                        &nbsp;
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "30%",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <div style={{ width: props.isMobile ? "100%" : "60%" }}>
                          <div
                            style={imageOverlayMini}
                            className="overlay-text"
                          >
                            <p style={{ textTransform: "capitalize" }}>
                              {gridImages[5].name}
                            </p>
                            {!props.isMobile ? (
                              <p>
                                Acrylic on canvas - {gridImages[5].height}" x{" "}
                                {gridImages[5].width}"
                              </p>
                            ) : null}
                          </div>
                        </div>
                        {/* <div style={{ width: "25%" }}></div> */}
                        {/* <div style={{ width: "25%" }}></div>
                    <div style={{ width: "25%" }}></div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <br />
              <br />
              <div className="center">
                {/* <Link to="/viewartlist"> */}
                <button
                  //   variant="outlined"
                  style={{
                    color: "black",
                    border: "1px solid black",
                    borderRadius: "20px",

                    height: "30px",
                    width: "150px",
                    backgroundColor: "white",
                    cursor: "pointer",
                  }}
                  onClick={openArtPage}
                >
                  View All My Artwork
                </button>{" "}
                {/* </Link> */}
              </div>
            </div>
          ) : null}
          <div style={{ display: "flex", marginTop: "5%" }}>
            <div style={{ margin: "auto" }}>
              <img src={logo} />
            </div>
          </div>
          <div>
            <p
              className="text17"
              style={{
                fontSize: props.isMobileLandscape
                  ? "1.5rem"
                  : props.isMobile
                  ? "1rem"
                  : "2rem",
                textAlign: "center",
              }}
            >
              In my gallery of strokes, you'll find yourself transported into
              contemplative spaces, where the interplay of light and shadow,
              color and form, invites you to interpret and engage.
            </p>
          </div>
        </Container>
      </div>
      <Footer
        isMobile={props.isMobile}
        isMobileLandscape={props.isMobileLandscape}
      ></Footer>
    </div>
  );
}
