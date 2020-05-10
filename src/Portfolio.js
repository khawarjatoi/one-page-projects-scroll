import React, { useRef, createRef } from "react";
import { TimelineLite, Power1 } from "gsap/all";

const Portfolio = props => {
  const ul = useRef(null);
  const lis = useRef([]);
  const previews = useRef([]);
  const previewContainer = useRef(null);
  const transitionDiv = useRef(null);

  let canSlide = true;
  let slideDown = true;
  let activeProject = 0;
  let previousProject = 0;
  let mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };
  let start = {
    x: 0,
    y: 0
  };
  const imgsCount = ["img", "img"];

  function onWheel(e) {
    var tl = new TimelineLite();
    if (canSlide) {
      canSlide = false;
      previousProject = activeProject;

      activeProject =
        e.deltaY > 0 ? (activeProject += 1) : (activeProject -= 1);
      slideDown = Math.sign(e.deltaY) === 1 ? true : false;

      // Keep active project in current slide arr
      activeProject = activeProject < 0 ? 0 : activeProject;
      activeProject =
        activeProject > lis.current.length - 1
          ? lis.current.length - 1
          : activeProject;

      if (
        (previousProject === 0 && slideDown === false) ||
        (previousProject === lis.current.length - 1 && slideDown === true)
      ) {
        // We can't slide, reset canslide
        canSlide = true;
      } else {
        // Slide project
        tl.to(ul.current, 1, {
          y: -lis.current[activeProject].offsetTop,
          ease: Power1.easeOut,
          onComplete: () => {
            canSlide = true;
          }
        });

        // Change project color
        tl.to(
          lis.current[activeProject],
          1,
          { color: "#333", ease: Power1.easeInOut },
          0
        );
        tl.to(
          lis.current[previousProject],
          1,
          { color: "grey", ease: Power1.easeInOut },
          0
        );

        // Change description opacity
        tl.to(
          lis.current[previousProject].children[3],
          1,
          { opacity: 0, ease: Power1.easeInOut },
          0
        );
        tl.to(lis.current[activeProject].children[3], 1, {
          opacity: 1,
          ease: Power1.easeInOut
        });

        // Change transition div height
        tl.to(
          transitionDiv.current,
          0.5,
          {
            height: "100%",
            ease: Power1.easeInOut,
            onStart: function() {
              if (slideDown) {
                transitionDiv.current.style.bottom = 0;
                transitionDiv.current.style.top = "auto";
              } else {
                transitionDiv.current.style.top = 0;
                transitionDiv.current.style.bottom = "auto";
              }
            },
            onComplete: function() {
              if (slideDown) {
                transitionDiv.current.style.top = 0;
                transitionDiv.current.style.bottom = "auto";
              } else {
                transitionDiv.current.style.bottom = 0;
                transitionDiv.current.style.top = "auto";
              }
            }
          },
          0
        );

        tl.to(
          transitionDiv.current,
          0.5,
          { height: 0, ease: Power1.easeInOut },
          0.5
        );

        // Select right image
        tl.to(previews.current[activeProject], 0, { display: "block" }, 0.5);
        tl.to(previews.current[previousProject], 0, { display: "none" }, 0.5);

        // Select right link
        if (activeProject === 0) {
          previewContainer.current.removeAttribute("href");
          previewContainer.current.removeAttribute("target");
        } else {
          previewContainer.current.setAttribute(
            "href",
            previews.current[activeProject].getAttribute("link")
          );
          previewContainer.current.setAttribute("target", "_blank");
        }
      }
    }
  }

  previews.current = Array(imgsCount)
    .fill()
    .map((_, i) => previews.current[i] || createRef());
  //   useEffect(() => {
  //     previews.current = previews.current.slice(0, imgsCount);
  //  }, [imgsCount]);

  function onMouseMove(e) {
    mouse = {
      x: e.clientX - window.innerWidth / 2,
      y: e.clientY - window.innerHeight / 2
    };

    imgsCount.forEach((preview, i) => {
      previews.current[i].style.transform = `translate(${mouse.x *
        0.05}px, ${mouse.y * 0.05}px)`;
      previewContainer.current.style.transform = `translate(${mouse.x *
        0.08}px, ${mouse.y * 0.08}px)`;
    });
  }

  function touchStart(event) {
    start.x = event.touches[0].pageX;
    start.y = event.touches[0].pageY;
  }

  function touchMove(event) {
    event.deltaY = start.y - event.touches[0].pageY;
    onWheel(event);
  }

  return (
    <div
      className="mainContainer"
      onMouseMove={onMouseMove}
      onWheel={onWheel}
      onTouchStart={touchStart}
      onTouchMove={touchMove}
    >
      <ul
        className="containerr"
        ref={ul}
        style={{ transform: "matrix(1, 0, 0, 1, 0, 0)" }}
      >
        <li style={{ color: "#333" }} ref={li => (lis.current[0] = li)}>
          <h2>Lorem Ipsum</h2>
          <p className="technos">Javascript, Node.js</p>
          <p className="date">April 2018</p>
          <p className="description" style={{ opacity: 1 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et
            nunc ante.
            <br />
            <br />
            Class aptent taciti sociosqu ad litora torquent per conubia nostra,
            per inceptos himenaeos. Pellentesque laoreet metus quis erat
            tincidunt, sed rhoncus tellus iaculis. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
          </p>
        </li>

        <li style={{ color: "#333" }} ref={li => (lis.current[1] = li)}>
          <h2>Condimentum</h2>
          <p className="technos">React, Node.js, Next.js</p>
          <p className="date">Des 2019</p>
          <p className="description" style={{ opacity: 0 }}>
            Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
            consectetur, adipisci velit
            <br />
            <br />
            Aliquam eu tempor quam. Proin venenatis efficitur bibendum. Proin eu
            ex a mauris lobortis laoreet. Duis maximus blandit ligula in cursus.
            Vestibulum condimentum scelerisque magna, et hendrerit neque blandit
            eget. Aliquam quis tincidunt ante.
          </p>
        </li>
      </ul>

      <a className="previewContainer" ref={previewContainer} href="#!">
        <div className="overflowContainer">
          <img
            src="https://cdn.pixabay.com/photo/2015/01/08/18/24/programming-593312_1280.jpg"
            link="https://cdn.pixabay.com/photo/2015/01/08/18/24/programming-593312_1280.jpg"
            alt=""
            style={{ display: "block" }}
            ref={img => (previews.current[0] = img)}
          />
          <img
            src="https://image.shutterstock.com/image-vector/web-development-coding-cross-platform-600w-1128653108.jpg"
            link="https://image.shutterstock.com/image-vector/web-development-coding-cross-platform-600w-1128653108.jpg"
            alt=""
            style={{ display: "none" }}
            ref={img => (previews.current[1] = img)}
          />
        </div>

        <div
          className="transition"
          ref={div => (transitionDiv.current = div)}
          style={{ bottom: "0px", top: "auto", height: "0px" }}
        />
      </a>
    </div>
  );
};

export default Portfolio;
