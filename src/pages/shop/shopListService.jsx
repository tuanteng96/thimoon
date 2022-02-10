import React from "react";
import { SERVER_APP } from "./../../constants/config";
import { formatPriceVietnamese, checkSale } from "../../constants/format";
import { getStockIDStorage } from "../../constants/user";
import {
  Page,
  Link,
  Toolbar,
  Navbar,
  Sheet,
  PageContent,
  Button,
  Searchbar,
  Subnavbar,
} from "framework7-react";
import ShopDataService from "./../../service/shop.service";
import ReactHtmlParser from "react-html-parser";
import ToolBarBottom from "../../components/ToolBarBottom";
import _ from "lodash";
import SkeletonListService from "./components/Skeleton/SkeletonListService";
import CategoriesList from "./components/CategoriesList/CategoriesList/CategoriesList";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sheetOpened: false,
      titlePage: "",
      arrService: [],
      arrSearch: [],
      isSearch: false,
      isLoading: false,
      CateID: "",
      currentId: 0,
      keySearch: "",
      idOpen: null,
    };

    this.delayedCallback = _.debounce(this.inputCallback, 400);
  }
  getService = (id) => {
    const CateID = id || this.$f7route.params.cateId;
    let stockid = getStockIDStorage();
    stockid ? stockid : 0;
    this.setState({
      isLoading: true,
    });
    ShopDataService.getServiceParent(CateID, stockid)
      .then((response) => {
        const arrServiceParent = response.data.data;
        this.setState({
          arrService: arrServiceParent,
          isLoading: false,
        });
      })
      .catch((e) => console.log(e));
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
      CateID:
        (this.$f7route.query && this.$f7route.query.cateid) ||
        this.$f7route.params.cateId,
      currentId: this.$f7route.params.cateId,
    });

    this.timer = setInterval(() => {
      if (this.$f7route.query && this.$f7route.query.ids) {
        this.setState((prevState) => ({ idOpen: this.$f7route.query.ids }));
      }
    }, 300);

    this.$f7ready((f7) => {
      this.getTitleCate();
      this.getService();
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  inputCallback = (value) => {
    const { CateID, currentId } = this.state;
    const key = value;
    ShopDataService.getSearchService(key, currentId || CateID)
      .then((response) => {
        const arrSearch = response.data.data.lst;
        this.setState({
          arrSearch: arrSearch,
          isSearch: true,
          keySearch: key,
        });
      })
      .catch((e) => console.log(e));
  };

  handleInputSearch = (event) => {
    const key = event.target.value;
    event.persist();
    this.delayedCallback(key);
  };

  hideSearch = () => {
    this.setState({
      arrSearch: [],
      isSearch: false,
      keySearch: "",
    });
  };

  loadMore(done) {
    const self = this;
    const { CateID, currentId, keySearch, isSearch } = this.state;
    setTimeout(() => {
      if (isSearch) {
        self.delayedCallback(keySearch);
      } else {
        self.getService(currentId || CateID);
      }
      this.setState({ idOpen: "" });
      done();
    }, 1000);
  }

  changeCate = (cate) => {
    this.setState({ currentId: cate.ID, idOpen: "" });
    this.getService(cate.ID);
    this.getTitleCate(cate.ID);
  };

  render() {
    const {
      arrService,
      arrSearch,
      isSearch,
      isLoading,
      CateID,
      currentId,
      idOpen,
    } = this.state;

    return (
      <Page
        name="shop-List"
        onPageBeforeOut={this.onPageBeforeOut.bind(this)}
        onPageBeforeRemove={this.onPageBeforeRemove.bind(this)}
        ptr
        onPtrRefresh={this.loadMore.bind(this)}
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
            placeholder="Dịch vụ cần tìm ?"
            disableButtonText="Đóng"
            clearButton={true}
            onChange={this.handleInputSearch}
            onClickClear={() => this.hideSearch()}
            onClickDisable={() => this.hideSearch()}
          ></Searchbar>
          <Subnavbar className="subnavbar-prod">
            <CategoriesList
              id={CateID}
              currentId={currentId}
              changeCate={(cate) => this.changeCate(cate)}
            />
          </Subnavbar>
        </Navbar>
        <div className="page-render p-0">
          <div className="page-shop p-15">
            <div className="page-shop__service">
              {isSearch === false ? (
                <>
                  {isLoading && <SkeletonListService />}
                  {!isLoading && (
                    <div className="page-shop__service-list">
                      {arrService &&
                        arrService.map((item, index) => (
                          <div
                            className="page-shop__service-item"
                            key={item.root.ID}
                          >
                            <div className="page-shop__service-item service-about">
                              <div className="service-about__img">
                                <img
                                  src={
                                    SERVER_APP +
                                    "/Upload/image/" +
                                    item.root.Thumbnail
                                  }
                                  alt={item.root.Title}
                                />
                              </div>
                              {item.root.Desc !== "" ? (
                                <div className="service-about__content">
                                  <div className="service-about__content-text">
                                    {ReactHtmlParser(item.root.Desc)}
                                  </div>
                                  <Button
                                    fill
                                    sheetOpen={`.demo-sheet-${item.root.ID}`}
                                    className="show-more"
                                  >
                                    Chi tiết{" "}
                                    <i className="las la-angle-right"></i>
                                  </Button>
                                  <Sheet
                                    opened={Number(idOpen) === item.root.ID}
                                    className={`demo-sheet-${item.root.ID} sheet-detail`}
                                    style={{
                                      height: "auto",
                                      "--f7-sheet-bg-color": "#fff",
                                    }}
                                    //swipeToClose
                                    backdrop
                                  >
                                    <Button
                                      sheetClose={`.demo-sheet-${item.root.ID}`}
                                      className="show-more"
                                    >
                                      <i className="las la-times"></i>
                                    </Button>
                                    <PageContent>
                                      <div className="page-shop__service-detail">
                                        <div className="title">
                                          <h4>{item.root.Title}</h4>
                                        </div>
                                        <div className="content">
                                          {ReactHtmlParser(item.root.Desc)}
                                          {ReactHtmlParser(item.root.Detail)}
                                        </div>
                                      </div>
                                    </PageContent>
                                  </Sheet>
                                </div>
                              ) : (
                                ""
                              )}
                              <div className="service-about__list">
                                <ul>
                                  {item.items.map((subitem) => (
                                    <li key={subitem.ID}>
                                      <Link href={"/shop/detail/" + subitem.ID}>
                                        <div className="title">
                                          {subitem.Title}
                                        </div>
                                        <div
                                          className={
                                            "price " +
                                            (subitem.IsDisplayPrice !== 0 &&
                                            checkSale(
                                              subitem.SaleBegin,
                                              subitem.SaleEnd
                                            ) === true
                                              ? "sale"
                                              : "")
                                          }
                                        >
                                          {subitem.IsDisplayPrice === 0 ? (
                                            <span className="price-to">
                                              Liên hệ
                                            </span>
                                          ) : (
                                            <React.Fragment>
                                              <span className="price-to">
                                                {formatPriceVietnamese(
                                                  subitem.PriceProduct
                                                )}
                                                <b>đ</b>
                                              </span>
                                              <span className="price-sale">
                                                {formatPriceVietnamese(
                                                  subitem.PriceSale
                                                )}
                                                <b>đ</b>
                                              </span>
                                            </React.Fragment>
                                          )}
                                        </div>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="page-shop__service-list">
                  <div className="page-shop__service-item">
                    <div className="page-shop__service-item service-about">
                      <div className="service-about__list">
                        <ul>
                          {arrSearch &&
                            arrSearch.map((item) => (
                              <li key={item.id}>
                                <Link href={"/shop/detail/" + item.id}>
                                  <div className="title">{item.title}</div>
                                  <div
                                    className={
                                      "price " +
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
                                      <span className="price-to">Liên hệ</span>
                                    ) : (
                                      <React.Fragment>
                                        <span className="price-to">
                                          {formatPriceVietnamese(
                                            item.source.PriceProduct
                                          )}
                                          <b>đ</b>
                                        </span>
                                        <span className="price-sale">
                                          {formatPriceVietnamese(
                                            item.source.PriceSale
                                          )}
                                          <b>đ</b>
                                        </span>
                                      </React.Fragment>
                                    )}
                                  </div>
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }

  onPageBeforeOut() {
    const self = this;
    // Close opened sheets on page out
    self.$f7.sheet.close();
  }
  onPageBeforeRemove() {
    const self = this;
    // Destroy sheet modal when page removed
    if (self.sheet) self.sheet.destroy();
  }
}
