import { Box, IconButton } from "@mui/material";
import Slider from "react-slick/lib/slider";
import CloseIcon from "@mui/icons-material/Close";
import { memo } from "react";

function ImageSlider({ clieckRemoveImage, images, isEdit }) {
  const settings = {
    slidesToShow: 1.6,
    slidesToScroll: 1,
    arrows: false,
    infinite: false,
  };

  return (
    <Box className="image">
      <Slider {...settings}>
        {images.map((img, index) => {
          return (
            <div key={index} style={{ position: "relative" }}>
              <img
                src={img.name ? URL.createObjectURL(img) : img}
                alt={`Slide ${index}`}
              />
              {isEdit ? (
                <IconButton
                  onClick={() => clieckRemoveImage(index)}
                  style={{
                    position: "absolute",
                    top: 11,
                    left: index === 0 ? 350 : 345 * (index + 1) + 68 * index,
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                  }}
                >
                  <CloseIcon />
                </IconButton>
              ) : null}
            </div>
          );
        })}
      </Slider>
    </Box>
  );
}

export default memo(ImageSlider);
