<template>
  <div class="overview">
    <div class="loader" v-if="loading">
      <img src="../assets/img/news.svg" alt="" />
      <b-spinner></b-spinner>
    </div>
    <div class="main" v-else>
      <div class="header">
        <h2>
          <span
            ><img
              class="news-logo"
              src="../assets/img/news-white.svg"
              width="20"
              alt=""
          /></span>
          THE DAILY NEWS
        </h2>
      </div>
      <div class="content">
        <div class="section">
          <section class="first">
            <div class="tags">
              <h6>Filter by Author</h6>
              <b-badge
                class="tag"
                v-for="(item, index) in news.sources"
                :key="index"
                variant="light"
                @click="selectTag(item)"
                :class="{ selected: item.$$active }"
                >{{ item.author }}</b-badge
              >
            </div>
          </section>
          <section class="left-section">
            <h3>Top Stories</h3>
            <p class="date-today">{{ dateToday }}</p>
            <div class="today-content">
              <div v-if="filteredNews.length < 1">
                <div
                  class="today-news"
                  v-for="(item, index) in news.data"
                  :key="index"
                >
                  <img :src="item.image" alt="" v-if="item.image !== 'None'" />
                  <div v-else class="alt-image">
                    <!-- <img src="../assets/img/news-alt.jpg" alt="" /> -->
                  </div>
                  <h5>{{ item.title }}</h5>
                  <p>
                    <span class="author" v-if="item.author !== null"
                      >{{ item.author }}
                      <span style="font-size:15px;">&#9679;</span> </span
                    ><span class="date"> {{ item.$$date }}</span>
                  </p>
                  <a :href="item.url" target="_blank">Read more</a>
                </div>
              </div>
              <div v-else>
                <div
                  class="today-news"
                  v-for="(item, index) in filteredNews"
                  :key="index"
                >
                  <img :src="item.image" alt="" v-if="item.image !== 'None'" />
                  <div v-else class="alt-image">
                    <!-- <img src="../assets/img/news.svg" alt="" /> -->
                  </div>
                  <h5>{{ item.title }}</h5>
                  <p>
                    <span class="author" v-if="item.author !== null"
                      >{{ item.author }}
                      <span style="font-size:15px;">&#9679;</span> </span
                    ><span class="date"> {{ item.$$date }}</span>
                  </p>
                  <a :href="item.url" target="_blank">Read more</a>
                </div>
              </div>
            </div>
          </section>

          <section class="right-section">
            <h5>Yesterday Stories</h5>
            <p class="date-today">{{ dateYesterday }}</p>
            <div class="yesterday">
              <div
                class="yesterday-content"
                v-for="(item, index) in yesterdayNews.data"
                :key="index"
              >
                <img :src="item.image" alt="" v-if="item.image !== 'None'" />
                <div v-else class="yesterday-alt-image">
                  <!-- <img src="../assets/img/news.svg" alt="" /> -->
                </div>
                <div class="card-content">
                  <h6>{{ item.title }}</h6>
                  <p>
                    <span class="author" v-if="item.author !== null"
                      >{{ item.author }}
                      <span style="font-size:15px;">&#9679;</span> </span
                    ><span class="date"> {{ item.$$date }}</span>
                  </p>
                  <a :href="item.url" target="_blank">Read more</a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require('axios');
import moment from 'moment';

