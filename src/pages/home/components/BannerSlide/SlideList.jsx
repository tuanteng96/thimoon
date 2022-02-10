import React from "react";
import { Link } from "framework7-react";
import NewsDataService from "../../../../service/news.service";
import Slider from "react-slick";
import { SERVER_APP } from "../../../../constants/config";
import Skeleton from "react-loading-skeleton";
export default class SlideList extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getBanner();
  }

  getBanner = () => {
    NewsDataService.getBannerName(this.props.BannerName)
      .then((response) => {
        const arrBanner = response.data.data;
        this.setState({
          arrBanner: arrBanner,
          isLoading: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  render() {
    const { arrBanner, isLoading } = this.state;
    var settingsBanner = {
      dots: true,
      arrows: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
    };
    return (
      <div className="body-slide">
        {isLoading && <Skeleton height={150} />}

        <Slider {...settingsBanner}>
          {!isLoading && arrBanner &&
            arrBanner.map((item, index) => {
              if (index >= 5) return null;
              return (
                <Link
                  noLinkClass
                  href={item.Link ? item.Link : `/adv/${item.ID}`}
                  className={`body-slide__item rounded overflow-hidden ${
                    item.Follow === "true" ? "external" : ""
                  }`}
                  key={item.ID}
                >
                  <img
                    src={SERVER_APP + "/Upload/image/" + item.FileName}
                    alt={item.Title}
                  />
                </Link>
              );
            })}
        </Slider>
      </div>
    );
  }
}
