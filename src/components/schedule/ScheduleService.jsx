import React from "react";
import { Link, ListItem, Toolbar } from "framework7-react";
import ShopDataService from "../../service/shop.service";
import ServiceHotComponent from "./service/ServiceHotComponent";
import ServiceCartComponent from "./service/ServiceCartComponent";
import ServiceSpaComponent from "./service/ServiceSpaComponent";

export default class ScheduleService extends React.Component {
  constructor() {
    super();
    this.state = {
      arrProd: [],
      activeID: 0,
      arrProdActive: [],
    };
  }
  componentDidMount() {}

  serviceSelected = (item) => {
    this.props.handleService(item);
    this.setState({
      activeID: 0,
    });
  };

  handleDataService = (item, data, loading) => {
    this.setState({
      activeID: item.OrderItemID,
    });
    this.props.handleDataService(item, data, loading);
  };
  
  handleMultiService = (item) => {
    this.props.handleService(item.length > 0 ? item : null);
    this.setState({
      activeID: 0,
    });
  };

  render() {
    const { activeID } = this.state;
    return (
      <div className="page-schedule__box">
        <div className="service-me">
          <ServiceCartComponent
            handleMultiService={(item) => this.handleMultiService(item)}
          />
        </div>
        <div className="service-hot">
          <h5>Dịch vụ nổi bật</h5>
          <ServiceHotComponent
            serviceSelected={(item) => this.serviceSelected(item)}
          />
        </div>
        <div className="service-spa">
          <h5>Dịch vụ Spa</h5>
          <ServiceSpaComponent
            handleDataService={(item, data, loading) =>
              this.handleDataService(item, data, loading)
            }
            active={activeID}
          />
        </div>
      </div>
    );
  }
}