export default {
  name: 'Overview',
  data() {
    return {
      currentsApiKey: process.env.VUE_APP_CURRENTSAPIKEY,
      ipDataKey: process.env.VUE_APP_IPDATAKEY,
      news: [],
      yesterdayNews: [],
      loading: true,
      dateToday: moment().format('MMMM Do YYYY'),
      dateYesterday: moment()
        .subtract(1, 'days')
        .format('MMMM Do YYYY'),
      selectedSources: [],
      filteredNews: [],
    };
  },
  created() {
    this.getNews();
    this.getNewsYesterday();
  },
  methods: {
    init(data) {
      const news = data
        .map((val) => {
          val.published = moment(val.published).format();
          val['$$date'] = moment(val.published).calendar();
          val['$$active'] = false;
          return val;
        })
        .reduce((arr, obj) => {
          arr['data'] = arr['data'] || [];
          arr['sources'] = arr['sources'] || [];
          arr['data'].push(obj);
          arr['sources'].push({
            $$active: false,
            author: obj.author,
          });

          arr['sources'] = arr['sources'].filter(
            (source, index, self) =>
              self.findIndex((s) => s.author === source.author) === index
          );

          return arr;
        }, {});

      return news;
    },
    getNews() {
      axios
        .get(`https://api.ipdata.co?api-key=${this.ipDataKey}`)
        .then((response) => {
          return axios.get(
            `https://api.currentsapi.services/v1/search?country=${response.data.country_code}&apiKey=${this.currentsApiKey}`
          );
        })
        .then((response) => {
          this.news = this.init(response.data.news);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getNewsYesterday() {
      const startDate = moment()
        .subtract(2, 'days')
        .format('YYYY-MM-DDT00:00:00');
      const endDate = moment()
        .subtract(2, 'days')
        .format('YYYY-MM-DDT23:59:59');
      axios
        .get(`https://api.ipdata.co?api-key=${this.ipDataKey}`)
        .then((response) => {
          return axios.get(
            `https://api.currentsapi.services/v1/search?country=${response.data.country_code}&start_date=${startDate}&end_date=${endDate}&apiKey=${this.currentsApiKey}`
          );
        })
        .then((response) => {
          this.yesterdayNews = this.init(response.data.news);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    selectTag(value) {
      const selectedSources = this.news.sources.map((source) => {
        if (value.author === source.author) {
          source.$$active = !source.$$active;
        }
        return source;
      });

      this.news.sources = selectedSources;

      const news = this.news.data.map((news) => {
        if (value.author === news.author) {
          news.$$active = !news.$$active;
        }
        return news;
      });

      this.filteredNews = news.filter((news) => {
        return news.$$active === true;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
h5 {
  line-height: 1.1em;
}

p,
h3,
h5 {
  margin-bottom: 0;
  font-weight: bold;
}

h6 {
  font-weight: 600;
}

::-webkit-scrollbar {
  width: 0 !important;
}

img {
  width: 100%;
}

.news-logo {
  width: 30px;
  position: relative;
  bottom: 4px;
}

.selected {
  background: #202020;
  color: #ffffff;
}

.date,
.date-today {
  color: #999999;
  font-size: 14px;
  font-weight: normal;
}

.date-today {
  margin-bottom: 10px;
}

.overview {
  .loader {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    img {
      width: 70px;
      margin-bottom: 20px;
    }
  }

  .main {
    .header {
      background: #383e56;
      color: #ffffff;
      height: 60px;
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      h2 {
        margin-bottom: 0;
        font-weight: bold;
      }
    }

    background: #f2f2f2;
    min-height: 100vh;

    h1 {
      text-align: center;
    }

    .content {
      padding: 15px;

      .section {
        display: flex;
        flex-direction: column;

        .first {
          width: 100%;
          margin-right: 20px;
          margin-bottom: 20px;
        }

        .left-section,
        .right-section,
        .first {
          padding: 15px;
          background: #ffffff;
          border-radius: 10px;
          -webkit-box-shadow: 1px 1px 38px -21px rgba(0, 0, 0, 0.56);
          -moz-box-shadow: 1px 1px 38px -21px rgba(0, 0, 0, 0.56);
          box-shadow: 1px 1px 38px -21px rgba(0, 0, 0, 0.56);
        }

        .left-section {
          margin-bottom: 20px;

          .today-content {
            overflow: auto;

            .today-news {
              margin-bottom: 20px;

              .alt-image {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 200px;
                background: #f2f2f2;
                margin-bottom: 10px;
                background-image: url('../assets/img/news-alt.jpg');
                background-size: cover;
                background-repeat: no-repeat;

                // img {
                //   width: 40px;
                // }
              }

              p {
                .author {
                  font-weight: 600;
                }
              }

              img {
                width: 100%;
                margin-bottom: 10px;
              }
            }
          }
        }

        .right-section {
          margin-bottom: 20px;

          .yesterday {
            overflow: auto;
            .yesterday-content {
              margin-bottom: 20px;

              .yesterday-alt-image {
                min-width: 200px;
                height: 200px;
                display: flex;
                justify-content: center;
                background: #f2f2f2;

                background-image: url('../assets/img/news-alt.jpg');
                background-size: cover;
                background-repeat: no-repeat;

                // img {
                //   width: 40px;
                // }
              }
              .card-content p {
                font-size: 13px;
              }
            }
          }
        }
      }
    }
  }
}

@media (min-width: 992px) {
  .overview .main {
    .content {
      margin: 0 50px;
      padding: 0;

      .section {
        flex-direction: row;

        .first,
        .left-section,
        .right-section {
          margin-bottom: 0;
        }

        .first {
          width: 175px;
        }

        .left-section {
          width: 45%;
          margin-right: 20px;

          .today-content {
            height: 470px;
            overflow: auto;
          }
        }

        .right-section {
          width: 40%;

          .yesterday {
            height: 470px;
            overflow: auto;
            .yesterday-content {
              display: flex;
              align-items: center;
              margin-bottom: 10px;

              .yesterday-alt-image {
                height: 110px;
              }

              img {
                width: 200px;
              }

              .card-content {
                margin-left: 10px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
