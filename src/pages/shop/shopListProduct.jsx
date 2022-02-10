import React from "react";
import { SERVER_APP } from "./../../constants/config";
import { formatPriceVietnamese, checkSale } from "../../constants/format";
import _ from "lodash";
import {
  Page,
  Link,
  Toolbar,
  Navbar,
  Row,
  Col,
  Searchbar,
  Subnavbar,
} from "framework7-react";
import { getStockIDStorage } from "../../constants/user";
import ShopDataService from "./../../service/shop.service";
import ToolBarBottom from "../../components/ToolBarBottom";
import CategoriesList from "./components/CategoriesList/CategoriesList/CategoriesList";
import Skeleton from "react-loading-skeleton";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      dataNull: false,
      itemView: 8, // Số item hiển thị trên 1 Page
      arrCateList: [],
      countCateList: "",
      totalCateList: "",
      titlePage: "",
      showPreloader: false,
      allowInfinite: true,
      parentCateID: "",
      CateID: "",
      CateIDall: 662,
      currentId: 0,
      loading: false,
      keySearch: "",
    };

    this.delayedCallback = _.debounce(this.inputCallback, 400);
  }

  getDataList = (ID, pi, ps, tag, keys) => {
    //ID Cate
    //Trang hiện tại
    //Số sản phẩm trên trang
    // Tag
    //keys Từ khóa tìm kiếm
    let stockid = getStockIDStorage();
    if (!stockid) {
      stockid = 0;
    }
    ShopDataService.getList(
      ID,
      pi,
      ps,
      tag,
      keys,
      stockid,
      this.state.currentId !== "hot" || this.$f7route.params.cateId !== "hot"
        ? ""
        : "3"
    )
      .then((response) => {
        const arrCateList = response.data.data.lst;
        const countCateList = response.data.data.pcount;
        const totalCateList = response.data.data.total;
        const piCateList = response.data.data.pi;

        this.setState({
          arrCateList: arrCateList,
          countCateList: countCateList,
          totalCateList: totalCateList,
          piCateList: piCateList,
          loading: false,
        });
        if (arrCateList.length === 0) {
          this.setState({
            showPreloader: false,
            dataNull: true,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  getTitleCate = (id) => {
    const CateID = id || this.$f7route.params.cateId;
    ShopDataService.getTitleCate(CateID)
      .then((response) => {
        const titlePage = response.data.data[0].Title;
        this.setState({
          titlePage: titlePage,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  componentDidMount() {
    this.setState({
      loading: true,
    });
    this.$f7ready((f7) => {
      const parentCateID = this.$f7route.params.parentId;
      const CateID = this.$f7route.params.cateId;
      const itemView = this.state.itemView;
      this.setState({
        parentCateID: parentCateID,
        CateID: CateID,
        currentId: this.$f7route.params.cateId,
      });

      if (CateID === "hot") {
        this.setState({
          titlePage: "Hôm nay Sale gì ?",
          isTag: "hot",
        });
        this.getDataList(CateID, "1", itemView, "hot", "");
      } else {
        this.getDataList(CateID, "1", itemView, "", "");
        this.getTitleCate();
      }
    });
  }
  loadMore = () => {
    const self = this;
    const isState = self.state;
    const CateID = isState.keySearch
      ? isState.CateIDall
      : this.$f7route.params.cateId;
    const itemView = isState.itemView; // Tổng số item trên 1 page

    const tag = isState.isTag && !isState.keySearch ? isState.isTag : "";
    const keys = isState.keySearch ? isState.keySearch : "";

    let stockid = getStockIDStorage();
    if (!stockid) {
      stockid = 0;
    }

    if (!self.state.allowInfinite) return;
    self.setState({
      allowInfinite: false,
      showPreloader: true,
    });
    setTimeout(() => {
      if (isState.totalCateList <= isState.arrCateList.length) {
        self.setState({ showPreloader: false });
        return;
      }

      ShopDataService.getList(
        CateID,
        isState.piCateList + 1,
        itemView,
        tag,
        keys,
        stockid,
        this.$f7route.params.cateId === "hot" ? "3" : ""
      )
        .then((response) => {
          const arrCateList = response.data.data.lst;

          var arrCateListNew = isState.arrCateList;
          for (let item in arrCateList) {
            arrCateListNew.push(arrCateList[item]);
          }

          self.setState({
            arrCateList: arrCateListNew,
            piCateList: isState.piCateList + 1,
            allowInfinite: true,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }, 1000);
  };

  loadRefresh(done) {
    setTimeout(() => {
      const CateID = this.state.currentId || this.$f7route.params.cateId;
      const itemView = this.state.itemView;

      if (CateID === "hot") {
        this.setState({
          titlePage: "Hôm nay Sale gì ?",
          isTag: "hot",
        });
        this.getDataList(CateID, "1", itemView, "hot", "");
      } else {
        this.getDataList(CateID, "1", itemView, "", this.state.keySearch);
        this.getTitleCate();
      }
      this.setState({
        allowInfinite: true,
        showPreloader: true,
      });
      done();
    }, 1000);
  }
  inputCallback = (value) => {
    const newCateId = this.state.currentId || 794;
    const key = value;
    const itemView = this.state.itemView;
    this.getDataList(newCateId, "1", itemView, "", key);
    this.setState({
      keySearch: value,
    });
  };
  handleInputSearch = (event) => {
    const key = event.target.value;
    event.persist();
    this.delayedCallback(key);
  };

  hideSearch = () => {
    const CateID = this.state.currentId || this.$f7route.params.cateId;
    const itemView = this.state.itemView;

    if (CateID === "hot") {
      this.getDataList(CateID, "1", itemView, "hot", "");
    } else {
      this.getDataList(CateID, "1", itemView, "", "");
    }
    this.setState({
      showPreloader: false,
      dataNull: false,
      keySearch: "",
    });
  };

  changeCate = (cate) => {
    const itemView = this.state.itemView;
    this.setState({ currentId: cate.ID, loading: true });
    this.getDataList(cate.ID, "1", itemView, "", "");
    this.getTitleCate(cate.ID);
  };

  render() {
    const { arrCateList, CateID, currentId, loading } = this.state;
    return (
      <Page
        name="shop-List"
        infinite
        ptr
        infiniteDistance={50}
        infinitePreloader={this.state.showPreloader}
        onInfinite={() => this.loadMore()}
        onPtrRefresh={this.loadRefresh.bind(this)}
      >
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.$f7router.back()}>
                <i className="las la-angle-left"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">{this.state.titlePage}</span>
            </div>
            <div className="page-navbar__noti search">
              <Link searchbarEnable=".searchbar-product">
                <i className="las la-search"></i>
              </Link>
            </div>
          </div>
          <Searchbar
            className="searchbar-product"
            expandable
            customSearch={true}
            disableButton={!this.$theme.aurora}
            placeholder="Bạn cần tìm ?"
            disableButtonText="Đóng"
            clearButton={true}
            onChange={this.handleInputSearch}
            onClickClear={() => this.hideSearch()}
            onClickDisable={() => this.hideSearch()}
          ></Searchbar>
          {this.$f7route.params.cateId !== "hot" && (
            <Subnavbar className="subnavbar-prod">
              <CategoriesList
                id={CateID}
                currentId={currentId}
                changeCate={(cate) => this.changeCate(cate)}
              />
            </Subnavbar>
          )}
        </Navbar>
        <div className="page-render page-render-shop no-bg p-0">
          <div className="page-shop no-bg p-15">
            <div className="page-shop__list">
              <Row>
                {!loading &&
                  arrCateList &&
                  arrCateList.map((item, index) => (
                    <Col width="50" key={index}>
                      <a
                        href={"/shop/detail/" + item.id}
                        className="page-shop__list-item"
                      >
                        <div className="page-shop__list-img">
                          <img
                            src={SERVER_APP + "/Upload/image/" + item.photo}
                            alt={item.title}
                          />
                        </div>
                        <div className="page-shop__list-text">
                          <h3>{item.title}</h3>
                          <div
                            className={
                              "page-shop__list-price " +
                              (item.source.IsDisplayPrice !== 0 &&
                              checkSale(
                                item.source.SaleBegin,
                                item.source.SaleEnd
                              ) === true
                                ? "sale"
                                : "")
                            }
                          >
                            {item.source.IsDisplayPrice === 0 ? (
                              <span className="price">Liên hệ</span>
                            ) : (
                              <React.Fragment>
                                <span className="price">
                                  <b>₫</b>
                                  {formatPriceVietnamese(item.price)}
                                </span>
                                <span className="price-sale">
                                  <b>₫</b>
                                  {formatPriceVietnamese(item.pricesale)}
                                </span>
                              </React.Fragment>
                            )}
                          </div>
                        </div>
                      </a>
                    </Col>
                  ))}
                {loading &&
                  Array(6)
                    .fill()
                    .map((item, index) => (
                      <Col width="50" key={index}>
                        <a className="page-shop__list-item">
                          <div className="page-shop__list-img">
                            <Skeleton height={165} />
                          </div>
                          <div className="page-shop__list-text">
                            <h3>
                              <Skeleton width={125} />
                            </h3>
                            <div className={"page-shop__list-price sale"}>
                              <span className="price">
                                <Skeleton width={60} />
                              </span>
                              <span className="price-sale">
                                <Skeleton width={60} />
                              </span>
                            </div>
                          </div>
                        </a>
                      </Col>
                    ))}
              </Row>
            </div>
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
